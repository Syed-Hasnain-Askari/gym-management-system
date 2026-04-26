import llmClient from "./ai/llmClient.js";
import {
	fetchAttendancePatterns,
	fetchMembershipStats,
	fetchOverdueFees,
	fetchRevenueComparison
} from "./insightQueries.js";
import { logger } from "../utils/logger.js";

const MODEL = process.env.INSIGHTS_MODEL ?? "gemini-2.0-flash";

export interface Insight {
	id: string;
	type: "warning" | "success" | "info" | "danger";
	title: string;
	description: string;
	metric?: string;
}

interface InsightDataSnapshot {
	revenue: Awaited<ReturnType<typeof fetchRevenueComparison>>;
	overdue: Awaited<ReturnType<typeof fetchOverdueFees>>;
	membership: Awaited<ReturnType<typeof fetchMembershipStats>>;
	attendance: Awaited<ReturnType<typeof fetchAttendancePatterns>> | string;
}

function hasAttendanceData(
	attendance: InsightDataSnapshot["attendance"]
): attendance is NonNullable<Awaited<ReturnType<typeof fetchAttendancePatterns>>> {
	return attendance !== "No attendance data available";
}

function parseInsightArray(raw: string): Insight[] | null {
	const cleaned = raw.replace(/```json|```/g, "").trim();
	const start = cleaned.indexOf("[");
	const end = cleaned.lastIndexOf("]");

	if (start === -1 || end === -1 || end < start) {
		return null;
	}

	try {
		return JSON.parse(cleaned.slice(start, end + 1)) as Insight[];
	} catch {
		return null;
	}
}

function buildFallbackInsights(data: InsightDataSnapshot): Insight[] {
	const insights: Insight[] = [];
	const { revenue, overdue, membership, attendance } = data;

	if (revenue.changePct !== null) {
		const isUp = revenue.changePct >= 0;
		insights.push({
			id: "revenue-trend",
			type: isUp ? "success" : Math.abs(revenue.changePct) > 20 ? "danger" : "warning",
			title: isUp ? "Revenue climbing" : "Revenue softened",
			description: `Paid fees total ${revenue.thisWeek} this week versus ${revenue.lastWeek} last week, a ${Math.abs(revenue.changePct)}% ${isUp ? "increase" : "decrease"}.`,
			metric: `${revenue.changePct}%`
		});
	} else if (revenue.thisWeek > 0) {
		insights.push({
			id: "revenue-first-window",
			type: "success",
			title: "Fresh paid revenue",
			description: `Paid fees reached ${revenue.thisWeek} this week, while the previous comparison window had no paid fee records.`,
			metric: String(revenue.thisWeek)
		});
	}

	if (overdue.overdueCount > 0) {
		insights.push({
			id: "stale-unpaid-fees",
			type: overdue.overdueCount >= 10 ? "danger" : "warning",
			title: "Unpaid fees aging",
			description: `${overdue.overdueCount} unpaid fee records are older than 30 days, totaling ${overdue.totalOutstandingAmount}.`,
			metric: String(overdue.overdueCount)
		});
	}

	insights.push({
		id: "membership-mix",
		type: membership.active >= membership.inactive ? "success" : "warning",
		title: "Membership mix",
		description: `There are ${membership.active} active memberships and ${membership.inactive} inactive memberships, with ${membership.newThisMonth} new members added in the last 30 days.`,
		metric: `${membership.active}/${membership.inactive}`
	});

	if (hasAttendanceData(attendance) && attendance.peakHours.length > 0) {
		const topHour = attendance.peakHours[0];
		insights.push({
			id: "peak-attendance-hour",
			type: "info",
			title: "Peak check-in time",
			description: `The busiest recent attendance hour was ${topHour.hour}:00 with ${topHour.visits} check-ins in the last 7 days.`,
			metric: `${topHour.hour}:00`
		});
	} else {
		insights.push({
			id: "attendance-unavailable",
			type: "info",
			title: "Attendance unavailable",
			description:
				"Attendance insight is currently skipped because no attendance collection was found in the database."
		});
	}

	return insights.slice(0, 5);
}

export async function generateInsights(): Promise<Insight[]> {
	const [revenue, overdue, membership, attendance] = await Promise.all([
		fetchRevenueComparison(),
		fetchOverdueFees(),
		fetchMembershipStats(),
		fetchAttendancePatterns()
	]);

	const rawData: InsightDataSnapshot = {
		revenue,
		overdue,
		membership,
		attendance: attendance ?? "No attendance data available"
	};

	try {
		const response = await llmClient.chat.completions.create({
			model: MODEL,
			messages: [
				{
					role: "system",
					content: `
You are a business intelligence analyst for a gym management system.
Analyze the provided data and return ONLY a JSON array of insight objects.
No markdown, no explanation, no backticks.

Each insight must follow this exact structure:
{
  "id": "unique_string",
  "type": "warning" | "success" | "info" | "danger",
  "title": "short title max 6 words",
  "description": "1 sentence, specific, data-driven insight",
  "metric": "key number or percentage (optional)"
}

Type rules:
- "danger" -> urgent problem (revenue drop > 20%, many overdue fees)
- "warning" -> needs attention (revenue drop <= 20%, moderate overdue)
- "success" -> positive trend (revenue up, new members growing)
- "info" -> neutral observation (peak hours, patterns)

Return 3 to 5 insights maximum. Be specific and use actual numbers from the data.
If a field explains a schema limitation, respect it and do not invent unavailable facts.
					`.trim()
				},
				{
					role: "user",
					content: `Analyze this gym data and generate insights:\n${JSON.stringify(rawData, null, 2)}`
				}
			]
		});

		const raw = response.choices[0]?.message?.content?.trim() ?? "[]";
		const parsed = parseInsightArray(raw);

		if (parsed && parsed.length > 0) {
			return parsed.slice(0, 5);
		}

		logger.warn("Insight model returned unparsable JSON, using fallback insights");
	} catch (error) {
		logger.error("Insight generation failed, using fallback insights", {
			error
		});
	}

	return buildFallbackInsights(rawData);
}
