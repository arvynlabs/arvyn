import assert from "node:assert/strict";
import { Contract, JsonRpcProvider, getAddress } from "ethers";
import artifact from "../artifacts/contracts/ArvynPublicSandbox.sol/ArvynPublicSandbox.json" with { type: "json" };
import deployment from "../deployments/robinhood-testnet-sandbox.json" with { type: "json" };

const provider = new JsonRpcProvider(
  deployment.network.rpcUrl,
  deployment.network.chainId,
  { staticNetwork: true },
);
const address = getAddress(deployment.contract.address);
const receipt = await provider.getTransactionReceipt(deployment.deployment.transactionHash);

assert(receipt, "Deployment receipt was not found");
assert.equal(receipt.status, 1, "Deployment transaction did not succeed");
assert.equal(receipt.blockNumber, deployment.deployment.blockNumber, "Deployment block does not match");
assert.equal(getAddress(receipt.contractAddress), address, "Receipt contract address does not match");
assert.equal(getAddress(receipt.from), getAddress(deployment.deployer), "Deployer does not match");

const onchainCode = await provider.getCode(address);
assert.notEqual(onchainCode, "0x", "No bytecode was found at the sandbox address");
assert.equal(onchainCode.toLowerCase(), artifact.deployedBytecode.toLowerCase(), "Onchain bytecode does not match the compiled contract");

const sandbox = new Contract(address, artifact.abi, provider);
const [cooldown, policyId, totalExecutions, balance] = await Promise.all([
  sandbox.COOLDOWN(),
  sandbox.POLICY_ID(),
  sandbox.totalExecutions(),
  provider.getBalance(address),
]);

assert.equal(cooldown, BigInt(deployment.contract.cooldownSeconds), "Cooldown does not match");
assert.equal(balance, 0n, "Sandbox contract unexpectedly holds ETH");

console.log("ARVYN public sandbox verified");
console.log(`Contract: ${address}`);
console.log(`Deployment block: ${receipt.blockNumber}`);
console.log(`Deployment tx: ${deployment.network.explorer}/tx/${receipt.hash}`);
console.log(`Runtime bytecode: ${(onchainCode.length - 2) / 2} bytes`);
console.log(`Cooldown: ${cooldown.toString()} seconds`);
console.log(`Policy ID: ${policyId}`);
console.log(`Public executions: ${totalExecutions.toString()}`);
console.log(`Contract balance: ${balance.toString()} wei`);
