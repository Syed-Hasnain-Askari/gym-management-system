import { Request, Response, NextFunction } from "express";
import Fees, { IFees } from "../model/fees.model.js";
import Membership from "../model/membership.model.js";
import Member from "../model/member.model.js";
import { logger } from "../utils/logger.js";
import { withTransaction } from "../utils/transaction.js";

export const purchaseMembership = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { memberId, month, plain, amount } = req.body;

	try {
		const result = await withTransaction(async (session) => {
			const userId = await Member.findOne({ _id: memberId }).session(session);
			if (!userId) {
				logger.error("Invalid member ID");
				return res.status(400).json({ message: "Invalid member ID" });
			}
			// Step 1 — Create payment record
			const payment: IFees = await Fees.create([
				{
					userId: memberId,
					month: month,
					plain: plain,
					amount: amount,
					feeStatus: "paid"
				},

				{ session }
			]);

			// Step 2 — Create membership record
			const membership = await Membership.create(
				[
					{
						userId: memberId,
						membershipType: plain,
						paymentId: payment[0]._id,
						status: "active",
						startDate: new Date(),
						endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
					}
				],
				{ session }
			);

			return { payment: payment[0], membership: membership[0] };
		});

		res.status(201).json({ success: true, data: result });
	} catch (error) {
		console.error("Purchase failed:", error.message);
		next(error);
	}
};
