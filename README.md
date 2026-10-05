# ARVYN

ARVYN is an early-stage product concept for controlled AI-agent execution on Robinhood Chain.

[Website](https://www.arvynagents.xyz/) · [X](https://x.com/arvynxyz)

## Current status

This repository contains the public ARVYN website, an interactive product preview, and an unaudited smart-contract prototype deployed on Robinhood Chain Testnet. There is no published SDK, public API, mainnet protocol, or token contract.

The dashboard, transaction hashes, block numbers, process activity, and network metrics are generated in the browser for interface demonstration. They are not live blockchain telemetry.

| Available now | Planned |
| --- | --- |
| Public website | TypeScript SDK |
| Product and architecture preview | Public API and data streams |
| Interactive dashboard demo | Production policy and routing contracts |
| Testnet contract source and local tests | Audited mainnet deployment |
| Verifiable testnet prototype and execution | Live protocol telemetry |

Examples in the documentation describe the intended developer experience. Package names, endpoints, and contract addresses shown there are illustrative and should not be used in production.

## Local development

Requires Node.js 18 or later.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Create a production build with:

```bash
npm run build
npm start
```

Compile and test the isolated contract prototype with:

```bash
cd protocol
npm install
npm run compile
npm test
```

## Technology

- Next.js 14 and React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Solidity, Hardhat, and OpenZeppelin Contracts for the testnet prototype

## Project structure

```text
app/                 routes and page content
components/          shared interface components
components/network/  dashboard preview components
lib/                 navigation, content, and demo telemetry
public/              brand assets
protocol/            testnet contracts, tests, and deployment records
```

The confirmed Robinhood Chain Testnet addresses and transaction are recorded in
[`protocol/deployments/robinhood-testnet.plan.json`](protocol/deployments/robinhood-testnet.plan.json).

## License

Released under the [MIT License](LICENSE).
