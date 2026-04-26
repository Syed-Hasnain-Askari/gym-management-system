import React from "react";
import { Icons } from "./Icons";

const CARD_STYLES = {
	success: {
		accent: "#22c55e",
		badge: "bg-green-500/10 text-green-300 border-green-500/15",
		icon: <Icons.check />,
		label: "Positive signal"
	},
	warning: {
		accent: "#f97316",
		badge: "bg-orange-500/10 text-orange-300 border-orange-500/15",
		icon: <Icons.spark />,
		label: "Needs attention"
	},
	danger: {
		accent: "#ef4444",
		badge: "bg-red-500/10 text-red-300 border-red-500/15",
		icon: <Icons.alert />,
		label: "Urgent focus"
	},
	info: {
		accent: "#38bdf8",
		badge: "bg-sky-500/10 text-sky-300 border-sky-500/15",
		icon: <Icons.info />,
		label: "Operational note"
	}
};

export function InsightCard({ insight, index = 0 }) {
	const tone = CARD_STYLES[insight.type] ?? CARD_STYLES.info;

	return (
		<div
			className="group relative overflow-hidden rounded-[24px] border border-border-main bg-card-bg px-5 py-5 transition-transform duration-300 hover:-translate-y-0.5"
			style={{
				boxShadow: `inset 0 1px 0 rgba(255,255,255,0.03), 0 16px 40px ${tone.accent}10`,
				animationDelay: `${index * 80}ms`
			}}
		>
			<div
				className="absolute inset-x-0 top-0 h-px"
				style={{
					background: `linear-gradient(90deg, transparent, ${tone.accent}, transparent)`
				}}
			/>
			<div
				className="absolute -right-10 -top-10 h-28 w-28 rounded-full blur-2xl"
				style={{ background: `${tone.accent}20` }}
			/>

			<div className="relative z-10 flex items-start justify-between gap-4">
				<div
					className="flex h-11 w-11 items-center justify-center rounded-2xl border"
					style={{
						background: `${tone.accent}14`,
						borderColor: `${tone.accent}25`,
						color: tone.accent
					}}
				>
					{tone.icon}
				</div>
				<span
					className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-[0.18em] uppercase ${tone.badge}`}
				>
					{tone.label}
				</span>
			</div>

			<div className="relative z-10 mt-5">
				<div className="flex items-start justify-between gap-3">
					<div className="text-[17px] font-extrabold leading-6 text-text-title">
						{insight.title}
					</div>
					{insight.metric && (
						<div
							className="rounded-2xl border px-3 py-1.5 text-sm font-extrabold"
							style={{
								color: tone.accent,
								background: `${tone.accent}10`,
								borderColor: `${tone.accent}22`
							}}
						>
							{insight.metric}
						</div>
					)}
				</div>
				<div className="mt-3 text-[13px] leading-6 text-[#a0a0ba]">
					{insight.description}
				</div>
			</div>
		</div>
	);
}
