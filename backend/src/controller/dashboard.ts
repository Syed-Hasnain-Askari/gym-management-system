import Fees from "../model/fees.model.js";
import MemberShip from "../model/member.model.js";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const getDashboardStats = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		const month = req.query.month as string;
		console.log(month, "month in dashboard");
		const totalMembers = await MemberShip.countDocuments();

		const fees = await Fees.find({ month });
		console.log(fees, "fees in dashboard");
		const collectedFees = fees
			.filter((f) => f.feeStatus === "paid")
			.reduce((sum, f) => sum + (f.amount || 0), 0);
		console.log(collectedFees, "collectedFees");
		const unpaidFees = fees
			.filter((f) => f.feeStatus === "unpaid")
			.reduce((sum, f) => sum + (f.amount || 0), 0);
		console.log(unpaidFees, "unpaidFees");

		return res.json({
			month,
			totalMembers,
			collectedFees,
			unpaidFees
		});
	} catch (err) {
		return res.status(500).json({ message: "Server error" });
	}
};
