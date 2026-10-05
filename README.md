# ARVYN

ARVYN is an early-stage product concept for controlled AI-agent execution on Robinhood Chain.

[Website](https://www.arvynagents.xyz/) · [X](https://x.com/arvynxyz)

## Current status

This repository contains the public ARVYN website and an interactive product preview. It does not yet contain a deployed protocol, published SDK, public API, smart contracts, or token contract.

The dashboard, transaction hashes, block numbers, process activity, and network metrics are generated in the browser for interface demonstration. They are not live blockchain telemetry.

| Available now | Planned |
| --- | --- |
| Public website | TypeScript SDK |
| Product and architecture preview | Public API and data streams |
| Interactive dashboard demo | Deployed policy and routing contracts |
| Open website source | Verifiable testnet integrations |

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

## Technology

- Next.js 14 and React 18
- TypeScript
- Tailwind CSS
- Framer Motion

## Project structure

```text
app/                 routes and page content
components/          shared interface components
components/network/  dashboard preview components
lib/                 navigation, content, and demo telemetry
public/              brand assets
```

## License

Released under the [MIT License](LICENSE).
