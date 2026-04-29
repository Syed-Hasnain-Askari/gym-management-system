import React from "react";

export default function Spinner() {
	return (
		<div className="relative h-8 w-8">
			<div className="absolute inset-0 rounded-full border-4 border-primary-orange/15" />
			<div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary-orange border-r-secondary-orange" />
			<div className="absolute inset-2 animate-pulse rounded-full bg-primary-orange/10" />
		</div>
	);
}
