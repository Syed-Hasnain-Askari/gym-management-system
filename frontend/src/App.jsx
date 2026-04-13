import React, { useState, useEffect } from "react";
import { S } from "./styles";
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

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const refreshStats = (mems) => {
    const allFees = mems.flatMap(m => m.fees);
    const collected = allFees.filter(f => f.paid).reduce((s, f) => s + f.amount, 0);
    const total = allFees.reduce((s, f) => s + f.amount, 0);
    setStats({ totalMembers: mems.length, activeMembers: mems.filter(m => m.status === "active").length, inactiveMembers: mems.filter(m => m.status === "inactive").length, collectedFees: collected, pendingFees: total - collected, totalFees: total });
  };

  const handleSaveMember = async (form) => {
    if (modal.member) {
      // Edit
      const res = await apiFetch(`/members/${modal.member.id}`, { method: "PUT", body: JSON.stringify(form) });
      const updated = res ? res.data : { ...modal.member, ...form };
      const newMembers = members.map(m => m.id === modal.member.id ? { ...m, ...updated } : m);
      setMembers(newMembers); refreshStats(newMembers);
      showToast("Member updated successfully!");
    } else {
      // Add
      const res = await apiFetch("/members", { method: "POST", body: JSON.stringify(form) });
      const newMember = res ? res.data : { ...form, id: Date.now().toString(), joinDate: new Date().toISOString().split("T")[0], fees: [] };
      const newMembers = [...members, newMember];
      setMembers(newMembers); refreshStats(newMembers);
      showToast("Member added successfully!");
    }
    setModal(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this member?")) return;
    await apiFetch(`/members/${id}`, { method: "DELETE" });
    const newMembers = members.filter(m => m.id !== id);
    setMembers(newMembers); refreshStats(newMembers);
    showToast("Member deleted.");
  };

  const handleAddFee = async (memberId, feeForm) => {
    const res = await apiFetch(`/members/${memberId}/fees`, { method: "POST", body: JSON.stringify(feeForm) });
    const newFee = res ? res.data : { id: Date.now().toString(), ...feeForm, amount: Number(feeForm.amount), paid: false, paidDate: null };
    const newMembers = members.map(m => m.id === memberId ? { ...m, fees: [...m.fees, newFee] } : m);
    setMembers(newMembers); refreshStats(newMembers);
    // update modal member reference
    setModal(prev => ({ ...prev, member: newMembers.find(m => m.id === memberId) }));
    showToast("Fee record added!");
  };

  const handleToggleFee = async (memberId, feeId, paid) => {
    const res = await apiFetch(`/members/${memberId}/fees/${feeId}`, { method: "PUT", body: JSON.stringify({ paid }) });
    const newMembers = members.map(m => m.id === memberId ? { ...m, fees: m.fees.map(f => f.id === feeId ? { ...f, paid, paidDate: paid ? new Date().toISOString().split("T")[0] : null } : f) } : m);
    setMembers(newMembers); refreshStats(newMembers);
    setModal(prev => ({ ...prev, member: newMembers.find(m => m.id === memberId) }));
    showToast(paid ? "Fee marked as paid!" : "Fee marked as unpaid.");
  };

  return (
    <div style={S.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght @400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        input::placeholder { color: #333348; }
        select option { background: #14141f; }
        tr:hover td { background: rgba(255,255,255,0.015); }
        @keyframes slideIn { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        button:hover { opacity: 0.85; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #0a0a0f; } ::-webkit-scrollbar-thumb { background: #2a2a3e; border-radius: 3px; }
      `}</style>

      <Sidebar page={page} setPage={setPage} />

      <div style={S.main}>
        {page === "dashboard" && <DashboardPage stats={stats} members={members} />}
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

      {modal?.type === "add" && <MemberModal onClose={() => setModal(null)} onSave={handleSaveMember} />}
      {modal?.type === "edit" && <MemberModal member={modal.member} onClose={() => setModal(null)} onSave={handleSaveMember} />}
      {modal?.type === "fee" && <FeeModal member={modal.member} onClose={() => setModal(null)} onAddFee={handleAddFee} onToggleFee={handleToggleFee} />}

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}