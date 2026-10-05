import {
  BrowserProvider,
  Contract,
  formatEther,
  getAddress,
  id,
  parseEther,
} from "ethers";
import registryArtifact from "../artifacts/contracts/AgentRegistry.sol/AgentRegistry.json";
import guardArtifact from "../artifacts/contracts/PolicyGuard.sol/PolicyGuard.json";
import routerArtifact from "../artifacts/contracts/ArvynRouter.sol/ArvynRouter.json";
import plan from "../deployments/robinhood-testnet.plan.json";

const expectedChainId = BigInt(plan.network.chainId);
const expectedChainHex = `0x${expectedChainId.toString(16)}`;
const operator = getAddress(plan.accounts.adminAndOperator);
const receiver = getAddress(plan.accounts.allowedReceiver);
const routerAddress = getAddress(plan.contracts.arvynRouter);
const registryAddress = getAddress(plan.contracts.agentRegistry);
const guardAddress = getAddress(plan.contracts.policyGuard);
const agentId = id(plan.policy.agentLabel);
const transferAmount = parseEther("0.0001");

const elements = {
  routerAddress: document.querySelector("#routerAddress"),
  operatorAddress: document.querySelector("#operatorAddress"),
  receiverAddress: document.querySelector("#receiverAddress"),
  remainingAllowance: document.querySelector("#remainingAllowance"),
  nextNonce: document.querySelector("#nextNonce"),
  feeEstimate: document.querySelector("#feeEstimate"),
  statusDot: document.querySelector("#statusDot"),
  statusText: document.querySelector("#statusText"),
  warning: document.querySelector("#warning"),
  connectButton: document.querySelector("#connectButton"),
  switchButton: document.querySelector("#switchButton"),
  executeButton: document.querySelector("#executeButton"),
  result: document.querySelector("#result"),
  balanceChange: document.querySelector("#balanceChange"),
  remainingAfter: document.querySelector("#remainingAfter"),
  transactionLink: document.querySelector("#transactionLink"),
};

elements.routerAddress.textContent = routerAddress;
elements.operatorAddress.textContent = operator;
elements.receiverAddress.textContent = receiver;

let provider;
let signer;
let router;
let guard;
let preparedNonce;
let preparedDeadline;
let estimatedGas;

function setStatus(text, ready = false) {
  elements.statusText.textContent = text;
  elements.statusDot.classList.toggle("ready", ready);
}

function setWarning(message = "") {
  elements.warning.textContent = message;
  elements.warning.hidden = message.length === 0;
}

function resetExecutionState() {
  preparedNonce = undefined;
  preparedDeadline = undefined;
  estimatedGas = undefined;
  elements.executeButton.disabled = true;
  elements.remainingAllowance.textContent = "Connect the wallet to verify";
  elements.nextNonce.textContent = "Connect the wallet to verify";
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

async function prepareExecution() {
  const registry = new Contract(registryAddress, registryArtifact.abi, provider);
  guard = new Contract(guardAddress, guardArtifact.abi, provider);
  router = new Contract(routerAddress, routerArtifact.abi, signer);

  const [agent, policy, remaining, nonce, routerPaused, guardPaused, routerRegistry, routerGuard] =
    await Promise.all([
      registry.getAgent(agentId),
      guard.getPolicy(agentId),
      guard.remainingToday(agentId),
      router.nonces(operator),
      router.paused(),
      guard.paused(),
      router.agentRegistry(),
      router.policyGuard(),
    ]);

  if (getAddress(agent.operator) !== operator || !agent.active) {
    throw new Error("The registered agent operator or active status does not match the manifest");
  }
  if (getAddress(policy.receiver) !== receiver || !policy.active) {
    throw new Error("The deployed receiver or policy status does not match the manifest");
  }
  if (getAddress(routerRegistry) !== registryAddress || getAddress(routerGuard) !== guardAddress) {
    throw new Error("The deployed Router links do not match the manifest");
  }
  if (routerPaused || guardPaused) {
    throw new Error("Execution is paused onchain");
  }
  if (remaining < transferAmount) {
    throw new Error("The remaining daily allowance is too low for the test transfer");
  }

  const block = await provider.getBlock("latest");
  preparedNonce = nonce;
  preparedDeadline = BigInt(block.timestamp + 600);

  await router.executeTransfer.staticCall(
    agentId,
    receiver,
    preparedNonce,
    preparedDeadline,
    { value: transferAmount },
  );
  estimatedGas = await router.executeTransfer.estimateGas(
    agentId,
    receiver,
    preparedNonce,
    preparedDeadline,
    { value: transferAmount },
  );

  const feeData = await provider.getFeeData();
  const gasPrice = feeData.maxFeePerGas ?? feeData.gasPrice;
  elements.remainingAllowance.textContent = `${formatEther(remaining)} testnet ETH`;
  elements.nextNonce.textContent = preparedNonce.toString();
  elements.feeEstimate.textContent = gasPrice
    ? `up to ${formatEther(estimatedGas * gasPrice)} testnet ETH`
    : `${estimatedGas.toString()} gas units`;
  elements.executeButton.disabled = false;
}

async function refreshWallet() {
  resetExecutionState();
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
    setWarning("Switch MetaMask to Robinhood Chain Testnet before execution.");
    elements.switchButton.hidden = false;
    return;
  }

  elements.switchButton.hidden = true;
  if (connectedAddress !== operator) {
    setStatus("Wrong MetaMask account");
    setWarning(`Select the ARVYN Deployer account ending in ${operator.slice(-6)}.`);
    return;
  }

  const balance = await provider.getBalance(connectedAddress);
  if (balance <= transferAmount) {
    setStatus("Insufficient testnet ETH");
    setWarning("The Deployer balance is too low for the transfer and network fee.");
    return;
  }

  setStatus(`Verifying policy · ${formatEther(balance)} testnet ETH`, true);
  try {
    await prepareExecution();
    setStatus(`Ready · ${formatEther(balance)} testnet ETH`, true);
  } catch (error) {
    setStatus("Execution preparation failed");
    setWarning(error?.shortMessage ?? error?.message ?? "Unable to prepare execution");
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

async function requestExecution() {
  elements.executeButton.disabled = true;
  elements.executeButton.textContent = "Waiting for MetaMask";
  setWarning("MetaMask is open. Confirm only if it shows Robinhood Chain Testnet and a value of 0.0001 ETH.");

  try {
    const balanceBefore = await provider.getBalance(receiver);
    const transaction = await router.executeTransfer(
      agentId,
      receiver,
      preparedNonce,
      preparedDeadline,
      {
        value: transferAmount,
        gasLimit: (estimatedGas * 120n) / 100n,
      },
    );

    setStatus("Transaction submitted. Waiting for confirmation", true);
    elements.executeButton.textContent = "Waiting for confirmation";
    const receipt = await transaction.wait();
    const balanceAfter = await provider.getBalance(receiver);
    const remaining = await guard.remainingToday(agentId);

    elements.balanceChange.textContent = `${formatEther(balanceAfter - balanceBefore)} testnet ETH`;
    elements.remainingAfter.textContent = `${formatEther(remaining)} testnet ETH`;
    elements.transactionLink.href = `${plan.network.explorer}/tx/${receipt.hash}`;
    elements.result.hidden = false;
    elements.result.scrollIntoView({ behavior: "smooth", block: "start" });
    setWarning();
    setStatus("Execution confirmed", true);
    elements.executeButton.textContent = "Execution complete";
  } catch (error) {
    const message = error?.shortMessage ?? error?.message ?? "Execution failed";
    setWarning(message);
    setStatus("Execution not completed");
    elements.executeButton.textContent = "Request test transfer";
    elements.executeButton.disabled = false;
  }
}

elements.connectButton.addEventListener("click", connectWallet);
elements.switchButton.addEventListener("click", switchNetwork);
elements.executeButton.addEventListener("click", requestExecution);

if (window.ethereum) {
  window.ethereum.on("accountsChanged", refreshWallet);
  window.ethereum.on("chainChanged", refreshWallet);
  await refreshWallet();
} else {
  setWarning("MetaMask was not detected. Open this local page in the browser where MetaMask is installed.");
}
