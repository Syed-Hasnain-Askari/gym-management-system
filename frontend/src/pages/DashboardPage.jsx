import React from "react";
import { S } from "../styles";
import { StatCard } from "../components/ui/StatCard";
import { Icons } from "../components/ui/Icons";

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
export function DashboardPage({ stats, members }) {
  const recent = [...members].sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate)).slice(0, 5);
  return (
    <div>
      <div style={S.pageTitle}>Dashboard</div>
      <div style={S.pageSubtitle}>Welcome back! Here's your gym overview.</div>

      <div style={S.statsGrid}>
        <StatCard icon={<Icons.users />} label="Total Members" value={stats.totalMembers} color="#f97316" sub={`${stats.activeMembers} active · ${stats.inactiveMembers} inactive`} />
        <StatCard icon={<Icons.check />} label="Collected Fees" value={`PKR ${(stats.collectedFees || 0).toLocaleString()}`} color="#22c55e" />
        <StatCard icon={<Icons.fees />} label="Pending Fees" value={`PKR ${(stats.pendingFees || 0).toLocaleString()}`} color="#ef4444" />
      </div>

      <div style={S.card}>
        <div style={S.cardHeader}><div style={S.cardTitle}>Recent Members</div></div>
        <table style={S.table}>
          <thead><tr>{["Name", "Plan", "Joined", "Status"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
          <tbody>
            {recent.map(m => (
              <tr key={m.id}>
                <td style={S.td}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#f97316,#ea580c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff" }}>{m.name.charAt(0)}</div>
                    <span style={{ fontWeight: 600, color: "#d8d8f0" }}>{m.name}</span>
                  </div>
                </td>
                <td style={S.td}>{m.plan}</td>
                <td style={S.td}>{m.joinDate}</td>
                <td style={S.td}><span style={S.badge(m.status)}>{m.status.toUpperCase()}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}