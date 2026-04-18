import React, { useState } from "react";
import { Icons } from "../components/ui/Icons";

// ─── MEMBERS PAGE ─────────────────────────────────────────────────────────────
export function MembersPage({ members, onAdd, onEdit, onDelete, onFees }) {
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState("all");

	const filtered = members.filter((m) => {
		const matchSearch =
			m.name.toLowerCase().includes(search.toLowerCase()) ||
			m.email.toLowerCase().includes(search.toLowerCase());
		const matchFilter = filter === "all" || m.status === filter;
		return matchSearch && matchFilter;
	});

	const getBadgeClasses = (type) => {
		const base =
			"inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase";
		if (type === "active" || type === "paid")
			return `${base} bg-green-500/10 text-green-400`;
		if (type === "inactive") return `${base} bg-red-500/10 text-red-400`;
		return `${base} bg-orange-500/12 text-orange-400`;
	};

	return (
		<div>
			<div className="mb-7 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
				<div>
					<div className="text-2xl md:text-[26px] font-extrabold text-text-title">
						Members
					</div>
					<div className="text-[13px] text-text-muted">
						{members.length} total members registered
					</div>
				</div>
				<button
					className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-primary-orange to-secondary-orange px-4.5 py-2.5 text-[13px] font-bold text-white transition-opacity hover:opacity-90"
					onClick={onAdd}
				>
					<Icons.plus /> Add Member
				</button>
			</div>

			<div className="mb-5 flex flex-col md:flex-row gap-3">
				<input
					className="w-full md:w-70 shrink-0 rounded-lg border border-border-input bg-input-bg px-3.5 py-2.5 text-sm text-text-title outline-none transition-colors focus:border-primary-orange"
					placeholder="Search members..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
					{["all", "active", "inactive"].map((f) => (
						<button
							key={f}
							className={`cursor-pointer whitespace-nowrap rounded-lg px-4 py-2 text-[13px] font-semibold transition-all ${
								filter === f
									? "border border-primary-orange/30 bg-primary-orange/12 text-primary-orange"
									: "border border-transparent bg-white/4 text-[#7070a0] hover:bg-white/8"
							}`}
							onClick={() => setFilter(f)}
						>
							{f.charAt(0).toUpperCase() + f.slice(1)}
						</button>
					))}
				</div>
			</div>

			<div className="overflow-hidden rounded-2xl border border-border-main bg-card-bg">
				<div className="overflow-x-auto">
					<table className="w-full border-collapse min-w-[800px]">
						<thead>
							<tr>
								{[
									"Member",
									"Contact",
									"Plan",
									"Join Date",
									"Status",
									"Actions"
								].map((h) => (
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
							{filtered.length === 0 && (
								<tr>
									<td
										colSpan={6}
										className="px-4 py-8 text-center text-[13px] text-[#444460]"
									>
										No members found
									</td>
								</tr>
							)}
							{filtered.map((m) => (
								<tr key={m.id} className="hover:bg-white/1.5 transition-colors">
									<td className="border-b border-[#14141f] px-4 py-3.5 text-[13px] text-[#c0c0d8]">
										<div className="flex items-center gap-3">
											<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-orange to-secondary-orange text-sm font-extrabold text-white">
												{m.name.charAt(0)}
											</div>
											<div>
												<div className="text-[13px] font-bold text-[#e0e0f0]">
													{m.name}
												</div>
												<div className="text-[11px] text-[#444460]">
													ID: {m.id.substring(0, 6)}
												</div>
											</div>
										</div>
									</td>
									<td className="border-b border-[#14141f] px-4 py-3.5 text-[13px] text-[#c0c0d8]">
										<div className="text-[12px] text-[#9090b8]">{m.email}</div>
										<div className="text-[12px] text-[#666680]">{m.phone}</div>
									</td>
									<td className="border-b border-[#14141f] px-4 py-3.5 text-[13px] text-[#c0c0d8]">
										<span className="inline-block rounded-full bg-indigo-500/12 px-2.5 py-0.5 text-[11px] font-bold tracking-wider text-indigo-400 uppercase">
											{m.plan}
										</span>
									</td>
									<td className="border-b border-[#14141f] px-4 py-3.5 text-[13px] text-[#c0c0d8]">
										{m.joinDate}
									</td>
									<td className="border-b border-[#14141f] px-4 py-3.5 text-[13px] text-[#c0c0d8]">
										<span className={getBadgeClasses(m.status)}>
											{m.status}
										</span>
									</td>
									<td className="border-b border-[#14141f] px-4 py-3.5 text-[13px] text-[#c0c0d8]">
										<div className="flex gap-1.5">
											<button
												title="Manage Fees"
												className="cursor-pointer rounded-lg bg-green-500/12 p-2 text-green-400 transition-colors hover:bg-green-500/20"
												onClick={() => onFees(m)}
											>
												<Icons.fees />
											</button>
											<button
												title="Edit"
												className="cursor-pointer rounded-lg bg-white/6 p-2 text-[#9090b0] transition-colors hover:bg-white/12"
												onClick={() => onEdit(m)}
											>
												<Icons.edit />
											</button>
											<button
												title="Delete"
												className="cursor-pointer rounded-lg bg-red-500/12 p-2 text-red-400 transition-colors hover:bg-red-500/20"
												onClick={() => onDelete(m.id)}
											>
												<Icons.trash />
											</button>
										</div>
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
