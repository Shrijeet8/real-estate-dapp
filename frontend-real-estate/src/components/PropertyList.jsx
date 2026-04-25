import React from "react";
import { shortAddress } from "../utils/ethereum";
import Spinner from "./Spinner";

export default function PropertyList({ properties, loading, onRefresh, connectedAddress }) {
  return (
    <div style={s.card}>
      <div style={s.cardHeader}>
        <div style={s.titleRow}>
          <span style={s.cardIcon}>🏘</span>
          <h2 style={s.cardTitle}>All Properties</h2>
          <span style={s.countBadge}>{properties.length} listed</span>
        </div>
        <button style={s.refreshBtn} onClick={onRefresh} disabled={loading}>
          {loading ? <Spinner size={12} color="#6b8090" /> : "↻ Refresh"}
        </button>
      </div>

      {loading && properties.length === 0 ? (
        <div style={s.loadingState}>
          <Spinner size={22} color="#00dcb4" />
          <span style={s.loadingText}>Fetching from chain…</span>
        </div>
      ) : properties.length === 0 ? (
        <div style={s.emptyState}>
          <span style={{ fontSize: "36px" }}>🏚</span>
          <span style={s.emptyText}>No properties listed yet. Be the first!</span>
        </div>
      ) : (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                {["ID", "Name", "Price", "Owner", "Status"].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {properties.map((p, i) => {
                const isOwner = connectedAddress?.toLowerCase() === p.owner?.toLowerCase();
                return (
                  <tr key={p.id} style={{ animation: `fadeUp 0.3s ease ${i * 0.04}s both` }}>
                    <td style={{ ...s.td, ...s.idCell }}>#{p.id}</td>
                    <td style={{ ...s.td, ...s.nameCell }}>
                      {p.name}
                      {isOwner && <span style={s.youBadge}>you</span>}
                    </td>
                    <td style={{ ...s.td, ...s.priceCell }}>{p.price} ETH</td>
                    <td style={{ ...s.td, ...s.ownerCell }}>
                      <span title={p.owner}>{shortAddress(p.owner)}</span>
                    </td>
                    <td style={s.td}>
                      <span style={{ ...s.statusBadge, ...(p.forSale ? s.forSale : s.notForSale) }}>
                        {p.forSale ? "For Sale" : "Sold"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const s = {
  card: {
    background: "#101520",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "16px",
    padding: "26px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    animation: "fadeUp 0.4s ease 0.15s both",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleRow: { display: "flex", alignItems: "center", gap: "10px" },
  cardIcon: { fontSize: "20px" },
  cardTitle: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    fontSize: "16px",
    color: "#dce8f0",
  },
  countBadge: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "10px",
    color: "#00dcb4",
    background: "rgba(0,220,180,0.1)",
    border: "1px solid rgba(0,220,180,0.2)",
    borderRadius: "5px",
    padding: "2px 7px",
  },
  refreshBtn: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#6b8090",
    borderRadius: "8px",
    padding: "6px 12px",
    fontSize: "12px",
    fontFamily: "'Syne', sans-serif",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  loadingState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    padding: "40px 0",
  },
  loadingText: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "13px",
    color: "#6b8090",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    padding: "40px 0",
  },
  emptyText: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "13px",
    color: "#6b8090",
  },
  tableWrap: { overflowX: "auto" },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px",
  },
  th: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "10px",
    color: "#6b8090",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    textAlign: "left",
    padding: "0 12px 12px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "13px 12px",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    color: "#dce8f0",
    fontFamily: "'Syne', sans-serif",
    fontWeight: 500,
    verticalAlign: "middle",
  },
  idCell: {
    fontFamily: "'DM Mono', monospace",
    color: "#6b8090",
    fontSize: "12px",
    fontWeight: 400,
  },
  nameCell: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    minWidth: "140px",
  },
  priceCell: {
    fontFamily: "'DM Mono', monospace",
    color: "#f5c842",
    fontWeight: 500,
    fontSize: "13px",
  },
  ownerCell: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "12px",
    color: "#6b8090",
    fontWeight: 400,
  },
  youBadge: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "9px",
    color: "#00dcb4",
    background: "rgba(0,220,180,0.1)",
    border: "1px solid rgba(0,220,180,0.2)",
    borderRadius: "4px",
    padding: "1px 5px",
    letterSpacing: "0.5px",
  },
  statusBadge: {
    display: "inline-block",
    fontFamily: "'DM Mono', monospace",
    fontSize: "10px",
    borderRadius: "5px",
    padding: "3px 8px",
    letterSpacing: "0.5px",
    fontWeight: 500,
  },
  forSale: {
    background: "rgba(0,220,180,0.1)",
    color: "#00dcb4",
    border: "1px solid rgba(0,220,180,0.25)",
  },
  notForSale: {
    background: "rgba(255,77,109,0.08)",
    color: "#ff4d6d",
    border: "1px solid rgba(255,77,109,0.2)",
  },
};
