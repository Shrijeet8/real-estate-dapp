import React from "react";
import { shortAddress } from "../utils/ethereum";

export default function Header({ address, connecting, onConnect, onDisconnect }) {
  return (
    <header style={s.header}>
      <div style={s.brand}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <polygon
            points="14,2 26,8 26,20 14,26 2,20 2,8"
            stroke="#00dcb4" strokeWidth="1.5" fill="rgba(0,220,180,0.07)"
          />
          <polygon
            points="14,7 21,11 21,17 14,21 7,17 7,11"
            stroke="#00dcb4" strokeWidth="1" fill="rgba(0,220,180,0.12)"
          />
        </svg>
        <span style={s.wordmark}>PropChain</span>
        <span style={s.badge}>Anvil Local</span>
      </div>

      <div style={s.right}>
        {address ? (
          <div style={s.walletRow}>
            <div style={s.walletChip}>
              <span style={s.dot} />
              <span style={s.addrText}>{shortAddress(address)}</span>
            </div>
            <button style={s.disconnectBtn} onClick={onDisconnect}>
              Disconnect
            </button>
          </div>
        ) : (
          <button
            style={{ ...s.connectBtn, opacity: connecting ? 0.6 : 1 }}
            onClick={onConnect}
            disabled={connecting}
          >
            {connecting ? (
              <><span style={s.spinner} />Connecting…</>
            ) : (
              <><span style={s.mmEmoji}>🦊</span>Connect Wallet</>
            )}
          </button>
        )}
      </div>
    </header>
  );
}

const s = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 32px",
    height: "66px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    backdropFilter: "blur(12px)",
    background: "rgba(7,9,15,0.85)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  wordmark: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: "18px",
    color: "#dce8f0",
    letterSpacing: "-0.3px",
  },
  badge: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "10px",
    fontWeight: 400,
    color: "#00dcb4",
    background: "rgba(0,220,180,0.1)",
    border: "1px solid rgba(0,220,180,0.25)",
    borderRadius: "5px",
    padding: "2px 7px",
    letterSpacing: "0.5px",
  },
  right: { display: "flex", alignItems: "center" },
  walletRow: { display: "flex", alignItems: "center", gap: "10px" },
  walletChip: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(0,220,180,0.08)",
    border: "1px solid rgba(0,220,180,0.2)",
    borderRadius: "8px",
    padding: "6px 12px",
  },
  dot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#00dcb4",
    animation: "pulse-dot 2s infinite",
    display: "block",
    flexShrink: 0,
  },
  addrText: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "13px",
    color: "#00dcb4",
  },
  disconnectBtn: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#6b8090",
    borderRadius: "8px",
    padding: "6px 14px",
    fontSize: "13px",
    cursor: "pointer",
    fontFamily: "'Syne', sans-serif",
    fontWeight: 500,
    transition: "all 0.15s ease",
  },
  connectBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "linear-gradient(135deg, #00dcb4 0%, #00b090 100%)",
    color: "#07090f",
    border: "none",
    borderRadius: "9px",
    padding: "9px 18px",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Syne', sans-serif",
    boxShadow: "0 0 24px rgba(0,220,180,0.25)",
    transition: "all 0.15s ease",
  },
  mmEmoji: { fontSize: "16px" },
  spinner: {
    display: "inline-block",
    width: "13px",
    height: "13px",
    border: "2px solid rgba(7,9,15,0.3)",
    borderTop: "2px solid #07090f",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
};
