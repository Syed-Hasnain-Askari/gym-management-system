import { Request, Response, NextFunction } from "express";
import Membership from "../model/membership.model.js";
import { logger } from "../utils/logger.js";

export const purchaseMembership = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { memberId, plain } = req.body;
	logger.info(
		`Processing membership purchase for memberId: ${memberId}, plain: ${plain}`
	);
	try {
		const result = await Membership.create({
			memberId: memberId,
			paymentId: new Date().getTime().toString(), // Simulate a payment ID
			plain,
			status: "active",
			startDate: new Date(),
			endDate: new Date(
				Date.now() + (plain === "monthly" ? 30 : 365) * 24 * 60 * 60 * 1000
			)
		});

		res.status(201).json({ success: true, data: result });
	} catch (error: any) {
		logger.error("Purchase failed:", error.message);
		next(error);
	}
};
