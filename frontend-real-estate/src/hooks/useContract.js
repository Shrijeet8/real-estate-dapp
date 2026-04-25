import { useState, useCallback } from "react";
import { getContract, weiToEth, ethToWei, parseEthError } from "../utils/ethereum";

export function useContract(signer) {
  const [loading,   setLoading]   = useState(false);
  const [txMessage, setTxMessage] = useState(null); // { type: 'success'|'error'|'pending', text }

  const clearMessage = useCallback(() => setTxMessage(null), []);

  /* ── Read helpers ─────────────────────────────────────────────────── */

  const getPropertyCount = useCallback(async () => {
    if (!signer) return 0;
    const c = getContract(signer);
    return Number(await c.propertyCount());
  }, [signer]);

  const getAllProperties = useCallback(async () => {
    if (!signer) return [];
    const c     = getContract(signer);
    const count = Number(await c.propertyCount());
    const list  = [];
    for (let i = 1; i <= count; i++) {
      const p = await c.properties(i);
      list.push({
        id:      Number(p[0]),
        name:    p[1],
        price:   weiToEth(p[2]),
        priceWei: p[2],
        owner:   p[3],
        forSale: p[4],
      });
    }
    return list;
  }, [signer]);

  const getPropertyById = useCallback(async (id) => {
    if (!signer) return null;
    const c = getContract(signer);
    const p = await c.properties(id);
    return {
      id:       Number(p[0]),
      name:     p[1],
      price:    weiToEth(p[2]),
      priceWei: p[2],
      owner:    p[3],
      forSale:  p[4],
    };
  }, [signer]);

  /* ── Write: addProperty ───────────────────────────────────────────── */

  const addProperty = useCallback(async (name, priceEth) => {
    if (!signer) { setTxMessage({ type: "error", text: "Connect your wallet first." }); return false; }
    setLoading(true);
    setTxMessage({ type: "pending", text: "Waiting for MetaMask confirmation…" });
    try {
      const c  = getContract(signer);
      const tx = await c.addProperty(name, ethToWei(priceEth));
      setTxMessage({ type: "pending", text: `Tx submitted (${tx.hash.slice(0,10)}…). Mining…` });
      await tx.wait();
      setTxMessage({ type: "success", text: `✓ Property "${name}" listed successfully!` });
      return true;
    } catch (err) {
      setTxMessage({ type: "error", text: parseEthError(err) });
      return false;
    } finally {
      setLoading(false);
    }
  }, [signer]);

  /* ── Write: buyProperty ───────────────────────────────────────────── */

  const buyProperty = useCallback(async (id, priceEth) => {
    if (!signer) { setTxMessage({ type: "error", text: "Connect your wallet first." }); return false; }
    setLoading(true);
    setTxMessage({ type: "pending", text: "Waiting for MetaMask confirmation…" });
    try {
      const c  = getContract(signer);
      const tx = await c.buyProperty(id, { value: ethToWei(priceEth) });
      setTxMessage({ type: "pending", text: `Tx submitted (${tx.hash.slice(0,10)}…). Mining…` });
      await tx.wait();
      setTxMessage({ type: "success", text: `✓ Property #${id} purchased successfully!` });
      return true;
    } catch (err) {
      setTxMessage({ type: "error", text: parseEthError(err) });
      return false;
    } finally {
      setLoading(false);
    }
  }, [signer]);

  return {
    loading,
    txMessage,
    clearMessage,
    getPropertyCount,
    getAllProperties,
    getPropertyById,
    addProperty,
    buyProperty,
  };
}
