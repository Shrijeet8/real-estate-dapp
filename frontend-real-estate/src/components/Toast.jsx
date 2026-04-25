import React, { useEffect } from "react";

const icons = {
  success: "✓",
  error:   "✕",
  pending: "◌",
};

const colors = {
  success: { bg: "rgba(0,220,180,0.1)",   border: "rgba(0,220,180,0.3)",   text: "#00dcb4" },
  error:   { bg: "rgba(255,77,109,0.1)",  border: "rgba(255,77,109,0.3)",  text: "#ff4d6d" },
  pending: { bg: "rgba(245,200,66,0.08)", border: "rgba(245,200,66,0.25)", text: "#f5c842" },
};

export default function Toast({ message, onClose }) {
  const c = colors[message.type] || colors.pending;

  // Auto-dismiss on success after 5s
  useEffect(() => {
    if (message.type === "success") {
      const t = setTimeout(onClose, 5000);
      return () => clearTimeout(t);
    }
  }, [message, onClose]);

  return (
    <div style={{ ...s.wrap, background: c.bg, borderColor: c.border, animation: "slideDown 0.25s ease" }}>
      <span style={{ ...s.icon, color: c.text, animation: message.type === "pending" ? "spin 1.2s linear infinite" : "none" }}>
        {icons[message.type]}
      </span>
      <span style={{ ...s.text, color: c.text }}>{message.text}</span>
      <button style={s.close} onClick={onClose}>✕</button>
    </div>
  );
}

const s = {
  wrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1px solid",
    marginBottom: "20px",
    width: "100%",
  },
  icon: {
    fontSize: "15px",
    fontWeight: 700,
    flexShrink: 0,
    display: "inline-block",
  },
  text: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "12.5px",
    flex: 1,
    lineHeight: 1.5,
    wordBreak: "break-word",
  },
  close: {
    background: "transparent",
    border: "none",
    color: "#6b8090",
    cursor: "pointer",
    fontSize: "11px",
    padding: "0 0 0 6px",
    flexShrink: 0,
    fontFamily: "inherit",
  },
};
