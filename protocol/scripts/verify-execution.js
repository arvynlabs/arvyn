import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Contract, getAddress, id, Interface, JsonRpcProvider } from "ethers";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const protocolDirectory = resolve(scriptDirectory, "..");
const readJson = async (path) =>
  JSON.parse(await readFile(resolve(protocolDirectory, path), "utf8"));

const plan = await readJson("deployments/robinhood-testnet.plan.json");
const [routerArtifact, guardArtifact] = await Promise.all([
  readJson("artifacts/contracts/ArvynRouter.sol/ArvynRouter.json"),
  readJson("artifacts/contracts/PolicyGuard.sol/PolicyGuard.json"),
]);
const execution = plan.validationExecutions.at(-1);
if (!execution) throw new Error("No validation execution is recorded");

const provider = new JsonRpcProvider(plan.network.rpc);
const routerAddress = getAddress(plan.contracts.arvynRouter);
const guardAddress = getAddress(plan.contracts.policyGuard);
const operator = getAddress(execution.operator);
const receiver = getAddress(execution.receiver);
const agentId = id(plan.policy.agentLabel);
const [transaction, receipt] = await Promise.all([
  provider.getTransaction(execution.hash),
  provider.getTransactionReceipt(execution.hash),
]);

if (!transaction || !receipt || receipt.status !== 1) {
  throw new Error("The recorded execution transaction is missing or unsuccessful");
}

function expectEqual(label, actual, expected) {
  if (String(actual).toLowerCase() !== String(expected).toLowerCase()) {
    throw new Error(`${label}: expected ${expected}, received ${actual}`);
  }
}

expectEqual("transaction sender", transaction.from, operator);
expectEqual("transaction target", transaction.to, routerAddress);
expectEqual("transaction value", transaction.value, execution.amountWei);
expectEqual("execution block", receipt.blockNumber, execution.blockNumber);
expectEqual("execution gas", receipt.gasUsed, execution.gasUsed);

const routerInterface = new Interface(routerArtifact.abi);
const guardInterface = new Interface(guardArtifact.abi);
let transferEvent;
let policyEvent;
for (const log of receipt.logs) {
  try {
    const event = routerInterface.parseLog(log);
    if (event?.name === "TransferExecuted") transferEvent = event;
  } catch {}
  try {
    const event = guardInterface.parseLog(log);
    if (event?.name === "PolicyConsumed") policyEvent = event;
  } catch {}
}

if (!transferEvent || !policyEvent) {
  throw new Error("Expected execution events were not found");
}

expectEqual("transfer agent", transferEvent.args.agentId, agentId);
expectEqual("transfer operator", transferEvent.args.operator, operator);
expectEqual("transfer receiver", transferEvent.args.receiver, receiver);
expectEqual("transfer amount", transferEvent.args.amount, execution.amountWei);
expectEqual("transfer nonce", transferEvent.args.nonce, execution.nonce);
expectEqual("policy agent", policyEvent.args.agentId, agentId);
expectEqual("policy receiver", policyEvent.args.receiver, receiver);
expectEqual("policy amount", policyEvent.args.amount, execution.amountWei);

const router = new Contract(routerAddress, routerArtifact.abi, provider);
const nextNonce = await router.nonces(operator);
if (nextNonce < BigInt(execution.nonce) + 1n) {
  throw new Error(`Operator nonce did not advance: ${nextNonce}`);
}

console.log(`Verified policy-approved execution in block ${receipt.blockNumber}`);
console.log(`Transaction: ${plan.network.explorer}/tx/${receipt.hash}`);
console.log(`Amount: ${execution.amountWei} wei`);
console.log(`Recorded nonce: ${execution.nonce}; current next nonce: ${nextNonce}`);
