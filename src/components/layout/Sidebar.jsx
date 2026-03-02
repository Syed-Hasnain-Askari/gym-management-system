import React from "react";
import { S } from "../../styles";
import { Icons } from "../ui/Icons";

export function Sidebar({ page, setPage }) {
  const nav = [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "members", label: "Members", icon: "👥" },
    { id: "fees", label: "Fee Overview", icon: "💳" },
  ];

  return (
    <div style={S.sidebar}>
      <div style={S.logo}>
        <Icons.gym />
        <div>
          <div style={S.logoText}>GymPro</div>
          <div style={{ fontSize: 11, color: "#333348", marginTop: 1 }}>Management System</div>
        </div>
      </div>
      {nav.map(n => (
        <div key={n.id} style={S.navItem(page === n.id)} onClick={() => setPage(n.id)}>
          <span style={{ fontSize: 16 }}>{n.icon}</span> {n.label}
        </div>
      ))}
      <div style={{ marginTop: "auto", padding: "20px 24px", borderTop: "1px solid #1a1a28" }}>
        <div style={{ fontSize: 11, color: "#333348" }}>Learn With Askari</div>
        <div style={{ fontSize: 10, color: "#2a2a3e", marginTop: 2 }}>Demo Version</div>
      </div>
    </div>
  );
}