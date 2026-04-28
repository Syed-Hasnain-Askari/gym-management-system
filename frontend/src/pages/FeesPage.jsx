import React from "react";
import { StatCard } from "../components/ui/StatCard";
import { Icons } from "../components/ui/Icons";
import { useGymData } from "../context/GymDataContext";

// ─── FEES PAGE ────────────────────────────────────────────────────────────────
export function FeesPage() {
	const { members } = useGymData();
	const allFees = members.flatMap((m) =>
		m.fees.map((f) => ({ ...f, memberName: m.name }))
	);
	const pending = allFees.filter((f) => !f.paid);
	const paid = allFees.filter((f) => f.paid);

	const getBadgeClasses = (type) => {
		const base =
			"inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider";
		if (type === "paid") return `${base} bg-green-500/10 text-green-400`;
		return `${base} bg-orange-500/12 text-orange-400`;
	};

	return (
		<div>
			<div className="mb-1 text-2xl md:text-[26px] font-extrabold text-text-title">
				Fee Overview
			</div>
			<div className="mb-7 text-[13px] text-text-muted">
				All pending and collected fees across members
			</div>

			<div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				<StatCard
					icon={<Icons.dollar />}
					label="Total Fees"
					value={`PKR ${allFees
						.reduce((s, f) => s + f.amount, 0)
						.toLocaleString()}`}
					color="#f97316"
				/>
				<StatCard
					icon={<Icons.check />}
					label="Collected"
					value={`PKR ${paid
						.reduce((s, f) => s + f.amount, 0)
						.toLocaleString()}`}
					color="#22c55e"
				/>
				<StatCard
					icon={<Icons.fees />}
					label="Pending"
					value={`PKR ${pending
						.reduce((s, f) => s + f.amount, 0)
						.toLocaleString()}`}
					color="#ef4444"
				/>
			</div>

			<div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
				<div className="overflow-hidden rounded-2xl border border-border-main bg-card-bg">
					<div className="flex items-center justify-between border-b border-[#1a1a28] px-6 py-4.5">
						<div className="text-[15px] font-bold text-[#e0e0f0]">
							⏳ Pending Fees
						</div>
						<span className={getBadgeClasses("pending")}>{pending.length}</span>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full border-collapse min-w-[400px]">
							<thead>
								<tr>
									{["Member", "Month", "Amount"].map((h) => (
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
								{pending.length === 0 && (
									<tr>
										<td
											colSpan={3}
											className="px-4 py-8 text-center text-[13px] text-[#444460]"
										>
											All fees collected!
										</td>
									</tr>
								)}
								{pending.map((f) => (
									<tr key={f.id} className="hover:bg-white/1.5 transition-colors">
										<td className="border-b border-[#14141f] px-4 py-3.5 text-[13px] text-[#c0c0d8]">
											{f.memberName}
										</td>
										<td className="border-b border-[#14141f] px-4 py-3.5 text-[13px] text-[#c0c0d8]">
											{f.month}
										</td>
										<td className="border-b border-[#14141f] px-4 py-3.5 text-[13px] font-bold text-orange-400">
											PKR {f.amount.toLocaleString()}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				<div className="overflow-hidden rounded-2xl border border-border-main bg-card-bg">
					<div className="flex items-center justify-between border-b border-[#1a1a28] px-6 py-4.5">
						<div className="text-[15px] font-bold text-[#e0e0f0]">
							✅ Paid Fees
						</div>
						<span className={getBadgeClasses("paid")}>{paid.length}</span>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full border-collapse min-w-[400px]">
							<thead>
								<tr>
									{["Member", "Month", "Amount"].map((h) => (
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
								{paid.map((f) => (
									<tr key={f.id} className="hover:bg-white/1.5 transition-colors">
										<td className="border-b border-[#14141f] px-4 py-3.5 text-[13px] text-[#c0c0d8]">
											{f.memberName}
										</td>
										<td className="border-b border-[#14141f] px-4 py-3.5 text-[13px] text-[#c0c0d8]">
											{f.month}
										</td>
										<td className="border-b border-[#14141f] px-4 py-3.5 text-[13px] font-bold text-green-400">
											PKR {f.amount.toLocaleString()}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
