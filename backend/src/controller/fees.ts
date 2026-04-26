import mongoose from "mongoose";
import Fees from "../model/fees.model.js";
import type { Request, Response, NextFunction } from "express";
import MemberShip from "../model/member.model.js";
import { logger } from "../utils/logger.js";

// Helper — get start and end of a month from a given date
function getMonthRange(date: Date): { start: Date; end: Date } {
	const start = new Date(date.getFullYear(), date.getMonth(), 1);
	const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
	return { start, end };
}

export const getFeesByUserId = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | undefined> => {
	try {
		const userId = new mongoose.Types.ObjectId(req.params.userId);

		const result = await Fees.find({ userId }).lean({ virtuals: true });

		if (result.length === 0) {
			return res.status(404).json({ message: "No fees found for this user." });
		}

		return res.status(200).json(result);
	} catch (error) {
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
		const userId = new mongoose.Types.ObjectId(req.params.userId);

		// Step 1 — check membership exists
		const userExists = await MemberShip.findById(userId);
		if (!userExists) {
			return res.status(404).json({ message: "Membership not found." });
		}

		// Step 2 — validate dueDate exists in body
		if (!req.body.dueDate) {
			return res.status(400).json({ message: "dueDate is required." });
		}

		const dueDate = new Date(req.body.dueDate);

		// Step 3 — block future months
		const now = new Date();
		if (
			dueDate.getFullYear() > now.getFullYear() ||
			(dueDate.getFullYear() === now.getFullYear() &&
				dueDate.getMonth() > now.getMonth())
		) {
			return res.status(400).json({
				message: "Due date cannot be a future month."
			});
		}

		// Step 4 — prevent duplicate fee for same month
		const { start, end } = getMonthRange(dueDate);
		const existingFee = await Fees.findOne({
			userId,
			dueDate: { $gte: start, $lt: end }
		});

		if (existingFee) {
			return res.status(400).json({
				message: `Fee for ${dueDate.toLocaleString("default", { month: "long", year: "numeric" })} already exists.`
			});
		}

		// Step 5 — create fee
		const fee = await Fees.create({
			...req.body,
			dueDate,
			userId
		});

		return res.status(201).json(fee);
	} catch (error: any) {
		if (error.name === "ValidationError") {
			const errors: Record<string, string> = {};
			for (const field in error.errors) {
				errors[field] = error.errors[field].message;
			}
			return res.status(400).json({ message: "Validation failed.", errors });
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
		const userId = new mongoose.Types.ObjectId(req.params.userId);

		// Step 1 — check membership exists
		const userExists = await MemberShip.findById(userId);
		if (!userExists) {
			return res.status(404).json({ message: "Membership not found." });
		}

		// Step 2 — validate dueDate exists in body
		if (!req.body.dueDate) {
			return res
				.status(400)
				.json({ message: "dueDate is required to identify the fee record." });
		}

		const dueDate = new Date(req.body.dueDate);
		const { start, end } = getMonthRange(dueDate);

		// Step 3 — find and update by userId + month range
		const updatedFee = await Fees.findOneAndUpdate(
			{
				userId,
				dueDate: { $gte: start, $lt: end }
			},
			{ $set: { ...req.body, dueDate } },
			{
				new: true,
				runValidators: true
			}
		).lean({ virtuals: true });

		if (!updatedFee) {
			return res.status(404).json({
				message: `No fee record found for ${dueDate.toLocaleString("default", { month: "long", year: "numeric" })}.`
			});
		}

		return res.status(200).json(updatedFee);
	} catch (error: any) {
		if (error.name === "ValidationError") {
			const errors: Record<string, string> = {};
			for (const field in error.errors) {
				errors[field] = error.errors[field].message;
			}
			return res.status(400).json({ message: "Validation failed.", errors });
		}
		logger.error(`Error updating fees for user ${req.params.userId}:`, error);
		next(error);
	}
};
