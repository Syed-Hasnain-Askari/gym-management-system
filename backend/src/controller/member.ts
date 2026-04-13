import MemberShip from "../model/member.model.js";
import { Request, Response } from "express";

export const getMembers = async (
	req: Request,
	res: Response
): Promise<void> => {
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 10;
	const search = (req.query.search as string) || "";
	const sortField = (req.query.sort as string) || "createdAt";
	const sortOrder = req.query.order === "asc" ? 1 : -1;

	const skip = (page - 1) * limit;

	// 🔍 Search filter
	const filter = search
		? {
				name: { $regex: search, $options: "i" }
			}
		: {};

	try {
		const members = await MemberShip.find(filter)
			.sort({ [sortField]: sortOrder })
			.skip(skip)
			.limit(limit)
			.lean();
		const total = await MemberShip.countDocuments();
		res.status(200).json({
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
			data: members
		});
	} catch (error: any) {
		res
			.status(500)
			.json({ message: `Failed to fetch members: ${error.message}` });
	}
};

export const addMembers = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		await MemberShip.create(req.body);

		return res.status(201).json({
			message: "Member added successfully"
		});
	} catch (error: any) {
		if (error.name === "ValidationError") {
			const errors: any = {};

			for (const field in error.errors) {
				errors[field] = error.errors[field].message;
			}

			return res.status(400).json({
				message: "Validation failed",
				errors
			});
		}

		return res.status(500).json({
			message: "Something went wrong"
		});
	}
};

export const editMember = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		const member_id = req.params.id;
		await MemberShip.findByIdAndUpdate(member_id, req.body, {
			new: true,
			runValidators: true
		});
		return res.status(200).json({
			message: "Member updated successfully"
		});
	} catch (error: any) {
		return res.status(500).json({
			message: "Something went wrong"
		});
	}
};
export const deleteMember = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		const member_id = req.params.id;
		await MemberShip.findByIdAndDelete(member_id);
		return res.status(200).json({
			message: "Member deleted successfully"
		});
	} catch (error: any) {
		if (error.name === "ValidationError") {
			const errors: any = {};

			for (const field in error.errors) {
				errors[field] = error.errors[field].message;
			}

			return res.status(400).json({
				message: "Validation failed",
				errors
			});
		}

		return res.status(500).json({
			message: "Something went wrong"
		});
	}
};
export const getMemberById = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		const member_id = req.params.id;
		const member = await MemberShip.findById(member_id);
		return res.status(200).json({
			data: member,
			message: "Member fetched successfully"
		});
	} catch (error: any) {
		return res.status(500).json({
			message: "Something went wrong"
		});
	}
};
