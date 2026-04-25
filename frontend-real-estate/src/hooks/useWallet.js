import { useState, useEffect, useCallback } from "react";
import { connectWallet, getConnectedAccounts, ensureCorrectNetwork, getSigner, parseEthError } from "../utils/ethereum";

export function useWallet() {
  const [address,    setAddress]    = useState(null);
  const [signer,     setSigner]     = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [error,      setError]      = useState(null);

  /* ── Connect ──────────────────────────────────────────────────────── */
  const connect = useCallback(async () => {
    setConnecting(true);
    setError(null);
    try {
      const { signer, address } = await connectWallet();
      setSigner(signer);
      setAddress(address);
    } catch (err) {
      setError(parseEthError(err));
    } finally {
      setConnecting(false);
    }
  }, []);

  /* ── Disconnect ───────────────────────────────────────────────────── */
  const disconnect = useCallback(() => {
    setSigner(null);
    setAddress(null);
    setError(null);
  }, []);

  /* ── Auto-reconnect on mount if already authorized ─────────────────── */
  useEffect(() => {
    (async () => {
      const accounts = await getConnectedAccounts();
      if (accounts.length > 0) {
        try {
          await ensureCorrectNetwork();
          const s   = await getSigner();
          const addr = await s.getAddress();
          setSigner(s);
          setAddress(addr);
        } catch {
          // silently skip — user can click Connect
        }
      }
    })();
  }, []);

  /* ── MetaMask event listeners ───────────────────────────────────────── */
  useEffect(() => {
    if (!window.ethereum) return;

    const onAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        try {
          const s   = await getSigner();
          const addr = await s.getAddress();
          setSigner(s);
          setAddress(addr);
        } catch {
          disconnect();
        }
      }
    };

    const onChainChanged = () => window.location.reload();

    window.ethereum.on("accountsChanged", onAccountsChanged);
    window.ethereum.on("chainChanged",    onChainChanged);
    return () => {
      window.ethereum.removeListener("accountsChanged", onAccountsChanged);
      window.ethereum.removeListener("chainChanged",    onChainChanged);
    };
  }, [disconnect]);

  return { address, signer, connecting, error, connect, disconnect };
}
