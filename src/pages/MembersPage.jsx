import React, { useState } from "react";
import { S } from "../styles";
import { Icons } from "../components/ui/Icons";

// ─── MEMBERS PAGE ─────────────────────────────────────────────────────────────
export function MembersPage({ members, onAdd, onEdit, onDelete, onFees }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const filtered = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || m.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <div style={S.pageTitle}>Members</div>
          <div style={S.pageSubtitle}>{members.length} total members registered</div>
        </div>
        <button style={S.btn("primary")} onClick={onAdd}><Icons.plus /> Add Member</button>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <input style={{ ...S.input, width: 280, flex: "none" }} placeholder="Search members..." value={search} onChange={e => setSearch(e.target.value)} />
        {["all", "active", "inactive"].map(f => (
          <button key={f} style={{ ...S.btn("ghost"), background: filter === f ? "rgba(249,115,22,0.12)" : "rgba(255,255,255,0.04)", color: filter === f ? "#f97316" : "#7070a0", border: filter === f ? "1px solid rgba(249,115,22,0.3)" : "1px solid transparent" }} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div style={S.card}>
        <table style={S.table}>
          <thead>
            <tr>
              {["Member", "Contact", "Plan", "Join Date", "Status", "Actions"].map(h => <th key={h} style={S.th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ ...S.td, textAlign: "center", color: "#444460", padding: 32 }}>No members found</td></tr>
            )}
            {filtered.map(m => (
              <tr key={m.id} style={{ transition: "background 0.15s" }}>
                <td style={S.td}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#f97316,#ea580c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: "#e0e0f0", fontSize: 13 }}>{m.name}</div>
                      <div style={{ fontSize: 11, color: "#444460" }}>ID: {m.id.substring(0, 6)}</div>
                    </div>
                  </div>
                </td>
                <td style={S.td}>
                  <div style={{ fontSize: 12, color: "#9090b8" }}>{m.email}</div>
                  <div style={{ fontSize: 12, color: "#666680" }}>{m.phone}</div>
                </td>
                <td style={S.td}><span style={{ ...S.badge("active"), background: "rgba(99,102,241,0.12)", color: "#818cf8" }}>{m.plan}</span></td>
                <td style={S.td}>{m.joinDate}</td>
                <td style={S.td}><span style={S.badge(m.status)}>{m.status.toUpperCase()}</span></td>
                <td style={S.td}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button title="Manage Fees" style={S.btn("success")} onClick={() => onFees(m)}><Icons.fees /></button>
                    <button title="Edit" style={S.btn("ghost")} onClick={() => onEdit(m)}><Icons.edit /></button>
                    <button title="Delete" style={S.btn("danger")} onClick={() => onDelete(m.id)}><Icons.trash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}