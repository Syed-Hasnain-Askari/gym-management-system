import React, { useState } from "react";
import { Icons } from "../ui/Icons";

// ─── FEE MODAL ───────────────────────────────────────────────────────────────
export function FeeModal({ member, onClose, onAddFee, onToggleFee }) {
	const [form, setForm] = useState({ month: "", amount: "" });
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	];
	const currentYear = new Date().getFullYear();
	const monthOptions = months.map((m) => `${m} ${currentYear}`);

	const getBadgeClasses = (paid) => {
		const base =
			"inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider";
		return paid
			? `${base} bg-green-500/10 text-green-400`
			: `${base} bg-orange-500/12 text-orange-400`;
	};

	return (
		<div
			className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/75 backdrop-blur-sm"
			onClick={(e) => e.target === e.currentTarget && onClose()}
		>
			<div className="max-h-[85vh] w-140 max-w-[95vw] overflow-y-auto rounded-2xl border border-[#2a2a3e] bg-card-bg p-7 shadow-2xl">
				<div className="mb-5.5 flex items-center justify-between">
					<div className="text-lg font-extrabold text-text-title">
						Fee Management — {member.name}
					</div>
					<button
						className="cursor-pointer rounded-lg p-1.5 text-text-dim hover:bg-white/5 transition-colors"
						onClick={onClose}
					>
						<Icons.close />
					</button>
				</div>

				{/* Add fee row */}
				<div className="mb-5 rounded-xl border border-border-main bg-input-bg p-4">
					<div className="mb-3 text-[12px] font-bold tracking-wider text-text-muted uppercase">
						Add Fee Record
					</div>
					<div className="flex flex-col sm:flex-row gap-3">
						<select
							className="w-full sm:flex-[2] rounded-lg border border-border-input bg-card-bg px-3.5 py-2.5 text-sm text-[#e0e0f0] outline-none transition-colors focus:border-primary-orange"
							value={form.month}
							onChange={(e) =>
								setForm((f) => ({ ...f, month: e.target.value }))
							}
						>
							<option value="">Select Month</option>
							{monthOptions.map((m) => (
								<option key={m}>{m}</option>
							))}
						</select>
						<input
							className="w-full sm:flex-[1] rounded-lg border border-border-input bg-card-bg px-3.5 py-2.5 text-sm text-[#e0e0f0] outline-none transition-colors focus:border-primary-orange"
							type="number"
							placeholder="Amount (PKR)"
							value={form.amount}
							onChange={(e) =>
								setForm((f) => ({ ...f, amount: e.target.value }))
							}
						/>
						<button
							className="w-full sm:w-auto inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-gradient-to-br from-primary-orange to-secondary-orange px-4 py-2 text-[13px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
							disabled={!form.month || !form.amount}
							onClick={() => {
								if (form.month && form.amount) {
									onAddFee(member.id, form);
									setForm({ month: "", amount: "" });
								}
							}}
						>
							<Icons.plus /> Add
						</button>
					</div>
				</div>

				{/* Fee list */}
				<div className="mb-2.5 text-[12px] font-bold tracking-wider text-text-muted uppercase">
					Fee History
				</div>
				{member.fees.length === 0 && (
					<div className="py-3 text-[13px] text-[#444460]">
						No fee records yet.
					</div>
				)}
				{member.fees.map((fee) => (
					<div
						key={fee.id}
						className="mb-2 flex items-center justify-between rounded-xl border border-border-sub bg-[#14141f] p-3.5 transition-colors hover:bg-[#1a1a28]"
					>
						<div>
							<div className="text-[13px] font-bold text-[#d0d0e8]">
								{fee.month}
							</div>
							<div className="text-[12px] text-text-muted">
								PKR {fee.amount.toLocaleString()}
								{fee.paidDate ? ` · Paid ${fee.paidDate}` : ""}
							</div>
						</div>
						<div className="flex items-center gap-3">
							<span className={getBadgeClasses(fee.paid)}>
								{fee.paid ? "PAID" : "PENDING"}
							</span>
							<button
								className={`cursor-pointer rounded-lg px-3 py-1.5 text-[12px] font-bold transition-all ${
									fee.paid
										? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
										: "bg-green-500/10 text-green-400 hover:bg-green-500/20"
								}`}
								onClick={() => onToggleFee(member.id, fee.id, !fee.paid)}
							>
								{fee.paid ? "Mark Unpaid" : "Mark Paid"}
							</button>
						</div>
					</div>
				))}

				<div className="mt-6 flex justify-end">
					<button
						className="cursor-pointer rounded-lg bg-white/6 px-5 py-2.5 text-sm font-bold text-[#9090b0] transition-colors hover:bg-white/12"
						onClick={onClose}
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
}
