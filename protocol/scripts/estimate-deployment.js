import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  ContractFactory,
  formatEther,
  getAddress,
  JsonRpcProvider,
} from "ethers";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const protocolDirectory = resolve(scriptDirectory, "..");
const plan = JSON.parse(
  await readFile(
    resolve(protocolDirectory, "deployments/robinhood-testnet.plan.json"),
    "utf8",
  ),
);
const artifact = JSON.parse(
  await readFile(
    resolve(
      protocolDirectory,
      "artifacts/contracts/ArvynTestnetBootstrap.sol/ArvynTestnetBootstrap.json",
    ),
    "utf8",
  ),
);

const provider = new JsonRpcProvider(plan.network.rpc);
const admin = getAddress(plan.accounts.adminAndOperator);
const factory = new ContractFactory(artifact.abi, artifact.bytecode);
const transaction = await factory.getDeployTransaction(
  ...plan.bootstrap.constructorArguments,
);

const [gas, feeData, balance] = await Promise.all([
  provider.estimateGas({ ...transaction, from: admin }),
  provider.getFeeData(),
  provider.getBalance(admin),
]);
const gasPrice = feeData.maxFeePerGas ?? feeData.gasPrice;
const estimatedCost = gasPrice ? gas * gasPrice : null;

console.log(`Estimated gas: ${gas}`);
console.log(
  estimatedCost === null
    ? "The RPC did not return a gas price"
    : `Estimated maximum fee: ${formatEther(estimatedCost)} testnet ETH`,
);
console.log(`Deployer balance: ${formatEther(balance)} testnet ETH`);
if (estimatedCost !== null && estimatedCost >= balance) {
  throw new Error("The deployer does not have enough testnet ETH for deployment");
}
