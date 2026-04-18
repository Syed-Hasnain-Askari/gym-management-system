import React from "react";

// ─── STAT CARD ───────────────────────────────────────────────────────────────
export function StatCard({ icon, label, value, color, sub }) {
	return (
		<div
			className="relative overflow-hidden rounded-2xl border bg-card-bg px-6 py-5"
			style={{ borderColor: `${color}22` }}
		>
			<div
				className="absolute -top-5 -right-5 h-25 w-25 rounded-full"
				style={{ background: `${color}08` }}
			/>
			<div
				className="mb-3.5 flex h-10 w-10 items-center justify-center rounded-xl"
				style={{ background: `${color}18`, color }}
			>
				{icon}
			</div>
			<div className="text-3xl font-extrabold text-text-title">{value}</div>
			<div className="mt-0.5 text-[12px] font-medium tracking-wider text-text-muted uppercase">
				{label}
			</div>
			{sub && <div className="mt-1.5 text-[12px] text-[#444460]">{sub}</div>}
		</div>
	);
}
