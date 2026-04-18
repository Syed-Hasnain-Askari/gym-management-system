import React from "react";
import { StatCard } from "../components/ui/StatCard";
import { Icons } from "../components/ui/Icons";

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
export function DashboardPage({ stats, members }) {
	const recent = [...members]
		.sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate))
		.slice(0, 5);

	const getBadgeClasses = (type) => {
		const base = "inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase";
		if (type === "active" || type === "paid")
			return `${base} bg-green-500/10 text-green-400`;
		if (type === "inactive") return `${base} bg-red-500/10 text-red-400`;
		return `${base} bg-orange-500/12 text-orange-400`;
	};

	return (
		<div>
			<div className="mb-1 text-2xl md:text-[26px] font-extrabold text-text-title">
				Dashboard
			</div>
			<div className="mb-7 text-[13px] text-text-muted">
				Welcome back! Here's your gym overview.
			</div>

			<div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				<StatCard
					icon={<Icons.users />}
					label="Total Members"
					value={stats.totalMembers}
					color="#f97316"
					sub={`${stats.activeMembers} active · ${stats.inactiveMembers} inactive`}
				/>
				<StatCard
					icon={<Icons.check />}
					label="Collected Fees"
					value={`PKR ${(stats.collectedFees || 0).toLocaleString()}`}
					color="#22c55e"
				/>
				<StatCard
					icon={<Icons.fees />}
					label="Pending Fees"
					value={`PKR ${(stats.pendingFees || 0).toLocaleString()}`}
					color="#ef4444"
				/>
			</div>

			<div className="overflow-hidden rounded-2xl border border-border-main bg-card-bg">
				<div className="flex items-center justify-between border-b border-[#1a1a28] px-6 py-4.5">
					<div className="text-[15px] font-bold text-[#e0e0f0]">
						Recent Members
					</div>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full border-collapse min-w-[600px]">
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
								<tr key={m.id} className="hover:bg-white/1.5 transition-colors">
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
