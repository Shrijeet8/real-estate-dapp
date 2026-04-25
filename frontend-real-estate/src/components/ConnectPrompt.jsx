import React from "react";

export default function ConnectPrompt({ onConnect, connecting, error }) {
  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <div style={s.hexWrap}>
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
            <polygon
              points="36,4 68,20 68,52 36,68 4,52 4,20"
              stroke="#00dcb4" strokeWidth="1.5" fill="rgba(0,220,180,0.05)"
            />
            <polygon
              points="36,14 58,26 58,46 36,58 14,46 14,26"
              stroke="#00dcb4" strokeWidth="1" strokeOpacity="0.4" fill="rgba(0,220,180,0.05)"
            />
            <text x="36" y="41" textAnchor="middle" fontSize="22" fill="#00dcb4">⌂</text>
          </svg>
        </div>

        <h1 style={s.title}>PropChain</h1>
        <p style={s.sub}>
          A decentralized real estate marketplace.<br />
          Connect your MetaMask wallet to get started.
        </p>

        {error && (
          <div style={s.errBox}>{error}</div>
        )}

        <button
          style={{ ...s.btn, opacity: connecting ? 0.6 : 1 }}
          onClick={onConnect}
          disabled={connecting}
        >
          {connecting ? "Connecting…" : "Connect MetaMask 🦊"}
        </button>

        <div style={s.networkInfo}>
          <span style={s.networkDot} />
          <span style={s.networkText}>Requires Anvil local · Chain 31337</span>
        </div>
      </div>
    </div>
  );
}

const s = {
  wrap: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    animation: "fadeIn 0.5s ease",
  },
  card: {
    background: "#101520",
    border: "1px solid rgba(0,220,180,0.12)",
    borderRadius: "20px",
    padding: "48px 40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "18px",
    maxWidth: "440px",
    width: "100%",
    boxShadow: "0 0 80px rgba(0,220,180,0.05)",
  },
  hexWrap: { animation: "fadeUp 0.5s ease" },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: "30px",
    color: "#dce8f0",
    letterSpacing: "-0.5px",
    animation: "fadeUp 0.5s ease 0.08s both",
  },
  sub: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "13px",
    color: "#6b8090",
    textAlign: "center",
    lineHeight: 1.7,
    animation: "fadeUp 0.5s ease 0.12s both",
  },
  errBox: {
    background: "rgba(255,77,109,0.08)",
    border: "1px solid rgba(255,77,109,0.25)",
    borderRadius: "9px",
    padding: "10px 14px",
    fontFamily: "'DM Mono', monospace",
    fontSize: "12px",
    color: "#ff4d6d",
    width: "100%",
    textAlign: "center",
  },
  btn: {
    background: "linear-gradient(135deg, #00dcb4 0%, #00a888 100%)",
    color: "#07090f",
    border: "none",
    borderRadius: "12px",
    padding: "14px 28px",
    fontSize: "15px",
    fontWeight: 700,
    fontFamily: "'Syne', sans-serif",
    cursor: "pointer",
    boxShadow: "0 4px 28px rgba(0,220,180,0.3)",
    width: "100%",
    transition: "all 0.15s ease",
    animation: "fadeUp 0.5s ease 0.18s both",
  },
  networkInfo: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    animation: "fadeUp 0.5s ease 0.22s both",
  },
  networkDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#00dcb4",
    display: "block",
  },
  networkText: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "11px",
    color: "#354550",
    letterSpacing: "0.3px",
  },
};
