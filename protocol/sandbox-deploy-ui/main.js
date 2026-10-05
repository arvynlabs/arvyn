import {
  BrowserProvider,
  ContractFactory,
  formatEther,
  getAddress,
} from "ethers";
import artifact from "../artifacts/contracts/ArvynPublicSandbox.sol/ArvynPublicSandbox.json";
import plan from "../deployments/robinhood-testnet.plan.json";

const expectedChainId = BigInt(plan.network.chainId);
const expectedChainHex = `0x${expectedChainId.toString(16)}`;
const expectedDeployer = getAddress(plan.accounts.adminAndOperator);

const elements = {
  deployerAddress: document.querySelector("#deployerAddress"),
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

elements.deployerAddress.textContent = expectedDeployer;

let provider;
let signer;
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
  const transaction = await factory.getDeployTransaction();
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
    signer = undefined;
    setStatus("Wallet not connected");
    elements.connectButton.hidden = false;
    elements.switchButton.hidden = true;
    return;
  }

  signer = await provider.getSigner();
  const connectedAddress = getAddress(await signer.getAddress());
  const network = await provider.getNetwork();
  elements.connectButton.hidden = true;

  if (network.chainId !== expectedChainId) {
    setStatus(`Wrong network: ${network.chainId}`);
    setWarning("Switch MetaMask to Robinhood Chain Testnet before deployment.");
    elements.switchButton.hidden = false;
    return;
  }

  elements.switchButton.hidden = true;
  if (connectedAddress !== expectedDeployer) {
    setStatus("Wrong MetaMask account");
    setWarning(`Select the ARVYN Deployer account ending in ${expectedDeployer.slice(-6)}.`);
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
    setWarning("MetaMask was not detected. Open this page in the browser where MetaMask is installed.");
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

async function requestDeployment() {
  elements.deployButton.disabled = true;
  elements.deployButton.textContent = "Waiting for MetaMask";
  setWarning("Confirm only if MetaMask shows Robinhood Chain Testnet and a value of 0 ETH.");

  try {
    const factory = new ContractFactory(artifact.abi, artifact.bytecode, signer);
    const sandbox = await factory.deploy({ gasLimit: (estimatedGas * 120n) / 100n });
    const transaction = sandbox.deploymentTransaction();
    setStatus("Transaction submitted. Waiting for confirmation", true);
    elements.deployButton.textContent = "Waiting for confirmation";
    const receipt = await transaction.wait();
    const address = await sandbox.getAddress();
    const explorer = plan.network.explorer;

    elements.contractList.innerHTML = `
      <div><span>ArvynPublicSandbox</span><a href="${explorer}/address/${address}" target="_blank" rel="noopener noreferrer">${address}</a></div>
      <div><span>Deployment transaction</span><a href="${explorer}/tx/${receipt.hash}" target="_blank" rel="noopener noreferrer">${receipt.hash}</a></div>
    `;
    elements.transactionLink.href = `${explorer}/tx/${receipt.hash}`;
    elements.result.hidden = false;
    elements.result.scrollIntoView({ behavior: "smooth", block: "start" });
    setWarning();
    setStatus("Sandbox deployment confirmed", true);
    elements.deployButton.textContent = "Deployment complete";
  } catch (error) {
    setWarning(error?.shortMessage ?? error?.message ?? "Deployment failed");
    setStatus("Deployment not completed");
    elements.deployButton.textContent = "Request sandbox deployment";
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
  setWarning("MetaMask was not detected. Open this page in the browser where MetaMask is installed.");
}
