import React, { useState } from "react";
import Spinner from "./Spinner";

export default function AddPropertyForm({ onAdd, loading }) {
  const [name,  setName]  = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!name.trim())          e.name  = "Property name is required.";
    if (!price || isNaN(price) || Number(price) <= 0) e.price = "Enter a valid ETH price > 0.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    const ok = await onAdd(name.trim(), price);
    if (ok) { setName(""); setPrice(""); setErrors({}); }
  }

  return (
    <form onSubmit={handleSubmit} style={s.card}>
      <div style={s.cardHeader}>
        <span style={s.cardIcon}>🏗</span>
        <h2 style={s.cardTitle}>List a Property</h2>
      </div>

      <div style={s.field}>
        <label style={s.label}>Property Name</label>
        <input
          style={{ ...s.input, ...(errors.name ? s.inputErr : {}) }}
          type="text"
          placeholder="e.g. Ocean View Villa, Block 12…"
          value={name}
          onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: "" })); }}
          disabled={loading}
        />
        {errors.name && <span style={s.errText}>{errors.name}</span>}
      </div>

      <div style={s.field}>
        <label style={s.label}>Price (ETH)</label>
        <input
          style={{ ...s.input, ...(errors.price ? s.inputErr : {}) }}
          type="number"
          step="0.0001"
          min="0"
          placeholder="0.5"
          value={price}
          onChange={e => { setPrice(e.target.value); setErrors(p => ({ ...p, price: "" })); }}
          disabled={loading}
        />
        {errors.price && <span style={s.errText}>{errors.price}</span>}
      </div>

      <button type="submit" style={{ ...s.btn, opacity: loading ? 0.6 : 1 }} disabled={loading}>
        {loading ? <><Spinner size={14} color="#07090f" />&nbsp;Processing…</> : "List Property →"}
      </button>
    </form>
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
    animation: "fadeUp 0.4s ease 0.05s both",
  },
  cardHeader: { display: "flex", alignItems: "center", gap: "10px" },
  cardIcon: { fontSize: "20px" },
  cardTitle: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    fontSize: "16px",
    color: "#dce8f0",
  },
  field: { display: "flex", flexDirection: "column", gap: "7px" },
  label: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "11px",
    color: "#6b8090",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  },
  input: {
    background: "#0a0e16",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "9px",
    color: "#dce8f0",
    fontFamily: "'DM Mono', monospace",
    fontSize: "14px",
    padding: "11px 14px",
    width: "100%",
    outline: "none",
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
  },
  inputErr: {
    borderColor: "rgba(255,77,109,0.5)",
    boxShadow: "0 0 0 3px rgba(255,77,109,0.08)",
  },
  errText: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "11.5px",
    color: "#ff4d6d",
  },
  btn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    background: "linear-gradient(135deg, #00dcb4 0%, #00a888 100%)",
    color: "#07090f",
    border: "none",
    borderRadius: "10px",
    padding: "12px",
    fontSize: "14px",
    fontWeight: 700,
    fontFamily: "'Syne', sans-serif",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(0,220,180,0.2)",
    transition: "all 0.15s ease",
    marginTop: "4px",
  },
};
