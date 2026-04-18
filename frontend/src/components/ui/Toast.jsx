import React from "react";

// ─── TOAST ───────────────────────────────────────────────────────────────────
export function Toast({ msg, type }) {
	const isSuccess = type === "success";

	return (
		<div
			className={`fixed right-6 bottom-6 z-[2000] animate-slide-in rounded-xl border px-5 py-3 text-sm font-semibold ${
				isSuccess
					? "border-[#166534] bg-[#14532d] text-[#4ade80]"
					: "border-[#991b1b] bg-[#7f1d1d] text-[#f87171]"
			}`}
		>
			{isSuccess ? "✓ " : "✗ "}
			{msg}
		</div>
	);
}
