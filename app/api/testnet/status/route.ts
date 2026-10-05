import { Contract, JsonRpcProvider, getAddress, isAddress } from "ethers";
import {
  PUBLIC_SANDBOX_ABI,
  PUBLIC_SANDBOX_ADDRESS,
  ROBINHOOD_TESTNET,
} from "@/lib/testnet";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!PUBLIC_SANDBOX_ADDRESS) {
    return Response.json({ deployed: false });
  }

  const provider = new JsonRpcProvider(
    ROBINHOOD_TESTNET.rpcUrl,
    ROBINHOOD_TESTNET.chainId,
    { staticNetwork: true },
  );
  const contract = new Contract(PUBLIC_SANDBOX_ADDRESS, PUBLIC_SANDBOX_ABI, provider);
  const url = new URL(request.url);
  const participant = url.searchParams.get("address");

  try {
    const [code, blockNumber, totalExecutions, cooldown, policyId] = await Promise.all([
      provider.getCode(PUBLIC_SANDBOX_ADDRESS),
      provider.getBlockNumber(),
      contract.totalExecutions(),
      contract.COOLDOWN(),
      contract.POLICY_ID(),
    ]);

    if (code === "0x") {
      return Response.json(
        { deployed: false, error: "Sandbox bytecode was not found" },
        { status: 503 },
      );
    }

    let wallet = null;
    if (participant && isAddress(participant)) {
      const address = getAddress(participant);
      const preview = await contract.preview(address);
      wallet = {
        address,
        nextNonce: preview.nextNonce.toString(),
        cooldownRemaining: Number(preview.cooldownRemaining),
        allowed: preview.allowed,
      };
    }

    return Response.json({
      deployed: true,
      address: PUBLIC_SANDBOX_ADDRESS,
      blockNumber,
      totalExecutions: totalExecutions.toString(),
      cooldown: Number(cooldown),
      policyId,
      wallet,
    });
  } catch {
    return Response.json(
      { deployed: true, address: PUBLIC_SANDBOX_ADDRESS, error: "Testnet RPC is temporarily unavailable" },
      { status: 503 },
    );
  }
}
