import type { Metadata } from "next";
import TestnetSandbox from "@/components/TestnetSandbox";
import { PUBLIC_SANDBOX_ADDRESS, ROBINHOOD_TESTNET } from "@/lib/testnet";

export const metadata: Metadata = {
  title: "Public Testnet Sandbox | ARVYN",
  description: "Run an isolated, no-value ARVYN test execution on Robinhood Chain Testnet.",
};

const steps = [
  ["1", "Connect", "Connect MetaMask. ARVYN never receives your seed phrase or private key."],
  ["2", "Check", "The page simulates the call and checks the one-minute wallet cooldown."],
  ["3", "Confirm", "MetaMask shows the testnet network, a value of 0 ETH and the gas fee."],
  ["4", "Verify", "The confirmed execution is linked directly to the public block explorer."],
];

export default function TestnetPage() {
  return (
    <section className="pb-24 pt-[112px] md:pt-[136px]">
      <div className="shell">
        <div className="max-w-3xl">
          <p className="eyebrow text-arvyn-orange">Public testnet sandbox</p>
          <h1 className="mt-4 text-4xl font-bold tracking-[-0.04em] sm:text-5xl md:text-6xl">
            Try one guarded execution onchain.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-arvyn-muted md:text-lg">
            This sandbox records a policy-approved test action on Robinhood Chain Testnet.
            It transfers no funds, stores no deposits and has no connection to ARVYN&apos;s
            earlier transfer prototype.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <TestnetSandbox />

          <aside className="space-y-5">
            <div className="card p-5">
              <p className="eyebrow">Before you start</p>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-neutral-400">
                <li>Use a test wallet, not a wallet that holds valuable assets.</li>
                <li>Testnet ETH has no monetary value and is used only for gas.</li>
                <li>Never enter a seed phrase or private key on this website.</li>
                <li>The contract is an unaudited public testnet demonstration.</li>
              </ul>
            </div>

            <div className="card p-5">
              <p className="eyebrow">Contract</p>
              <p className="mt-3 break-all font-mono text-xs leading-relaxed text-neutral-400">
                {PUBLIC_SANDBOX_ADDRESS ?? "Address will appear after the isolated deployment."}
              </p>
              {PUBLIC_SANDBOX_ADDRESS && (
                <a
                  href={`${ROBINHOOD_TESTNET.explorerUrl}/address/${PUBLIC_SANDBOX_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex text-sm font-semibold text-white hover:text-arvyn-orange"
                >
                  View contract ↗
                </a>
              )}
            </div>
          </aside>
        </div>

        <div className="mt-16">
          <p className="eyebrow">What happens</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(([number, title, description]) => (
              <div key={number} className="card p-5">
                <span className="font-mono text-xs text-arvyn-orange">{number}</span>
                <h2 className="mt-3 text-lg font-semibold">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
