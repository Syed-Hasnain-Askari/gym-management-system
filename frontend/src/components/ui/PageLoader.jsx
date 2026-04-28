import React from "react";

export function PageLoader({ label = "Loading members..." }) {
	return (
		<div className="flex min-h-[500px] w-full items-center justify-center">
			<div className="flex flex-col items-center gap-4">
				<div className="relative h-14 w-14">
					<div className="absolute inset-0 rounded-full border-4 border-primary-orange/15" />
					<div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary-orange border-r-secondary-orange" />
					<div className="absolute inset-2 animate-pulse rounded-full bg-primary-orange/10" />
				</div>
				<p className="text-[13px] font-semibold tracking-wide text-text-muted">
					{label}
				</p>
			</div>
		</div>
	);
}
