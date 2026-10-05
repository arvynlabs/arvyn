import {
  BrowserProvider,
  ContractFactory,
  formatEther,
  getAddress,
  parseEther,
} from "ethers";
import artifact from "../artifacts/contracts/ArvynTestnetBootstrap.sol/ArvynTestnetBootstrap.json";
import plan from "../deployments/robinhood-testnet.plan.json";

const expectedChainId = BigInt(plan.network.chainId);
const expectedChainHex = `0x${expectedChainId.toString(16)}`;
const admin = getAddress(plan.accounts.adminAndOperator);
const receiver = getAddress(plan.accounts.allowedReceiver);
const maxPerTransaction = BigInt(plan.policy.maxPerTransactionWei);
const dailyLimit = BigInt(plan.policy.dailyLimitWei);

const elements = {
  adminAddress: document.querySelector("#adminAddress"),
  receiverAddress: document.querySelector("#receiverAddress"),
  feeEstimate: document.querySelector("#feeEstimate"),
  statusDot: document.querySelector("#statusDot"),
  statusText: document.querySelector("#statusText"),
  warning: document.querySelector("#warning"),
  connectButton: document.querySelector("#connectButton"),
  switchButton: document.querySelector("#switchButton"),
  deployButton: document.querySelector("#deployButton"),
  result: document.querySelector("#result"),
  contractList: document.querySelector("#contractList"),
  transactionLink: document.querySelector("#transactionLink"),
};

elements.adminAddress.textContent = admin;
elements.receiverAddress.textContent = receiver;

let provider;
let signer;
let connectedAddress;
let estimatedGas;

function setStatus(text, ready = false) {
  elements.statusText.textContent = text;
  elements.statusDot.classList.toggle("ready", ready);
}

function setWarning(message = "") {
  elements.warning.textContent = message;
  elements.warning.hidden = message.length === 0;
}

function resetDeploymentState() {
  estimatedGas = undefined;
  elements.deployButton.disabled = true;
  elements.feeEstimate.textContent = "Connect the wallet to estimate";
}

async function switchNetwork() {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: expectedChainHex }],
    });
    await refreshWallet();
  } catch (error) {
    setWarning(error?.shortMessage ?? error?.message ?? "Network switch was cancelled");
  }
}

async function estimateDeployment() {
  const factory = new ContractFactory(artifact.abi, artifact.bytecode, signer);
  const transaction = await factory.getDeployTransaction(
    admin,
    receiver,
    maxPerTransaction,
    dailyLimit,
  );
  estimatedGas = await signer.estimateGas(transaction);
  const feeData = await provider.getFeeData();
  const gasPrice = feeData.maxFeePerGas ?? feeData.gasPrice;

  elements.feeEstimate.textContent = gasPrice
    ? `up to ${formatEther(estimatedGas * gasPrice)} testnet ETH`
    : `${estimatedGas.toString()} gas units`;
  elements.deployButton.disabled = false;
}

async function refreshWallet() {
  resetDeploymentState();
  setWarning();
  provider = new BrowserProvider(window.ethereum);
  const accounts = await provider.send("eth_accounts", []);

  if (accounts.length === 0) {
    connectedAddress = undefined;
    signer = undefined;
    setStatus("Wallet not connected");
    elements.connectButton.hidden = false;
    elements.switchButton.hidden = true;
    return;
  }

  signer = await provider.getSigner();
  connectedAddress = getAddress(await signer.getAddress());
  const network = await provider.getNetwork();
  elements.connectButton.hidden = true;

  if (network.chainId !== expectedChainId) {
    setStatus(`Wrong network: ${network.chainId}`);
    setWarning("Switch MetaMask to Robinhood Chain Testnet before deployment.");
    elements.switchButton.hidden = false;
    return;
  }

  elements.switchButton.hidden = true;
  if (connectedAddress !== admin) {
    setStatus("Wrong MetaMask account");
    setWarning(`Select the ARVYN Deployer account ending in ${admin.slice(-6)}.`);
    return;
  }

  const balance = await provider.getBalance(connectedAddress);
  setStatus(`Ready · ${formatEther(balance)} testnet ETH`, true);
  try {
    await estimateDeployment();
  } catch (error) {
    setWarning(error?.shortMessage ?? error?.message ?? "Unable to estimate deployment gas");
  }
}

async function connectWallet() {
  if (!window.ethereum) {
    setWarning("MetaMask was not detected. Open this local page in the browser where MetaMask is installed.");
    return;
  }
  try {
    provider = new BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    await refreshWallet();
  } catch (error) {
    setWarning(error?.shortMessage ?? error?.message ?? "Wallet connection was cancelled");
  }
}

function contractRow(label, address) {
  const url = `${plan.network.explorer}/address/${address}`;
  return `<div><span>${label}</span><a href="${url}" target="_blank" rel="noopener noreferrer">${address}</a></div>`;
}

async function requestDeployment() {
  elements.deployButton.disabled = true;
  elements.deployButton.textContent = "Waiting for MetaMask";
  setWarning("MetaMask is open. Confirm only if it shows Robinhood Chain Testnet and no transfer value.");

  try {
    const factory = new ContractFactory(artifact.abi, artifact.bytecode, signer);
    const bootstrap = await factory.deploy(
      admin,
      receiver,
      maxPerTransaction,
      dailyLimit,
      { gasLimit: (estimatedGas * 120n) / 100n },
    );
    const transaction = bootstrap.deploymentTransaction();
    setStatus("Transaction submitted. Waiting for confirmation", true);
    elements.deployButton.textContent = "Waiting for confirmation";

    const receipt = await transaction.wait();
    const parser = bootstrap.interface;
    const deploymentEvent = receipt.logs
      .map((log) => {
        try {
          return parser.parseLog(log);
        } catch {
          return null;
        }
      })
      .find((event) => event?.name === "TestnetSystemDeployed");

    if (!deploymentEvent) {
      throw new Error("Deployment event was not found in the transaction receipt");
    }

    const args = deploymentEvent.args;
    const addresses = {
      bootstrap: await bootstrap.getAddress(),
      agentRegistry: args.agentRegistry,
      policyGuard: args.policyGuard,
      arvynRouter: args.arvynRouter,
    };

    elements.contractList.innerHTML = [
      contractRow("Bootstrap", addresses.bootstrap),
      contractRow("AgentRegistry", addresses.agentRegistry),
      contractRow("PolicyGuard", addresses.policyGuard),
      contractRow("ArvynRouter", addresses.arvynRouter),
    ].join("");
    elements.transactionLink.href = `${plan.network.explorer}/tx/${receipt.hash}`;
    elements.result.hidden = false;
    elements.result.scrollIntoView({ behavior: "smooth", block: "start" });
    setWarning();
    setStatus("Deployment confirmed", true);
    elements.deployButton.textContent = "Deployment complete";
  } catch (error) {
    const message = error?.shortMessage ?? error?.message ?? "Deployment failed";
    setWarning(message);
    setStatus("Deployment not completed");
    elements.deployButton.textContent = "Request testnet deployment";
    elements.deployButton.disabled = false;
  }
}

elements.connectButton.addEventListener("click", connectWallet);
elements.switchButton.addEventListener("click", switchNetwork);
elements.deployButton.addEventListener("click", requestDeployment);

if (window.ethereum) {
  window.ethereum.on("accountsChanged", refreshWallet);
  window.ethereum.on("chainChanged", refreshWallet);
  await refreshWallet();
} else {
  setWarning("MetaMask was not detected. Open this local page in the browser where MetaMask is installed.");
}
