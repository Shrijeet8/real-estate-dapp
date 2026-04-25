import React, { useState, useEffect, useCallback } from "react";
import { useWallet }   from "./hooks/useWallet";
import { useContract } from "./hooks/useContract";

import Header         from "./components/Header";
import ConnectPrompt  from "./components/ConnectPrompt";
import StatCard       from "./components/StatCard";
import AddPropertyForm from "./components/AddPropertyForm";
import BuyPropertyForm from "./components/BuyPropertyForm";
import PropertyList   from "./components/PropertyList";
import Toast          from "./components/Toast";

import { shortAddress } from "./utils/ethereum";
import { CONTRACT_ADDRESS } from "./utils/contract";

export default function App() {
  const { address, signer, connecting, error: walletError, connect, disconnect } = useWallet();

  const {
    loading,
    txMessage,
    clearMessage,
    getPropertyCount,
    getAllProperties,
    getPropertyById,
    addProperty,
    buyProperty,
  } = useContract(signer);

  const [propCount,   setPropCount]   = useState(null);
  const [properties,  setProperties]  = useState([]);
  const [listLoading, setListLoading] = useState(false);

  /* ── Load all data ────────────────────────────────────────────────── */
  const refreshData = useCallback(async () => {
    if (!signer) return;
    setListLoading(true);
    try {
      const [count, props] = await Promise.all([getPropertyCount(), getAllProperties()]);
      setPropCount(count);
      setProperties(props);
    } catch (e) {
      console.error("Failed to refresh data:", e);
    } finally {
      setListLoading(false);
    }
  }, [signer, getPropertyCount, getAllProperties]);

  useEffect(() => {
    if (signer) refreshData();
    else { setPropCount(null); setProperties([]); }
  }, [signer]);

  /* ── Handlers ─────────────────────────────────────────────────────── */
  const handleAdd = async (name, price) => {
    const ok = await addProperty(name, price);
    if (ok) refreshData();
    return ok;
  };

  const handleBuy = async (id, price) => {
    const ok = await buyProperty(id, price);
    if (ok) refreshData();
    return ok;
  };

  /* ── Sold count ─────────────────────────────────────────────────── */
  const forSaleCount = properties.filter(p => p.forSale).length;
  const soldCount    = properties.filter(p => !p.forSale).length;

  return (
    <div style={layout.app}>
      <Header
        address={address}
        connecting={connecting}
        onConnect={connect}
        onDisconnect={disconnect}
      />

      {!address ? (
        <ConnectPrompt
          onConnect={connect}
          connecting={connecting}
          error={walletError}
        />
      ) : (
        <main style={layout.main}>

          {/* Toast notification */}
          {txMessage && (
            <Toast message={txMessage} onClose={clearMessage} />
          )}

          {/* ── Stats row ─────────────────────────────────────────── */}
          <div style={layout.statsRow}>
            <StatCard label="Total Properties" value={propCount ?? "…"} icon="🏠" accent="#00dcb4" />
            <StatCard label="For Sale"          value={forSaleCount}     icon="🟢" accent="#00dcb4" />
            <StatCard label="Sold"              value={soldCount}        icon="🔴" accent="#f5c842" />
            <StatCard
              label="Contract"
              value={shortAddress(CONTRACT_ADDRESS)}
              icon="📜"
              accent="#6b8090"
            />
          </div>

          {/* ── Forms row ─────────────────────────────────────────── */}
          <div style={layout.formsRow}>
            <AddPropertyForm onAdd={handleAdd}  loading={loading} />
            <BuyPropertyForm onLookup={getPropertyById} onBuy={handleBuy} loading={loading} />
          </div>

          {/* ── Property list ─────────────────────────────────────── */}
          <PropertyList
            properties={properties}
            loading={listLoading}
            onRefresh={refreshData}
            connectedAddress={address}
          />

          {/* Footer */}
          <footer style={layout.footer}>
            <span style={layout.footerText}>
              PropChain · Deployed at&nbsp;
              <code style={layout.code}>{CONTRACT_ADDRESS}</code>
            </span>
          </footer>
        </main>
      )}
    </div>
  );
}

const layout = {
  app: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  main: {
    flex: 1,
    maxWidth: "1100px",
    width: "100%",
    margin: "0 auto",
    padding: "36px 24px 48px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  statsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "14px",
    animation: "fadeUp 0.4s ease both",
  },
  formsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  footer: {
    marginTop: "8px",
    textAlign: "center",
  },
  footerText: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "11px",
    color: "#354550",
  },
  code: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "11px",
    color: "#4a6070",
  },
};
