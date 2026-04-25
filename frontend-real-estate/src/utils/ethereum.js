import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI, CHAIN_ID, NETWORK_NAME, RPC_URL } from "./contract";

/* ── Provider / Signer ─────────────────────────────────────────────── */

export function isMetaMaskAvailable() {
  return typeof window !== "undefined" && Boolean(window.ethereum);
}

export async function getBrowserProvider() {
  return new ethers.BrowserProvider(window.ethereum);
}

export async function getSigner() {
  const provider = await getBrowserProvider();
  return provider.getSigner();
}

/* ── Network enforcement ────────────────────────────────────────────── */

export async function ensureCorrectNetwork() {
  const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
  if (parseInt(chainIdHex, 16) === CHAIN_ID) return;

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
    });
  } catch (err) {
    // 4902 = chain not in MetaMask yet → add it
    if (err.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId:         `0x${CHAIN_ID.toString(16)}`,
          chainName:       NETWORK_NAME,
          rpcUrls:         [RPC_URL],
          nativeCurrency:  { name: "Ether", symbol: "ETH", decimals: 18 },
        }],
      });
    } else {
      throw err;
    }
  }
}

/* ── Wallet connection ──────────────────────────────────────────────── */

export async function connectWallet() {
  if (!isMetaMaskAvailable()) {
    throw new Error("MetaMask not detected. Please install MetaMask to continue.");
  }

  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  if (!accounts?.length) throw new Error("No accounts found. Unlock MetaMask and try again.");

  await ensureCorrectNetwork();

  const signer  = await getSigner();
  const address = await signer.getAddress();
  return { signer, address };
}

export async function getConnectedAccounts() {
  if (!isMetaMaskAvailable()) return [];
  try {
    return await window.ethereum.request({ method: "eth_accounts" });
  } catch {
    return [];
  }
}

/* ── Contract factory ───────────────────────────────────────────────── */

export function getContract(signerOrProvider) {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider);
}

/* ── Formatting helpers ─────────────────────────────────────────────── */

export function shortAddress(addr) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function weiToEth(wei) {
  return ethers.formatEther(wei.toString());
}

export function ethToWei(eth) {
  return ethers.parseEther(String(eth));
}

/* ── Error parsing ──────────────────────────────────────────────────── */

export function parseEthError(err) {
  // User rejected
  if (err?.code === 4001 || err?.code === "ACTION_REJECTED") {
    return "Transaction rejected — you declined the request in MetaMask.";
  }
  // Wrong network
  if (err?.code === "NETWORK_ERROR") {
    return "Network mismatch. Make sure MetaMask is on the Anvil local network.";
  }
  // Insufficient funds
  if (err?.code === "INSUFFICIENT_FUNDS") {
    return "Insufficient ETH balance to complete this transaction.";
  }
  // Solidity revert with reason string
  if (err?.reason) return `Contract reverted: ${err.reason}`;
  if (err?.data?.message) return err.data.message;

  // Attempt to pull revert reason from message string
  const msg = err?.message ?? "";
  const revertMatch = msg.match(/execution reverted[:\s]+"?([^"]+)"?/i);
  if (revertMatch) return `Reverted: ${revertMatch[1].trim()}`;

  if (msg) return msg.length > 140 ? msg.slice(0, 140) + "…" : msg;
  return "An unknown error occurred.";
}
