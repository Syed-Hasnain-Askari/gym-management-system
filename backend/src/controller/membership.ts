import { Request, Response, NextFunction } from "express";
import Membership, { IMemberShip } from "../model/membership.model.js";
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
			result: memberships
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
	console.log("Request body:", req.body);
	const { name, email, phone, plan } = req.body;
	if (name === undefined || email === undefined || plan === undefined) {
		return res.status(400).json({
			success: false,
			message: "Missing required fields: name, email, and plan are required."
		});
	}

	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		// 1. Find or Create Member
		let member = await Member.findOne({ email }).session(session);

		if (!member) {
			const created = await Member.create([{ name, email, phone }], {
				session
			});
			member = created[0];
		}

		// 2. Create Membership
		const membership = await Membership.create(
			[
				{
					memberId: member._id,
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
			result: {
				...member.toObject(),
				...membership[0].toObject()
			}
		});
	} catch (err: any) {
		await session.abortTransaction();
		session.endSession();

		// 🔥 Handle duplicate error cleanly
		if (err.code === 11000) {
			return res.status(400).json({
				success: false,
				message: "Email already exists"
			});
		}

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

		// 2. Get latest membership (NOT only active)
		const membership = await Membership.findOne({ memberId })
			.sort({ createdAt: -1 })
			.session(session);

		let updatedMembership = null;

		if (membership) {
			const updatedFields: any = {};

			if (plan) {
				updatedFields.plan = plan;
				updatedFields.endDate = new Date(
					Date.now() + (plan === "monthly" ? 30 : 365) * 24 * 60 * 60 * 1000
				);
			}

			if (status) {
				updatedFields.status = status;
			}

			if (Object.keys(updatedFields).length > 0) {
				updatedMembership = await Membership.findByIdAndUpdate(
					membership._id,
					updatedFields,
					{ new: true, session }
				);
			}
		}

		await session.commitTransaction();

		// ✅ Prepare response BEFORE ending session
		const responseData = {
			...member.toObject(),
			...(updatedMembership ? updatedMembership.toObject() : {})
		};

		session.endSession();

		res.status(200).json({
			success: true,
			result: responseData
		});
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		next(error);
	}
};
