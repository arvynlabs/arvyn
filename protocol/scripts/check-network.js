import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { formatEther, getAddress, id, JsonRpcProvider } from "ethers";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const planPath = resolve(
  scriptDirectory,
  "../deployments/robinhood-testnet.plan.json",
);
const plan = JSON.parse(await readFile(planPath, "utf8"));

const provider = new JsonRpcProvider(plan.network.rpc);
const network = await provider.getNetwork();
if (network.chainId !== BigInt(plan.network.chainId)) {
  throw new Error(
    `Wrong chain ID: expected ${plan.network.chainId}, received ${network.chainId}`,
  );
}

const expectedAgentId = id(plan.policy.agentLabel);
if (expectedAgentId !== plan.policy.agentId) {
  throw new Error("The planned agent ID does not match the configured label");
}

console.log(`${plan.network.name}: chain ID ${network.chainId}`);
for (const [role, rawAddress] of Object.entries(plan.accounts)) {
  const address = getAddress(rawAddress);
  const [balance, code] = await Promise.all([
    provider.getBalance(address),
    provider.getCode(address),
  ]);
  console.log(
    `${role}: ${address} | ${formatEther(balance)} ETH | ${code === "0x" ? "wallet" : "contract"}`,
  );
}
