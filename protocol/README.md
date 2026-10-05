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

The separate `ArvynPublicSandbox` lets any testnet wallet record a no-value
policy-approved action. It cannot receive or transfer ETH, has no owner, does
not reference the transfer prototype, and applies a 60-second cooldown per wallet.

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

The first policy-approved execution transferred `0.0001 testnet ETH` from the
registered operator through `ArvynRouter` to the allowlisted receiver. The
transaction emitted both `PolicyConsumed` and `TransferExecuted`, advanced the
operator nonce from `0` to `1`, and reduced the daily allowance from `0.003` to
`0.0029 testnet ETH`.

- [First execution transaction](https://explorer.testnet.chain.robinhood.com/tx/0xb0e1dbd8a46ff45cca86bba11f7ba9d19933685fa1eb7db197bac60a5a47afe2)

## Public sandbox

The isolated public sandbox was deployed on October 5, 2026.

- Contract: [`0x92F35560aA52a4d668555264F84279d633a93596`](https://explorer.testnet.chain.robinhood.com/address/0x92F35560aA52a4d668555264F84279d633a93596)
- [Deployment transaction](https://explorer.testnet.chain.robinhood.com/tx/0x9f04a2080199cba63f8b66473d4db61f2c16971818069a7fac3a48afcbbe2635)
- Deployment record: `deployments/robinhood-testnet-sandbox.json`

Run `npm run sandbox:verify` after compiling to compare the receipt, deployer,
runtime bytecode, cooldown, contract balance and live execution count with the
saved record.

The exact unsigned configuration is stored in
`deployments/robinhood-testnet.plan.json`. Run `npm run network:check` to confirm
the chain ID and inspect the public account balances without signing a
transaction. After compiling, `npm run deployment:estimate` checks the complete
constructor transaction against the public RPC and confirms that the deployer
has enough testnet ETH. Run `npm run deployment:verify` to compare the deployed
owners, links, agent status, receiver, limits and bytecode presence with the
saved manifest. Run `npm run execution:verify` to verify the recorded execution
receipt and emitted policy events.

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

After deployment, start the same local server with `npm run execute:ui` and open
`http://127.0.0.1:4173/execute-ui/`. The execution page reads and simulates the
live policy before it can request the fixed `0.0001 testnet ETH` transfer. The
wallet owner must inspect and confirm that transaction personally as well.

This prototype has not been independently audited. It must not be used with valuable assets or on mainnet.
