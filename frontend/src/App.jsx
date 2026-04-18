import React, { useState } from "react";
import { API, apiFetch } from "./utils/api";
import { MOCK_STATS, MOCK_MEMBERS } from "./utils/constants";
import { Toast } from "./components/ui/Toast";
import { MemberModal } from "./components/modals/MemberModal";
import { FeeModal } from "./components/modals/FeeModal";
import { MembersPage } from "./pages/MembersPage";
import { FeesPage } from "./pages/FeesPage";
import { DashboardPage } from "./pages/DashboardPage";
import { Sidebar } from "./components/layout/Sidebar";

export default function App() {
	const [page, setPage] = useState("dashboard");
	const [members, setMembers] = useState(MOCK_MEMBERS);
	const [stats, setStats] = useState(MOCK_STATS);
	const [modal, setModal] = useState(null); // { type: 'add'|'edit'|'fee', member? }
	const [toast, setToast] = useState(null);
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const showToast = (msg, type = "success") => {
		setToast({ msg, type });
		setTimeout(() => setToast(null), 3000);
	};

	const refreshStats = (mems) => {
		const allFees = mems.flatMap((m) => m.fees);
		const collected = allFees
			.filter((f) => f.paid)
			.reduce((s, f) => s + f.amount, 0);
		const total = allFees.reduce((s, f) => s + f.amount, 0);
		setStats({
			totalMembers: mems.length,
			activeMembers: mems.filter((m) => m.status === "active").length,
			inactiveMembers: mems.filter((m) => m.status === "inactive").length,
			collectedFees: collected,
			pendingFees: total - collected,
			totalFees: total
		});
	};

	const handleSaveMember = async (form) => {
		if (modal.member) {
			// Edit
			const res = await apiFetch(`/members/${modal.member.id}`, {
				method: "PUT",
				body: JSON.stringify(form)
			});
			const updated = res ? res.data : { ...modal.member, ...form };
			const newMembers = members.map((m) =>
				m.id === modal.member.id ? { ...m, ...updated } : m
			);
			setMembers(newMembers);
			refreshStats(newMembers);
			showToast("Member updated successfully!");
		} else {
			// Add
			const res = await apiFetch("/members", {
				method: "POST",
				body: JSON.stringify(form)
			});
			const newMember = res
				? res.data
				: {
						...form,
						id: Date.now().toString(),
						joinDate: new Date().toISOString().split("T")[0],
						fees: []
					};
			const newMembers = [...members, newMember];
			setMembers(newMembers);
			refreshStats(newMembers);
			showToast("Member added successfully!");
		}
		setModal(null);
	};

	const handleDelete = async (id) => {
		if (!window.confirm("Delete this member?")) return;
		await apiFetch(`/members/${id}`, { method: "DELETE" });
		const newMembers = members.filter((m) => m.id !== id);
		setMembers(newMembers);
		refreshStats(newMembers);
		showToast("Member deleted.");
	};

	const handleAddFee = async (memberId, feeForm) => {
		const res = await apiFetch(`/members/${memberId}/fees`, {
			method: "POST",
			body: JSON.stringify(feeForm)
		});
		const newFee = res
			? res.data
			: {
					id: Date.now().toString(),
					...feeForm,
					amount: Number(feeForm.amount),
					paid: false,
					paidDate: null
				};
		const newMembers = members.map((m) =>
			m.id === memberId ? { ...m, fees: [...m.fees, newFee] } : m
		);
		setMembers(newMembers);
		refreshStats(newMembers);
		// update modal member reference
		setModal((prev) => ({
			...prev,
			member: newMembers.find((m) => m.id === memberId)
		}));
		showToast("Fee record added!");
	};

	const handleToggleFee = async (memberId, feeId, paid) => {
		const res = await apiFetch(`/members/${memberId}/fees/${feeId}`, {
			method: "PUT",
			body: JSON.stringify({ paid })
		});
		const newMembers = members.map((m) =>
			m.id === memberId
				? {
						...m,
						fees: m.fees.map((f) =>
							f.id === feeId
								? {
										...f,
										paid,
										paidDate: paid
											? new Date().toISOString().split("T")[0]
											: null
									}
								: f
						)
					}
				: m
		);
		setMembers(newMembers);
		refreshStats(newMembers);
		setModal((prev) => ({
			...prev,
			member: newMembers.find((m) => m.id === memberId)
		}));
		showToast(paid ? "Fee marked as paid!" : "Fee marked as unpaid.");
	};

	return (
		<div className="min-h-screen bg-app-bg text-text-main font-dm-sans">
			<Sidebar
				page={page}
				setPage={(p) => {
					setPage(p);
					setIsMobileMenuOpen(false);
				}}
				isCollapsed={isSidebarCollapsed}
				onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
				isMobileOpen={isMobileMenuOpen}
				onToggleMobile={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
			/>

			<div
				className={`p-4 md:p-8 min-h-screen transition-[margin-left] duration-300 ${
					isSidebarCollapsed ? "md:ml-[60px]" : "md:ml-[250px]"
				} ml-0`}
			>
				{/* Mobile Header */}
				<div className="flex items-center justify-between mb-6 md:hidden">
					<div className="text-xl font-extrabold text-primary-orange">GymPro</div>
					<button 
						onClick={() => setIsMobileMenuOpen(true)}
						className="p-2 bg-card-bg border border-border-main rounded-lg"
					>
						<span className="text-xl">≡</span>
					</button>
				</div>
				{page === "dashboard" && (
					<DashboardPage stats={stats} members={members} />
				)}
				{page === "members" && (
					<MembersPage
						members={members}
						onAdd={() => setModal({ type: "add" })}
						onEdit={(m) => setModal({ type: "edit", member: m })}
						onDelete={handleDelete}
						onFees={(m) => setModal({ type: "fee", member: m })}
					/>
				)}
				{page === "fees" && <FeesPage members={members} />}
			</div>

			{modal?.type === "add" && (
				<MemberModal onClose={() => setModal(null)} onSave={handleSaveMember} />
			)}
			{modal?.type === "edit" && (
				<MemberModal
					member={modal.member}
					onClose={() => setModal(null)}
					onSave={handleSaveMember}
				/>
			)}
			{modal?.type === "fee" && (
				<FeeModal
					member={modal.member}
					onClose={() => setModal(null)}
					onAddFee={handleAddFee}
					onToggleFee={handleToggleFee}
				/>
			)}

			{toast && <Toast msg={toast.msg} type={toast.type} />}
		</div>
	);
}
