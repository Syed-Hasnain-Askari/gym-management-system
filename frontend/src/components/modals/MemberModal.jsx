import React, { useState } from "react";
import { S } from "../../styles";
import { Icons } from "../ui/Icons";

// ─── MEMBER FORM MODAL ───────────────────────────────────────────────────────
export function MemberModal({ member, onClose, onSave }) {
  const [form, setForm] = useState(member || { name: "", email: "", phone: "", plan: "Monthly", status: "active" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div style={S.modal} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={S.modalBox}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <div style={S.modalTitle}>{member ? "Edit Member" : "Add New Member"}</div>
          <button style={S.btn("ghost")} onClick={onClose}><Icons.close /></button>
        </div>
        {[["name", "Full Name", "text", "Ahmed Khan"], ["email", "Email Address", "email", "ahmed @example.com"], ["phone", "Phone Number", "text", "0300-1234567"]].map(([k, lbl, type, ph]) => (
          <div key={k} style={S.formGroup}>
            <label style={S.label}>{lbl}</label>
            <input style={S.input} type={type} placeholder={ph} value={form[k] || ""} onChange={e => set(k, e.target.value)} />
          </div>
        ))}
        <div style={S.formGroup}>
          <label style={S.label}>Membership Plan</label>
          <select style={S.select} value={form.plan} onChange={e => set("plan", e.target.value)}>
            {["Monthly", "Quarterly", "Half-Yearly", "Yearly"].map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div style={S.formGroup}>
          <label style={S.label}>Status</label>
          <select style={S.select} value={form.status} onChange={e => set("status", e.target.value)}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 24 }}>
          <button style={S.btn("ghost")} onClick={onClose}>Cancel</button>
          <button style={S.btn("primary")} onClick={() => onSave(form)}>{member ? "Save Changes" : "Add Member"}</button>
        </div>
      </div>
    </div>
  );
}