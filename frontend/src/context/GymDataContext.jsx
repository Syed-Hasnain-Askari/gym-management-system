import React, { createContext, useContext, useMemo, useState } from "react";
import api, { apiFetch } from "../utils/api";
import { MOCK_MEMBERS } from "../utils/constants";

const GymDataContext = createContext(null);

function calculateStats(members) {
	const allFees = members.flatMap((member) => member.fees);
	const collected = allFees
		.filter((fee) => fee.paid)
		.reduce((sum, fee) => sum + fee.amount, 0);
	const total = allFees.reduce((sum, fee) => sum + fee.amount, 0);

	return {
		totalMembers: members.length,
		activeMembers: members.filter((member) => member.status === "active")
			.length,
		inactiveMembers: members.filter((member) => member.status === "inactive")
			.length,
		collectedFees: collected,
		pendingFees: total - collected,
		totalFees: total
	};
}

export function GymDataProvider({ children }) {
	const [members, setMembers] = useState(MOCK_MEMBERS);
	const [stats, setStats] = useState(() => calculateStats(MOCK_MEMBERS));
	const [modal, setModal] = useState(null); // { type: 'add'|'edit'|'fee', member? }
	const [toast, setToast] = useState(null);

	const showToast = (msg, type = "success") => {
		setToast({ msg, type });
		setTimeout(() => setToast(null), 3000);
	};

	const refreshStats = (nextMembers) => {
		setStats(calculateStats(nextMembers));
	};

	const closeModal = () => setModal(null);

	const openAddMember = () => setModal({ type: "add" });
	const openEditMember = (member) => setModal({ type: "edit", member });
	const openFeeManager = (member) => setModal({ type: "fee", member });

	const handleSaveMember = async (form) => {
		if (modal?.member) {
			const res = await api.patch(`/members/${modal.member.id}`);
			const updated = res ? res.data : { ...modal.member, ...form };
			const nextMembers = members.map((member) =>
				member.id === modal.member.id ? { ...member, ...updated } : member
			);

			setMembers(nextMembers);
			refreshStats(nextMembers);
			showToast("Member updated successfully!");
		} else {
			const res = await api.post("/members");
			const newMember = res
				? res.data
				: {
						...form,
						id: Date.now().toString(),
						joinDate: new Date().toISOString().split("T")[0],
						fees: []
					};

			const nextMembers = [...members, newMember];
			setMembers(nextMembers);
			refreshStats(nextMembers);
			showToast("Member added successfully!");
		}

		closeModal();
	};

	const handleDeleteMember = async (memberId) => {
		if (!window.confirm("Delete this member?")) return;

		await apiFetch(`/members/${memberId}`, { method: "DELETE" });
		const nextMembers = members.filter((member) => member.id !== memberId);
		setMembers(nextMembers);
		refreshStats(nextMembers);
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

		const nextMembers = members.map((member) =>
			member.id === memberId
				? { ...member, fees: [...member.fees, newFee] }
				: member
		);

		setMembers(nextMembers);
		refreshStats(nextMembers);
		setModal((prev) => ({
			...prev,
			member: nextMembers.find((member) => member.id === memberId)
		}));
		showToast("Fee record added!");
	};

	const handleToggleFee = async (memberId, feeId, paid) => {
		await apiFetch(`/members/${memberId}/fees/${feeId}`, {
			method: "PUT",
			body: JSON.stringify({ paid })
		});

		const nextMembers = members.map((member) =>
			member.id === memberId
				? {
						...member,
						fees: member.fees.map((fee) =>
							fee.id === feeId
								? {
										...fee,
										paid,
										paidDate: paid
											? new Date().toISOString().split("T")[0]
											: null
									}
								: fee
						)
					}
				: member
		);

		setMembers(nextMembers);
		refreshStats(nextMembers);
		setModal((prev) => ({
			...prev,
			member: nextMembers.find((member) => member.id === memberId)
		}));
		showToast(paid ? "Fee marked as paid!" : "Fee marked as unpaid.");
	};

	const value = useMemo(
		() => ({
			members,
			stats,
			modal,
			toast,
			closeModal,
			openAddMember,
			openEditMember,
			openFeeManager,
			handleSaveMember,
			handleDeleteMember,
			handleAddFee,
			handleToggleFee
		}),
		[members, stats, modal, toast]
	);

	return (
		<GymDataContext.Provider value={value}>{children}</GymDataContext.Provider>
	);
}

export function useGymData() {
	const context = useContext(GymDataContext);
	if (!context) {
		throw new Error("useGymData must be used within GymDataProvider.");
	}
	return context;
}
