import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Contract, getAddress, id, JsonRpcProvider } from "ethers";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const protocolDirectory = resolve(scriptDirectory, "..");
const readJson = async (path) =>
  JSON.parse(await readFile(resolve(protocolDirectory, path), "utf8"));

const plan = await readJson("deployments/robinhood-testnet.plan.json");
const [bootstrapArtifact, registryArtifact, guardArtifact, routerArtifact] =
  await Promise.all([
    readJson("artifacts/contracts/ArvynTestnetBootstrap.sol/ArvynTestnetBootstrap.json"),
    readJson("artifacts/contracts/AgentRegistry.sol/AgentRegistry.json"),
    readJson("artifacts/contracts/PolicyGuard.sol/PolicyGuard.json"),
    readJson("artifacts/contracts/ArvynRouter.sol/ArvynRouter.json"),
  ]);

if (plan.status !== "deployed_testnet") {
  throw new Error(`Unexpected deployment status: ${plan.status}`);
}

const provider = new JsonRpcProvider(plan.network.rpc);
const addresses = Object.fromEntries(
  Object.entries(plan.contracts).map(([name, address]) => [name, getAddress(address)]),
);
const admin = getAddress(plan.accounts.adminAndOperator);
const receiver = getAddress(plan.accounts.allowedReceiver);
const agentId = id(plan.policy.agentLabel);

const bootstrap = new Contract(addresses.bootstrap, bootstrapArtifact.abi, provider);
const registry = new Contract(addresses.agentRegistry, registryArtifact.abi, provider);
const guard = new Contract(addresses.policyGuard, guardArtifact.abi, provider);
const router = new Contract(addresses.arvynRouter, routerArtifact.abi, provider);

function expectEqual(label, actual, expected) {
  if (String(actual).toLowerCase() !== String(expected).toLowerCase()) {
    throw new Error(`${label}: expected ${expected}, received ${actual}`);
  }
}

const receipt = await provider.getTransactionReceipt(plan.deploymentTransaction.hash);
if (!receipt || receipt.status !== 1) {
  throw new Error("The deployment transaction is missing or unsuccessful");
}
expectEqual("deployment contract", receipt.contractAddress, addresses.bootstrap);
expectEqual("deployment block", receipt.blockNumber, plan.deploymentTransaction.blockNumber);

const codes = await Promise.all(
  Object.values(addresses).map((address) => provider.getCode(address)),
);
codes.forEach((code, index) => {
  if (code === "0x") {
    throw new Error(`No bytecode at ${Object.values(addresses)[index]}`);
  }
});

const [
  bootstrapRegistry,
  bootstrapGuard,
  bootstrapRouter,
  registryOwner,
  agent,
  guardOwner,
  configuredRouter,
  policy,
  routerOwner,
  routerRegistry,
  routerGuard,
  routerPaused,
  guardPaused,
] = await Promise.all([
  bootstrap.agentRegistry(),
  bootstrap.policyGuard(),
  bootstrap.arvynRouter(),
  registry.owner(),
  registry.getAgent(agentId),
  guard.owner(),
  guard.router(),
  guard.getPolicy(agentId),
  router.owner(),
  router.agentRegistry(),
  router.policyGuard(),
  router.paused(),
  guard.paused(),
]);

expectEqual("bootstrap registry", bootstrapRegistry, addresses.agentRegistry);
expectEqual("bootstrap guard", bootstrapGuard, addresses.policyGuard);
expectEqual("bootstrap router", bootstrapRouter, addresses.arvynRouter);
expectEqual("registry owner", registryOwner, admin);
expectEqual("guard owner", guardOwner, admin);
expectEqual("router owner", routerOwner, admin);
expectEqual("agent operator", agent.operator, admin);
expectEqual("agent active", agent.active, true);
expectEqual("policy receiver", policy.receiver, receiver);
expectEqual(
  "per-transaction limit",
  policy.maxPerTransaction,
  plan.policy.maxPerTransactionWei,
);
expectEqual("daily limit", policy.dailyLimit, plan.policy.dailyLimitWei);
expectEqual("policy active", policy.active, true);
expectEqual("configured router", configuredRouter, addresses.arvynRouter);
expectEqual("router registry", routerRegistry, addresses.agentRegistry);
expectEqual("router guard", routerGuard, addresses.policyGuard);
expectEqual("router paused", routerPaused, false);
expectEqual("guard paused", guardPaused, false);

console.log(`Verified deployment in block ${receipt.blockNumber}`);
console.log(`Transaction: ${plan.network.explorer}/tx/${receipt.hash}`);
for (const [name, address] of Object.entries(addresses)) {
  console.log(`${name}: ${address}`);
}
