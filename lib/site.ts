export const NAV_LINKS = [
  { label: "Agents", href: "/agents" },
  { label: "Protocol", href: "/protocol" },
  { label: "Ecosystem", href: "/ecosystem" },
  { label: "Docs", href: "/docs" },
  { label: "Token", href: "/token" },
  { label: "App", href: "/app" },
];

export const OFFICIAL_LINKS = {
  github: "https://github.com/arvynlabs/arvyn",
  x: "https://x.com/arvynxyz",
} as const;

export const AGENT_TYPES = [
  {
    id: "market",
    name: "Market Agents",
    tag: "LIVE DATA",
    description: "Monitor liquidity, assets and market conditions.",
    points: ["Real-time price & liquidity feeds", "Volatility and spread alerts", "Cross-market state tracking"],
  },
  {
    id: "research",
    name: "Research Agents",
    tag: "ANALYSIS",
    description: "Analyze protocols and blockchain data.",
    points: ["Protocol profiling & risk scoring", "On-chain activity clustering", "Report generation via API"],
  },
  {
    id: "execution",
    name: "Execution Agents",
    tag: "ON-CHAIN",
    description: "Perform on-chain actions.",
    points: ["Smart-contract call routing", "Policy-guarded transaction signing", "Retry & revert handling"],
  },
  {
    id: "strategy",
    name: "Strategy Agents",
    tag: "AUTOMATION",
    description: "Automate financial workflows.",
    points: ["Multi-step workflow orchestration", "Agent-to-agent coordination", "Scheduled & event-driven runs"],
  },
];

export const TOKEN_USES = [
  { title: "Agent access", text: "Use ARVN to provision agent compute and API throughput." },
  { title: "Protocol services", text: "Pay for execution routing, data feeds, and analytics pipelines." },
  { title: "Ecosystem incentives", text: "Reward builders, operators, and data contributors securing the network." },
  { title: "Governance", text: "Vote on protocol upgrades, fee parameters, and agent standards." },
];
