import React, { useState } from "react";
import Spinner from "./Spinner";

export default function BuyPropertyForm({ onLookup, onBuy, loading }) {
  const [id,       setId]       = useState("");
  const [property, setProperty] = useState(null);
  const [lookErr,  setLookErr]  = useState("");
  const [looking,  setLooking]  = useState(false);

  async function handleLookup(e) {
    e.preventDefault();
    if (!id || isNaN(id) || Number(id) < 1) {
      setLookErr("Enter a valid property ID (≥ 1).");
      return;
    }
    setLookErr("");
    setLooking(true);
    setProperty(null);
    try {
      const p = await onLookup(Number(id));
      if (!p || p.id === 0) {
        setLookErr("Property not found.");
      } else {
        setProperty(p);
      }
    } catch {
      setLookErr("Failed to fetch property. Check the ID and network.");
    } finally {
      setLooking(false);
    }
  }

  async function handleBuy() {
    if (!property) return;
    const ok = await onBuy(property.id, property.price);
    if (ok) { setProperty(null); setId(""); }
  }

  return (
    <div style={s.card}>
      <div style={s.cardHeader}>
        <span style={s.cardIcon}>🔑</span>
        <h2 style={s.cardTitle}>Buy a Property</h2>
      </div>

      <form onSubmit={handleLookup} style={s.row}>
        <input
          style={{ ...s.input, flex: 1, ...(lookErr ? s.inputErr : {}) }}
          type="number"
          min="1"
          placeholder="Property ID…"
          value={id}
          onChange={e => { setId(e.target.value); setLookErr(""); setProperty(null); }}
          disabled={loading || looking}
        />
        <button
          type="submit"
          style={{ ...s.lookupBtn, opacity: looking ? 0.6 : 1 }}
          disabled={looking || loading}
        >
          {looking ? <Spinner size={13} color="#dce8f0" /> : "Look up"}
        </button>
      </form>

      {lookErr && <span style={s.errText}>{lookErr}</span>}

      {property && (
        <div style={s.preview}>
          <div style={s.previewGrid}>
            <PreviewRow label="Name"     value={property.name} />
            <PreviewRow label="Price"    value={`${property.price} ETH`} accent="#f5c842" />
            <PreviewRow label="Owner"    value={`${property.owner.slice(0,10)}…${property.owner.slice(-6)}`} mono />
            <PreviewRow
              label="Status"
              value={property.forSale ? "For Sale" : "Not for Sale"}
              accent={property.forSale ? "#00dcb4" : "#ff4d6d"}
            />
          </div>

          {property.forSale ? (
            <button
              style={{ ...s.buyBtn, opacity: loading ? 0.6 : 1 }}
              onClick={handleBuy}
              disabled={loading}
            >
              {loading
                ? <><Spinner size={14} color="#07090f" />&nbsp;Processing…</>
                : `Buy for ${property.price} ETH →`}
            </button>
          ) : (
            <div style={s.notForSale}>This property is not currently for sale.</div>
          )}
        </div>
      )}
    </div>
  );
}

function PreviewRow({ label, value, accent, mono }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
      <span style={{ fontFamily: "'DM Mono'", fontSize: "10px", color: "#6b8090", textTransform: "uppercase", letterSpacing: "0.8px" }}>
        {label}
      </span>
      <span style={{
        fontFamily: mono ? "'DM Mono', monospace" : "'Syne', sans-serif",
        fontSize: mono ? "12px" : "13px",
        fontWeight: mono ? 400 : 600,
        color: accent ?? "#dce8f0",
        wordBreak: "break-all",
      }}>
        {value}
      </span>
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
    gap: "18px",
    animation: "fadeUp 0.4s ease 0.1s both",
  },
  cardHeader: { display: "flex", alignItems: "center", gap: "10px" },
  cardIcon: { fontSize: "20px" },
  cardTitle: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    fontSize: "16px",
    color: "#dce8f0",
  },
  row: { display: "flex", gap: "10px" },
  input: {
    background: "#0a0e16",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "9px",
    color: "#dce8f0",
    fontFamily: "'DM Mono', monospace",
    fontSize: "14px",
    padding: "11px 14px",
    outline: "none",
    width: "100%",
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
  },
  inputErr: { borderColor: "rgba(255,77,109,0.5)" },
  lookupBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#dce8f0",
    borderRadius: "9px",
    padding: "11px 18px",
    fontSize: "13px",
    fontWeight: 600,
    fontFamily: "'Syne', sans-serif",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "all 0.15s ease",
  },
  errText: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "11.5px",
    color: "#ff4d6d",
  },
  preview: {
    background: "#0c1018",
    border: "1px solid rgba(0,220,180,0.15)",
    borderRadius: "11px",
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  previewGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
  },
  buyBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    background: "linear-gradient(135deg, #f5c842 0%, #d4a020 100%)",
    color: "#07090f",
    border: "none",
    borderRadius: "10px",
    padding: "12px",
    fontSize: "14px",
    fontWeight: 700,
    fontFamily: "'Syne', sans-serif",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(245,200,66,0.2)",
    transition: "all 0.15s ease",
  },
  notForSale: {
    textAlign: "center",
    fontFamily: "'DM Mono', monospace",
    fontSize: "12px",
    color: "#ff4d6d",
    padding: "8px",
  },
};
