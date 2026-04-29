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
			handleToggleFee,
			showToast
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
