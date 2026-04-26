import React, { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import { InsightCard } from "../components/ui/InsightCard";

function buildFallbackInsights(stats) {
	return [
		{
			id: "members-overview",
			type: "success",
			title: "Member base steady",
			description: `${stats.totalMembers || 0} total members are on record, with ${stats.activeMembers || 0} currently active.`,
			metric: `${stats.totalMembers || 0}`
		},
		{
			id: "fees-collected",
			type: "info",
			title: "Collected fees",
			description: `Collected fees currently stand at PKR ${(stats.collectedFees || 0).toLocaleString()}.`,
			metric: `PKR ${(stats.collectedFees || 0).toLocaleString()}`
		},
		{
			id: "pending-fees",
			type: (stats.pendingFees || 0) > 0 ? "warning" : "success",
			title: "Pending fee balance",
			description: `Pending fees are PKR ${(stats.pendingFees || 0).toLocaleString()} across the current dashboard data.`,
			metric: `PKR ${(stats.pendingFees || 0).toLocaleString()}`
		}
	];
}

export function DashboardPage({ stats, members }) {
	const [insights, setInsights] = useState(() => buildFallbackInsights(stats));
	const [insightsState, setInsightsState] = useState("loading");

	useEffect(() => {
		let isMounted = true;

		async function loadInsights() {
			setInsightsState("loading");

			const response = await apiFetch("/insights");
			const liveInsights = Array.isArray(response?.insights)
				? response.insights.slice(0, 3)
				: [];

			if (!isMounted) {
				return;
			}

			if (liveInsights.length > 0) {
				setInsights(liveInsights);
				setInsightsState("live");
				return;
			}

			setInsights(buildFallbackInsights(stats));
			setInsightsState("fallback");
		}

		loadInsights();

		return () => {
			isMounted = false;
		};
	}, [stats]);

	const recent = [...members]
		.sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate))
		.slice(0, 5);

	const getBadgeClasses = (type) => {
		const base =
			"inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase";
		if (type === "active" || type === "paid") {
			return `${base} bg-green-500/10 text-green-400`;
		}
		if (type === "inactive") {
			return `${base} bg-red-500/10 text-red-400`;
		}
		return `${base} bg-orange-500/12 text-orange-400`;
	};

	return (
		<div>
			<div className="mb-1 text-2xl font-extrabold text-text-title md:text-[26px]">
				Dashboard
			</div>
			<div className="mb-7 text-[13px] text-text-muted">
				Welcome back! Here&apos;s your gym overview.
			</div>

			<div className="mb-4 flex items-center justify-between gap-4">
				<div>
					<div className="text-[14px] font-bold tracking-[0.18em] text-[#8d8da7] uppercase">
						Live business insights
					</div>
					<div className="mt-1 text-[13px] text-text-muted">
						Auto-generated from your latest backend data.
					</div>
				</div>
				<div
					className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold tracking-[0.18em] uppercase ${
						insightsState === "live"
							? "border-green-500/20 bg-green-500/10 text-green-300"
							: insightsState === "loading"
								? "border-orange-500/20 bg-orange-500/10 text-orange-300"
								: "border-border-main bg-input-bg text-[#9a9ab2]"
					}`}
				>
					<span
						className={`h-2 w-2 rounded-full ${
							insightsState === "live"
								? "bg-green-400"
								: insightsState === "loading"
									? "bg-orange-400"
									: "bg-[#666680]"
						}`}
					/>
					{insightsState === "live"
						? "API connected"
						: insightsState === "loading"
							? "Loading insights"
							: "Showing fallback"}
				</div>
			</div>

			<div className="mb-8 grid grid-cols-1 gap-4 xl:grid-cols-3">
				{insights.map((insight, index) => (
					<InsightCard key={insight.id || index} insight={insight} index={index} />
				))}
			</div>

			<div className="overflow-hidden rounded-2xl border border-border-main bg-card-bg">
				<div className="flex items-center justify-between border-b border-[#1a1a28] px-6 py-4.5">
					<div className="text-[15px] font-bold text-[#e0e0f0]">
						Recent Members
					</div>
				</div>
				<div className="overflow-x-auto">
					<table className="min-w-[600px] w-full border-collapse">
						<thead>
							<tr>
								{["Name", "Plan", "Joined", "Status"].map((h) => (
									<th
										key={h}
										className="border-b border-[#1a1a28] px-4 py-2.5 text-left text-[11px] font-bold tracking-widest text-[#444460] uppercase"
									>
										{h}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{recent.map((m) => (
								<tr key={m.id} className="transition-colors hover:bg-white/1.5">
									<td className="border-b border-[#14141f] px-4 py-3.5 text-[13px] text-[#c0c0d8]">
										<div className="flex items-center gap-2.5">
											<div className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-gradient-to-br from-primary-orange to-secondary-orange text-[12px] font-extrabold text-white">
												{m.name.charAt(0)}
											</div>
											<span className="font-semibold text-[#d8d8f0]">
												{m.name}
											</span>
										</div>
									</td>
									<td className="border-b border-[#14141f] px-4 py-3.5 text-[13px] text-[#c0c0d8]">
										{m.plan}
									</td>
									<td className="border-b border-[#14141f] px-4 py-3.5 text-[13px] text-[#c0c0d8]">
										{m.joinDate}
									</td>
									<td className="border-b border-[#14141f] px-4 py-3.5 text-[13px] text-[#c0c0d8]">
										<span className={getBadgeClasses(m.status)}>
											{m.status}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
