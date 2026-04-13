import React, { useState } from "react";
import { S } from "../../styles";
import { Icons } from "../ui/Icons";

// ─── FEE MODAL ───────────────────────────────────────────────────────────────
export function FeeModal({ member, onClose, onAddFee, onToggleFee }) {
  const [form, setForm] = useState({ month: "", amount: "" });
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const currentYear = new Date().getFullYear();
  const monthOptions = months.map(m => `${m} ${currentYear}`);

  return (
    <div style={S.modal} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={S.modalBox}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <div style={S.modalTitle}>Fee Management — {member.name}</div>
          <button style={S.btn("ghost")} onClick={onClose}><Icons.close /></button>
        </div>

        {/* Add fee row */}
        <div style={{ background: "#14141f", borderRadius: 10, padding: 16, marginBottom: 20, border: "1px solid #1e1e2e" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#555570", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>Add Fee Record</div>
          <div style={{ display: "flex", gap: 10 }}>
            <select style={{ ...S.select, flex: 2 }} value={form.month} onChange={e => setForm(f => ({ ...f, month: e.target.value }))}>
              <option value="">Select Month</option>
              {monthOptions.map(m => <option key={m}>{m}</option>)}
            </select>
            <input style={{ ...S.input, flex: 1 }} type="number" placeholder="Amount (PKR)" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
            <button style={S.btn("primary")} onClick={() => { if (form.month && form.amount) { onAddFee(member.id, form); setForm({ month: "", amount: "" }); } }}>
              <Icons.plus /> Add
            </button>
          </div>
        </div>

        {/* Fee list */}
        <div style={{ fontSize: 12, fontWeight: 700, color: "#555570", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>Fee History</div>
        {member.fees.length === 0 && <div style={{ color: "#444460", fontSize: 13, padding: "12px 0" }}>No fee records yet.</div>}
        {member.fees.map(fee => (
          <div key={fee.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "#14141f", borderRadius: 8, marginBottom: 8, border: "1px solid #1a1a28" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#d0d0e8" }}>{fee.month}</div>
              <div style={{ fontSize: 12, color: "#555570" }}>PKR {fee.amount.toLocaleString()}{fee.paidDate ? ` · Paid ${fee.paidDate}` : ""}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={S.badge(fee.paid ? "paid" : "unpaid")}>{fee.paid ? "PAID" : "PENDING"}</span>
              <button style={S.btn(fee.paid ? "danger" : "success")} onClick={() => onToggleFee(member.id, fee.id, !fee.paid)}>
                {fee.paid ? "Mark Unpaid" : "Mark Paid"}
              </button>
            </div>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
          <button style={S.btn("ghost")} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}