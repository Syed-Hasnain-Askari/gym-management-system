import React from "react";
import { S } from "../styles";
import { StatCard } from "../components/ui/StatCard";
import { Icons } from "../components/ui/Icons";

// ─── FEES PAGE ────────────────────────────────────────────────────────────────
export function FeesPage({ members }) {
  const allFees = members.flatMap(m => m.fees.map(f => ({ ...f, memberName: m.name })));
  const pending = allFees.filter(f => !f.paid);
  const paid = allFees.filter(f => f.paid);

  return (
    <div>
      <div style={S.pageTitle}>Fee Overview</div>
      <div style={S.pageSubtitle}>All pending and collected fees across members</div>

      <div style={S.statsGrid}>
        <StatCard icon={<Icons.dollar />} label="Total Fees" value={`PKR ${allFees.reduce((s, f) => s + f.amount, 0).toLocaleString()}`} color="#f97316" />
        <StatCard icon={<Icons.check />} label="Collected" value={`PKR ${paid.reduce((s, f) => s + f.amount, 0).toLocaleString()}`} color="#22c55e" />
        <StatCard icon={<Icons.fees />} label="Pending" value={`PKR ${pending.reduce((s, f) => s + f.amount, 0).toLocaleString()}`} color="#ef4444" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={S.card}>
          <div style={S.cardHeader}><div style={S.cardTitle}>⏳ Pending Fees</div><span style={S.badge("unpaid")}>{pending.length}</span></div>
          <table style={S.table}>
            <thead><tr>{["Member", "Month", "Amount"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>
              {pending.length === 0 && <tr><td colSpan={3} style={{ ...S.td, textAlign: "center", color: "#444460" }}>All fees collected!</td></tr>}
              {pending.map(f => (
                <tr key={f.id}>
                  <td style={S.td}>{f.memberName}</td>
                  <td style={S.td}>{f.month}</td>
                  <td style={{ ...S.td, color: "#fb923c", fontWeight: 700 }}>PKR {f.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={S.card}>
          <div style={S.cardHeader}><div style={S.cardTitle}>✅ Paid Fees</div><span style={S.badge("paid")}>{paid.length}</span></div>
          <table style={S.table}>
            <thead><tr>{["Member", "Month", "Amount"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>
              {paid.map(f => (
                <tr key={f.id}>
                  <td style={S.td}>{f.memberName}</td>
                  <td style={S.td}>{f.month}</td>
                  <td style={{ ...S.td, color: "#4ade80", fontWeight: 700 }}>PKR {f.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}