import React from "react";
import { S } from "../../styles";

// ─── STAT CARD ───────────────────────────────────────────────────────────────
export function StatCard({ icon, label, value, color, sub }) {
  return (
    <div style={S.statCard(color)}>
      <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: `${color}08` }} />
      <div style={S.statIcon(color)}>{icon}</div>
      <div style={S.statVal}>{value}</div>
      <div style={S.statLabel}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: "#444460", marginTop: 6 }}>{sub}</div>}
    </div>
  );
}