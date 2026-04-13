import React from "react";
import { S } from "../../styles";

// ─── TOAST ───────────────────────────────────────────────────────────────────
export function Toast({ msg, type }) {
  return <div style={S.toast(type)}>{type === "success" ? "✓ " : "✗ "}{msg}</div>;
}