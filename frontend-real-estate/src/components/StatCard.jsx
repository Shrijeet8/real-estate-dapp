import React from "react";

export default function StatCard({ label, value, accent = "#00dcb4", icon }) {
  return (
    <div style={s.card}>
      <div style={s.top}>
        <span style={s.label}>{label}</span>
        {icon && <span style={{ fontSize: "18px" }}>{icon}</span>}
      </div>
      <div style={{ ...s.value, color: accent }}>{value ?? "—"}</div>
    </div>
  );
}

const s = {
  card: {
    background: "#101520",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "14px",
    padding: "20px 22px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    flex: "1 1 180px",
    animation: "fadeUp 0.4s ease",
  },
  top: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "11px",
    color: "#6b8090",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  value: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    fontSize: "28px",
    letterSpacing: "-0.5px",
    lineHeight: 1,
  },
};
