import React, { useState } from "react";
import { Icons } from "../ui/Icons";

// ─── MEMBER FORM MODAL ───────────────────────────────────────────────────────
export function MemberModal({ member, onClose, onSave }) {
	const [form, setForm] = useState(
		member || {
			name: "",
			email: "",
			phone: "",
			plan: "Monthly",
			status: "active"
		}
	);
	const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

	return (
		<div
			className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/75 backdrop-blur-sm"
			onClick={(e) => e.target === e.currentTarget && onClose()}
		>
			<div className="max-h-[85vh] w-120 max-w-[90vw] overflow-y-auto rounded-2xl border border-[#2a2a3e] bg-card-bg p-7 shadow-2xl">
				<div className="mb-5.5 flex items-center justify-between">
					<div className="text-lg font-extrabold text-text-title">
						{member ? "Edit Member" : "Add New Member"}
					</div>
					<button
						className="cursor-pointer rounded-lg p-1.5 text-text-dim hover:bg-white/5 transition-colors"
						onClick={onClose}
					>
						<Icons.close />
					</button>
				</div>

				{[
					["name", "Full Name", "text", "Ahmed Khan"],
					["email", "Email Address", "email", "ahmed@example.com"],
					["phone", "Phone Number", "text", "0300-1234567"]
				].map(([k, lbl, type, ph]) => (
					<div key={k} className="mb-4">
						<label className="mb-1.5 block text-[12px] font-semibold tracking-wider text-text-muted uppercase">
							{lbl}
						</label>
						<input
							className="w-full rounded-lg border border-border-input bg-input-bg px-3.5 py-2.5 text-sm text-[#e0e0f0] outline-none transition-colors focus:border-primary-orange"
							type={type}
							placeholder={ph}
							value={form[k] || ""}
							onChange={(e) => set(k, e.target.value)}
						/>
					</div>
				))}

				<div className="mb-4">
					<label className="mb-1.5 block text-[12px] font-semibold tracking-wider text-text-muted uppercase">
						Membership Plan
					</label>
					<select
						className="w-full rounded-lg border border-border-input bg-input-bg px-3.5 py-2.5 text-sm text-[#e0e0f0] outline-none transition-colors focus:border-primary-orange"
						value={form.plan}
						onChange={(e) => set("plan", e.target.value)}
					>
						{["Monthly", "Quarterly", "Half-Yearly", "Yearly"].map((p) => (
							<option key={p}>{p}</option>
						))}
					</select>
				</div>

				<div className="mb-4">
					<label className="mb-1.5 block text-[12px] font-semibold tracking-wider text-text-muted uppercase">
						Status
					</label>
					<select
						className="w-full rounded-lg border border-border-input bg-input-bg px-3.5 py-2.5 text-sm text-[#e0e0f0] outline-none transition-colors focus:border-primary-orange"
						value={form.status}
						onChange={(e) => set("status", e.target.value)}
					>
						<option value="active">Active</option>
						<option value="inactive">Inactive</option>
					</select>
				</div>

				<div className="mt-6 flex justify-end gap-2.5">
					<button
						className="cursor-pointer rounded-lg bg-white/6 px-4.5 py-2.5 text-sm font-bold text-[#9090b0] transition-colors hover:bg-white/12"
						onClick={onClose}
					>
						Cancel
					</button>
					<button
						className="cursor-pointer rounded-lg bg-gradient-to-br from-primary-orange to-secondary-orange px-4.5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
						onClick={() => onSave(form)}
					>
						{member ? "Save Changes" : "Add Member"}
					</button>
				</div>
			</div>
		</div>
	);
}
