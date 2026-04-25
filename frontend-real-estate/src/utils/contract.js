export const CONTRACT_ADDRESS = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";
export const CHAIN_ID        = 31337;
export const NETWORK_NAME    = "Anvil Local";
export const RPC_URL         = "http://127.0.0.1:8545";

export const CONTRACT_ABI = [
  {
    inputs: [
      { internalType: "string",  name: "name",  type: "string"  },
      { internalType: "uint256", name: "price", type: "uint256" },
    ],
    name: "addProperty",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
    name: "buyProperty",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "propertyCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "properties",
    outputs: [
      { internalType: "uint256", name: "id",      type: "uint256" },
      { internalType: "string",  name: "name",    type: "string"  },
      { internalType: "uint256", name: "price",   type: "uint256" },
      { internalType: "address", name: "owner",   type: "address" },
      { internalType: "bool",    name: "forSale", type: "bool"    },
    ],
    stateMutability: "view",
    type: "function",
  },
];
