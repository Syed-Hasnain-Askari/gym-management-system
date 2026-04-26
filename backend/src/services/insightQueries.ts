import mongoose from "mongoose";
import Fees from "../model/fees.model.js";
import Member from "../model/member.model.js";
import Membership from "../model/membership.model.js";

export interface RevenueComparison {
	thisWeek: number;
	lastWeek: number;
	changePct: number | null;
}

export interface OverdueFeesSummary {
	overdueCount: number;
	totalOutstandingAmount: number;
	basis: string;
}

export interface MembershipStats {
	active: number;
	inactive: number;
	newThisMonth: number;
}

export interface AttendancePatterns {
	peakHours: Array<{ hour: number; visits: number }>;
}

function startOfDay(date: Date): Date {
	const next = new Date(date);
	next.setHours(0, 0, 0, 0);
	return next;
}

function percentageChange(current: number, previous: number): number | null {
	if (previous === 0) {
		return current === 0 ? 0 : null;
	}

	return Number((((current - previous) / previous) * 100).toFixed(1));
}

export async function fetchRevenueComparison(): Promise<RevenueComparison> {
	const now = new Date();
	const startOfThisWeek = startOfDay(new Date(now));
	startOfThisWeek.setDate(startOfThisWeek.getDate() - 7);

	const startOfLastWeek = startOfDay(new Date(now));
	startOfLastWeek.setDate(startOfLastWeek.getDate() - 14);

	const [thisWeek, lastWeek] = await Promise.all([
		Fees.aggregate<{ total: number }>([
			{
				$match: {
					feeStatus: "paid",
					createdAt: { $gte: startOfThisWeek }
				}
			},
			{ $group: { _id: null, total: { $sum: "$amount" } } }
		]),
		Fees.aggregate<{ total: number }>([
			{
				$match: {
					feeStatus: "paid",
					createdAt: { $gte: startOfLastWeek, $lt: startOfThisWeek }
				}
			},
			{ $group: { _id: null, total: { $sum: "$amount" } } }
		])
	]);

	const thisWeekTotal = thisWeek[0]?.total ?? 0;
	const lastWeekTotal = lastWeek[0]?.total ?? 0;

	return {
		thisWeek: thisWeekTotal,
		lastWeek: lastWeekTotal,
		changePct: percentageChange(thisWeekTotal, lastWeekTotal)
	};
}

export async function fetchOverdueFees(): Promise<OverdueFeesSummary> {
	const thirtyDaysAgo = startOfDay(new Date());
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

	const overdueFees = await Fees.find({
		feeStatus: "unpaid",
		createdAt: { $lte: thirtyDaysAgo }
	})
		.select({ amount: 1 })
		.lean();

	return {
		overdueCount: overdueFees.length,
		totalOutstandingAmount: overdueFees.reduce(
			(sum, fee) => sum + (fee.amount ?? 0),
			0
		),
		basis:
			"Derived from unpaid fee records older than 30 days because the current schema has no dueDate field."
	};
}

export async function fetchMembershipStats(): Promise<MembershipStats> {
	const thirtyDaysAgo = startOfDay(new Date());
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

	const [active, inactive, newThisMonth] = await Promise.all([
		Membership.countDocuments({ status: "active" }),
		Membership.countDocuments({ status: "inactive" }),
		Member.countDocuments({ createdAt: { $gte: thirtyDaysAgo } })
	]);

	return { active, inactive, newThisMonth };
}

export async function fetchAttendancePatterns(): Promise<AttendancePatterns | null> {
	const db = mongoose.connection.db;

	if (!db) {
		return null;
	}

	const hasAttendance = await db
		.listCollections({ name: "attendance" }, { nameOnly: true })
		.toArray();

	if (hasAttendance.length === 0) {
		return null;
	}

	const sevenDaysAgo = startOfDay(new Date());
	sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

	const pattern = await db
		.collection("attendance")
		.aggregate<{ _id: number; count: number }>([
			{
				$addFields: {
					eventTime: { $ifNull: ["$checkInTime", "$createdAt"] }
				}
			},
			{ $match: { eventTime: { $gte: sevenDaysAgo } } },
			{
				$group: {
					_id: { $hour: "$eventTime" },
					count: { $sum: 1 }
				}
			},
			{ $sort: { count: -1, _id: 1 } },
			{ $limit: 3 }
		])
		.toArray();

	return {
		peakHours: pattern.map((entry) => ({
			hour: entry._id,
			visits: entry.count
		}))
	};
}
