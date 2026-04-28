import { Request, Response, NextFunction } from "express";
import Membership from "../model/membership.model.js";
import Member from "../model/member.model.js";
import { logger } from "../utils/logger.js";
import mongoose from "mongoose";

export const getMemberships = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 10;
	const search = (req.query.search as string) || "";
	const sortField = (req.query.sort as string) || "createdAt";
	const sortOrder = req.query.order === "asc" ? 1 : -1;
	const skip = (page - 1) * limit;

	const matchStage = search
		? { $match: { name: { $regex: search, $options: "i" } } }
		: { $match: {} };

	try {
		const pipeline: mongoose.PipelineStage[] = [
			// Step 1 — start from members, filter by name search
			matchStage,

			// Step 2 — join memberships where memberships.memberId === members._id
			{
				$lookup: {
					from: "memberships",
					localField: "_id",
					foreignField: "memberId",
					as: "membership"
				}
			},

			// Step 3 — only return members who HAVE a membership
			{
				$match: {
					membership: { $ne: [] }
				}
			},

			// Step 4 — pick latest membership if multiple exist
			{
				$addFields: {
					membership: {
						$arrayElemAt: [
							{
								$sortArray: {
									input: "$membership",
									sortBy: { createdAt: -1 }
								}
							},
							0
						]
					}
				}
			},

			// Step 5 — shape output with fields from both collections
			{
				$project: {
					_id: "$membership._id", // membership _id as main id
					memberId: "$_id", // original member _id
					name: 1, // from members
					email: 1, // from members
					phone: 1, // from members
					plan: "$membership.plan",
					status: "$membership.status",
					startDate: "$membership.startDate",
					endDate: "$membership.endDate",
					paymentId: "$membership.paymentId",
					createdAt: "$membership.createdAt"
				}
			},

			// Step 6 — sort
			{ $sort: { [sortField]: sortOrder } },

			// Step 7 — pagination
			{ $skip: skip },
			{ $limit: limit }
		];

		const [memberships, totalResult] = await Promise.all([
			Member.aggregate(pipeline),
			Member.aggregate([
				matchStage,
				{
					$lookup: {
						from: "memberships",
						localField: "_id",
						foreignField: "memberId",
						as: "membership"
					}
				},
				{ $match: { membership: { $ne: [] } } },
				{ $count: "total" }
			])
		]);

		const total = totalResult[0]?.total ?? 0;

		res.status(200).json({
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
			data: memberships
		});
	} catch (error: any) {
		logger.error("Error fetching memberships:", error);
		next(error);
	}
};
export const purchaseMembership = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { name, email, phoneNumber, plan } = req.body; // 👈 HERE

	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		// 1. Create Member
		const member = await Member.create([{ name, email, phoneNumber }], {
			session
		});

		// 2. Create Membership
		const membership = await Membership.create(
			[
				{
					memberId: member[0]._id,
					paymentId: Date.now().toString(),
					plan,
					status: "active",
					startDate: new Date(),
					endDate: new Date(
						Date.now() + (plan === "monthly" ? 30 : 365) * 24 * 60 * 60 * 1000
					)
				}
			],
			{ session }
		);

		await session.commitTransaction();
		session.endSession();

		res.status(201).json({
			success: true,
			data: {
				member: member[0],
				membership: membership[0]
			}
		});
		logger.info(
			`Member ${member[0]._id} created with membership ${membership[0]._id}`
		);
	} catch (err) {
		await session.abortTransaction();
		session.endSession();
		logger.error("Error creating member with membership:", err);
		next(err);
	}
};
export const updateMembership = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { memberId } = req.params;
	const { name, email, phoneNumber, plan, status } = req.body;

	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		// 1. Update Member
		const member = await Member.findByIdAndUpdate(
			memberId,
			{ name, email, phoneNumber },
			{ new: true, runValidators: true, session }
		);

		if (!member) {
			throw new Error("Member not found");
		}

		// 2. Find active membership
		const membership = await Membership.findOne({
			memberId,
			status: "active"
		}).session(session);

		let updatedMembership = null;

		// 3. Update membership if plan/status provided
		if (membership && (plan || status)) {
			const updatedFields: any = {};

			if (plan) {
				updatedFields.plan = plan;

				// recalculate end date when plan changes
				updatedFields.endDate = new Date(
					Date.now() + (plan === "monthly" ? 30 : 365) * 24 * 60 * 60 * 1000
				);
			}

			if (status) {
				updatedFields.status = status;
			}

			updatedMembership = await Membership.findByIdAndUpdate(
				membership._id,
				updatedFields,
				{ new: true, session }
			);
		}

		await session.commitTransaction();
		session.endSession();

		res.status(200).json({
			success: true,
			data: {
				member,
				membership: updatedMembership
			}
		});
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		next(error);
	}
};
