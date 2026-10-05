"use client";

import { useCallback, useEffect, useState } from "react";
import { BrowserProvider, Contract, formatEther } from "ethers";
import {
  PUBLIC_SANDBOX_ABI,
  PUBLIC_SANDBOX_ADDRESS,
  ROBINHOOD_TESTNET,
} from "@/lib/testnet";

type WalletProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, listener: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, listener: (...args: unknown[]) => void) => void;
};

declare global {
  interface Window {
    ethereum?: WalletProvider;
  }
}

type Status = {
  deployed: boolean;
  address?: string;
  blockNumber?: number;
  totalExecutions?: string;
  cooldown?: number;
  policyId?: string;
  wallet?: {
    address: string;
    nextNonce: string;
    cooldownRemaining: number;
    allowed: boolean;
  } | null;
  error?: string;
};

function errorMessage(error: unknown) {
  if (typeof error === "object" && error !== null) {
    const value = error as { shortMessage?: string; message?: string; code?: number };
    if (value.code === 4001) return "The request was declined in MetaMask.";
    return value.shortMessage ?? value.message ?? "The request could not be completed.";
  }
  return "The request could not be completed.";
}

export default function TestnetSandbox() {
  const [status, setStatus] = useState<Status>({ deployed: Boolean(PUBLIC_SANDBOX_ADDRESS) });
  const [account, setAccount] = useState<string>();
  const [balance, setBalance] = useState<string>();
  const [chainId, setChainId] = useState<bigint>();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("Reading the testnet state…");
  const [transactionHash, setTransactionHash] = useState<string>();

  const readStatus = useCallback(async (walletAddress?: string) => {
    const query = walletAddress ? `?address=${encodeURIComponent(walletAddress)}` : "";
    try {
      const response = await fetch(`/api/testnet/status${query}`, { cache: "no-store" });
      const data = (await response.json()) as Status;
      setStatus(data);
      if (!data.deployed) {
        setMessage("The public sandbox is waiting for deployment.");
      } else if (data.error) {
        setMessage(data.error);
      } else if (walletAddress && data.wallet) {
        setMessage(data.wallet.allowed
          ? "Policy check passed. This wallet can run a test execution."
          : `Wait ${data.wallet.cooldownRemaining}s before running another test.`);
      } else {
        setMessage("The contract is live. Connect MetaMask to test it.");
      }
    } catch {
      setMessage("The testnet state is unavailable. Try refreshing the page.");
    }
  }, []);

  const readWallet = useCallback(async (requestAccess = false) => {
    if (!window.ethereum) {
      setMessage("MetaMask was not detected. Open this page in a browser with MetaMask installed.");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      if (requestAccess) await provider.send("eth_requestAccounts", []);
      const accounts = await provider.send("eth_accounts", []);
      const network = await provider.getNetwork();
      setChainId(network.chainId);

      if (accounts.length === 0) {
        setAccount(undefined);
        setBalance(undefined);
        await readStatus();
        return;
      }

      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const walletBalance = await provider.getBalance(address);
      setAccount(address);
      setBalance(formatEther(walletBalance));
      await readStatus(address);
    } catch (error) {
      setMessage(errorMessage(error));
    }
  }, [readStatus]);

  useEffect(() => {
    void readStatus();
    if (!window.ethereum) return;

    void readWallet();
    const refresh = () => void readWallet();
    window.ethereum.on?.("accountsChanged", refresh);
    window.ethereum.on?.("chainChanged", refresh);
    return () => {
      window.ethereum?.removeListener?.("accountsChanged", refresh);
      window.ethereum?.removeListener?.("chainChanged", refresh);
    };
  }, [readStatus, readWallet]);

  async function switchNetwork() {
    if (!window.ethereum) return;
    setBusy(true);
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ROBINHOOD_TESTNET.chainIdHex }],
      });
      await readWallet();
    } catch (error) {
      const value = error as { code?: number };
      if (value.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: ROBINHOOD_TESTNET.chainIdHex,
              chainName: ROBINHOOD_TESTNET.name,
              nativeCurrency: ROBINHOOD_TESTNET.nativeCurrency,
              rpcUrls: [ROBINHOOD_TESTNET.rpcUrl],
              blockExplorerUrls: [ROBINHOOD_TESTNET.explorerUrl],
            }],
          });
          await readWallet();
        } catch (addError) {
          setMessage(errorMessage(addError));
        }
      } else {
        setMessage(errorMessage(error));
      }
    } finally {
      setBusy(false);
    }
  }

  async function executeTest() {
    if (!window.ethereum || !PUBLIC_SANDBOX_ADDRESS || !account) return;
    setBusy(true);
    setTransactionHash(undefined);
    setMessage("Simulating the call before opening MetaMask…");

    try {
      const provider = new BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      if (network.chainId !== BigInt(ROBINHOOD_TESTNET.chainId)) {
        setMessage("Switch MetaMask to Robinhood Chain Testnet.");
        return;
      }

      const signer = await provider.getSigner();
      const contract = new Contract(PUBLIC_SANDBOX_ADDRESS, PUBLIC_SANDBOX_ABI, signer);
      await contract.execute.staticCall({ value: 0 });
      const estimatedGas = await contract.execute.estimateGas({ value: 0 });

      setMessage("Simulation passed. Check the network, 0 ETH value and gas fee in MetaMask.");
      const transaction = await contract.execute({
        value: 0,
        gasLimit: (estimatedGas * BigInt(120)) / BigInt(100),
      });
      setTransactionHash(transaction.hash);
      setMessage("Transaction submitted. Waiting for network confirmation…");
      await transaction.wait();
      setMessage("Confirmed. The test execution is recorded on Robinhood Chain Testnet.");
      await readWallet();
    } catch (error) {
      setMessage(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  const correctNetwork = chainId === BigInt(ROBINHOOD_TESTNET.chainId);
  const canExecute = Boolean(
    status.deployed && account && correctNetwork && status.wallet?.allowed && !busy,
  );

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-white/[0.08] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-500">Live contract</p>
          <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-white">
            <span className={`h-2 w-2 rounded-full ${status.deployed && !status.error ? "bg-emerald-400" : "bg-neutral-600"}`} />
            {status.deployed ? "Robinhood Chain Testnet" : "Deployment pending"}
          </p>
        </div>
        {status.blockNumber && (
          <span className="font-mono text-xs text-neutral-500">block #{status.blockNumber.toLocaleString("en-US")}</span>
        )}
      </div>

      <div className="grid gap-px bg-white/[0.06] sm:grid-cols-3">
        {[
          ["Public executions", status.totalExecutions ?? "0"],
          ["Cooldown", `${status.cooldown ?? 60}s / wallet`],
          ["Transfer value", "0 ETH"],
        ].map(([label, value]) => (
          <div key={label} className="bg-[#0b0b0b] p-5">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-neutral-600">{label}</p>
            <p className="mt-2 font-mono text-sm text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="p-5 md:p-6">
        <div className="rounded-xl border border-white/[0.08] bg-black/30 p-4">
          <p className="text-sm leading-relaxed text-neutral-300">{message}</p>
          {account && (
            <div className="mt-3 space-y-1 font-mono text-[11px] text-neutral-500">
              <p className="break-all">wallet: {account}</p>
              <p>balance: {Number(balance ?? 0).toFixed(5)} testnet ETH</p>
              <p>next nonce: {status.wallet?.nextNonce ?? "—"}</p>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          {!account && (
            <button className="btn-primary" disabled={busy} onClick={() => void readWallet(true)}>
              Connect MetaMask
            </button>
          )}
          {account && !correctNetwork && (
            <button className="btn-primary" disabled={busy} onClick={() => void switchNetwork()}>
              Switch network
            </button>
          )}
          {account && correctNetwork && (
            <button className="btn-primary" disabled={!canExecute} onClick={() => void executeTest()}>
              {busy ? "Waiting…" : "Run test execution"}
            </button>
          )}
          <a
            href={ROBINHOOD_TESTNET.faucetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            Get testnet ETH ↗
          </a>
        </div>

        {transactionHash && (
          <a
            href={`${ROBINHOOD_TESTNET.explorerUrl}/tx/${transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex break-all font-mono text-xs text-arvyn-orange hover:underline"
          >
            View transaction: {transactionHash} ↗
          </a>
        )}
      </div>
    </div>
  );
}
