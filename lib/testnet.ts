export const ROBINHOOD_TESTNET = {
  name: "Robinhood Chain Testnet",
  chainId: 46630,
  chainIdHex: "0xb626",
  rpcUrl: "https://rpc.testnet.chain.robinhood.com",
  explorerUrl: "https://explorer.testnet.chain.robinhood.com",
  faucetUrl: "https://faucet.testnet.chain.robinhood.com/",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
} as const;

export const PUBLIC_SANDBOX_ADDRESS = "0x92F35560aA52a4d668555264F84279d633a93596" as const;

export const PUBLIC_SANDBOX_ABI = [
  "function execute() payable",
  "function preview(address participant) view returns (uint256 nextNonce, uint256 cooldownRemaining, bool allowed, uint256 total)",
  "function totalExecutions() view returns (uint256)",
  "function COOLDOWN() view returns (uint64)",
  "function POLICY_ID() view returns (bytes32)",
  "event SandboxExecution(address indexed participant, uint256 indexed nonce, bytes32 indexed policyId, uint256 timestamp)",
] as const;
