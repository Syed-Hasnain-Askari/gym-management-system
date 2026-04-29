import React, { useState } from "react";
import { Icons } from "../ui/Icons";
import { useDispatch, useSelector } from "react-redux";
import {
	addMember,
	updateMember
} from "../../redux/features/member/member.slice";
import { useGymData } from "../../context/GymDataContext";
import Spinner from "../ui/Spinner";

export function MemberModal({ member, onClose }) {
	const { showToast } = useGymData();
	const { isLoading } = useSelector((state) => state.member);
	const dispatch = useDispatch();
	// ─── State ─────────────────────────────────────────────
	const initialForm = {
		name: "",
		email: "",
		phone: "",
		plan: "monthly",
		status: "active"
	};

	const [form, setForm] = useState(member || initialForm);

	// ─── Handle input change ────────────────────────────────
	const handleChange = (key, value) => {
		setForm((prev) => ({ ...prev, [key]: value }));
	};

	// ─── Submit handler ─────────────────────────────────────
	const handleSubmit = async () => {
		if (member) {
			const response = await dispatch(updateMember(form));
			if (response.meta.requestStatus === "fulfilled") {
				showToast("Member updated successfully!");
			}
			onClose();
			setForm({
				name: "",
				email: "",
				phone: "",
				plan: "monthly",
				status: "active"
			});
		} else {
			try {
				const response = await dispatch(addMember(form));
				if (response.meta.requestStatus === "fulfilled") {
					showToast("Member added successfully!");
				}
				onClose();
				setForm({
					name: "",
					email: "",
					phone: "",
					plan: "monthly",
					status: "active"
				});
			} catch (err) {
				console.log(err);
				console.error(err);
				showToast(
					"Failed to add member. Please check the input and try again.",
					"error"
				);
			}
		}
	};
	console.log(form);
	return (
		<div
			className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/75 backdrop-blur-sm"
			onClick={(e) => e.target === e.currentTarget && onClose()}
		>
			<div className="max-h-[85vh] w-120 max-w-[90vw] overflow-y-auto rounded-2xl border border-[#2a2a3e] bg-card-bg p-7 shadow-2xl">
				{/* Header */}
				<div className="mb-5 flex items-center justify-between">
					<h2 className="text-lg font-bold text-text-title">
						{member ? "Edit Member" : "Add Member"}
					</h2>
					<button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg">
						<Icons.close />
					</button>
				</div>

				{/* Inputs */}
				{[
					{ key: "name", label: "Full Name", type: "text" },
					{ key: "email", label: "Email", type: "email" },
					{ key: "phone", label: "Phone", type: "text" }
				].map((field) => (
					<div key={field.key} className="mb-4">
						<label className="block text-sm text-gray-400 mb-1">
							{field.label}
						</label>
						<input
							type={field.type}
							value={form[field.key] || ""}
							onChange={(e) => handleChange(field.key, e.target.value)}
							className="w-full px-3 py-2 rounded-lg bg-input-bg border border-border-input"
						/>
					</div>
				))}

				{/* Plan */}
				<div className="mb-4">
					<label className="block text-sm text-gray-400 mb-1">Plan</label>
					<select
						value={form.plan}
						onChange={(e) => handleChange("plan", e.target.value)}
						className="w-full px-3 py-2 rounded-lg bg-input-bg border border-border-input"
					>
						<option value={"monthly"}>monthly</option>
						<option value={"yearly"}>yearly</option>
					</select>
				</div>

				{/* Status */}
				<div className="mb-4">
					<label className="block text-sm text-gray-400 mb-1">Status</label>
					<select
						value={form.status}
						onChange={(e) => handleChange("status", e.target.value)}
						className="w-full px-3 py-2 rounded-lg bg-input-bg border border-border-input"
					>
						<option value="active">Active</option>
						<option value="inactive">Inactive</option>
					</select>
				</div>

				{/* Actions */}
				<div className="flex justify-end gap-2 mt-6">
					<button
						onClick={onClose}
						className="px-4 py-2 bg-gray-700 rounded-lg"
					>
						Cancel
					</button>
					<button
						onClick={handleSubmit}
						className={`px-4 py-2 ${isLoading ? "bg-gray-500" : "bg-orange-400"} rounded-lg text-white`}
					>
						{isLoading ? <Spinner /> : member ? "Update" : "Add"}
					</button>
				</div>
			</div>
		</div>
	);
}
