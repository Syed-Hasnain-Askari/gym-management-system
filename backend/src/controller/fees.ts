import mongoose from "mongoose";
import Fees, { IFees } from "../model/fees.model.js";
import type { Request, Response, NextFunction } from "express";
import MemberShip from "../model/member.model.js";
import { logger } from "../utils/logger.js";

export const getFeesByUserId = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | undefined> => {
	try {
		const userId = new mongoose.Types.ObjectId(req.params.userId as string);
		const result = await Fees.find().where("userId").equals(userId).lean();
		if (result.length === 0) {
			return res.status(400).json({ message: "Invalid user ID" });
		}
		return res.status(200).json(result);
	} catch (error: any) {
		logger.error(`Error fetching fees for user ${req.params.userId}:`, error);
		next(error);
	}
};
export const addFeesByUserId = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | undefined> => {
	try {
		const userId = new mongoose.Types.ObjectId(req.params.userId as string);

		// ✅ Step 1: Check if user exists in Membership
		const userExists = await MemberShip.findById(userId);
		if (!userExists) {
			return res.status(400).json({ message: "Invalid user ID" });
		}

		// ✅ Step 2: Prevent duplicate month entry
		const existingFee = await Fees.findOne({
			userId,
			month: req.body.month
		});

		if (existingFee) {
			return res
				.status(400)
				.json({ message: "Fees for this month already paid" });
		}

		// ✅ Step 3: Create fee
		const fees = await Fees.create({
			...req.body,
			userId
		});

		return res.status(201).json(fees);
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
		logger.error(`Error adding fees for user ${req.params.userId}:`, error);
		next(error);
	}
};
export const updateFeesByUserId = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | undefined> => {
	try {
		const userId = new mongoose.Types.ObjectId(req.params.userId as string);
		console.log(userId, "userId");
		// ✅ Step 1: Check if user exists in Membership
		const userExists = await MemberShip.findById(userId);
		if (!userExists) {
			return res.status(400).json({ message: "Invalid user ID" });
		}
		const updatedFee = await Fees.findOneAndUpdate(
			{
				userId: userId,
				month: req.body.month
			},
			{
				$set: req.body // updates whole document fields from request body
			},
			{
				new: true, // return updated document
				runValidators: true // ensure schema validation
			}
		);
		return res.status(201).json(updatedFee);
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
		logger.error(`Error updating fees for user ${req.params.userId}:`, error);
		next(error);
	}
};
