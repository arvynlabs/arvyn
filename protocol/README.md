# ARVYN protocol prototype

This directory contains an isolated testnet prototype. It does not change the public website runtime and it is not a production release.

## Scope

The first executable flow is deliberately narrow:

- native testnet ETH only;
- one registered operator;
- one allowlisted receiver;
- a per-transaction limit;
- a daily limit;
- deadline and nonce checks;
- an emergency pause;
- no custody and no stored wallet keys.

No token contract, swap, bridge, production SDK or mainnet deployment is included.

## Robinhood Chain Testnet

| Field | Value |
| --- | --- |
| Chain ID | `46630` |
| RPC | `https://rpc.testnet.chain.robinhood.com` |
| Explorer | `https://explorer.testnet.chain.robinhood.com` |
| Native currency | `ETH` |

## Local verification

```bash
npm install
npm run compile
npm test
```

## Deployed test configuration

- Admin and operator: `0xE901B4e664B863111351617579F7422d56aCa88c`
- Allowed receiver: `0x0b93203D236B4Cf6905650F51a28be8845d5ec86`
- Agent ID: `keccak256("ARVYN_TEST_AGENT_V1")`
- Maximum per transfer: `0.001 ETH`
- Daily limit: `0.003 ETH`

`ArvynTestnetBootstrap` applies this configuration atomically. One deployment
creates `AgentRegistry`, `PolicyGuard` and `ArvynRouter`, connects them, then
transfers every owner role to the admin address. The bootstrap retains no
administrative control.

These are public testnet addresses, not secrets. Never commit a seed phrase, private key, wallet password or `.env` file.

## Deployment status

Deployed on Robinhood Chain Testnet on October 5, 2026. The transaction and
all four contract addresses are recorded in
`deployments/robinhood-testnet.plan.json`.

- [Deployment transaction](https://explorer.testnet.chain.robinhood.com/tx/0xeee581003afb3a707350522839cf758891283859039dfd51d91928b02dbd8531)
- [ArvynRouter](https://explorer.testnet.chain.robinhood.com/address/0xbe8900130fC645BF375200639dB3249912Afe1ee)
- [PolicyGuard](https://explorer.testnet.chain.robinhood.com/address/0x06CCeDd7480dd8858b29a5AFd5E28d5D3e61F37c)
- [AgentRegistry](https://explorer.testnet.chain.robinhood.com/address/0x25471e32C4037fD877Bb1D993CD8FB8B028925F8)

The exact unsigned configuration is stored in
`deployments/robinhood-testnet.plan.json`. Run `npm run network:check` to confirm
the chain ID and inspect the public account balances without signing a
transaction. After compiling, `npm run deployment:estimate` checks the complete
constructor transaction against the public RPC and confirms that the deployer
has enough testnet ETH. Run `npm run deployment:verify` to compare the deployed
owners, links, agent status, receiver, limits and bytecode presence with the
saved manifest.

For a MetaMask deployment without exporting a private key, compile the
contracts and start the local deployment page:

```bash
npm run compile
npm run deploy:ui
```

Open `http://127.0.0.1:4173/deploy-ui/` in the browser where MetaMask is
installed. The page validates the network and account and estimates gas before
enabling the deployment request. The wallet owner must inspect and confirm the
transaction personally.

This prototype has not been independently audited. It must not be used with valuable assets or on mainnet.
