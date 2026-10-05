import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("ARVYN policy-limited execution", function () {
  const AGENT_ID = ethers.id("ARVYN_TEST_AGENT_V1");
  const MAX_PER_TRANSACTION = ethers.parseEther("0.001");
  const DAILY_LIMIT = ethers.parseEther("0.003");

  async function deployFixture() {
    const [admin, receiver, stranger] = await ethers.getSigners();

    const registry = await ethers.deployContract("AgentRegistry", [admin.address]);
    const guard = await ethers.deployContract("PolicyGuard", [admin.address]);
    await registry.waitForDeployment();
    await guard.waitForDeployment();

    const router = await ethers.deployContract("ArvynRouter", [
      admin.address,
      await registry.getAddress(),
      await guard.getAddress(),
    ]);
    await router.waitForDeployment();

    await guard.configureRouter(await router.getAddress());
    await registry.registerAgent(AGENT_ID, admin.address);
    await guard.configurePolicy(
      AGENT_ID,
      receiver.address,
      MAX_PER_TRANSACTION,
      DAILY_LIMIT,
      true,
    );

    return { admin, receiver, stranger, registry, guard, router };
  }

  async function futureDeadline() {
    const block = await ethers.provider.getBlock("latest");
    return BigInt(block.timestamp + 3600);
  }

  it("executes an allowed transfer and records usage", async function () {
    const { admin, receiver, guard, router } = await deployFixture();
    const amount = ethers.parseEther("0.0005");

    await expect(
      router.executeTransfer(AGENT_ID, receiver.address, 0, await futureDeadline(), {
        value: amount,
      }),
    )
      .to.emit(router, "TransferExecuted")
      .withArgs(AGENT_ID, admin.address, receiver.address, amount, 0);

    expect(await router.nonces(admin.address)).to.equal(1);
    expect(await guard.remainingToday(AGENT_ID)).to.equal(DAILY_LIMIT - amount);
  });

  it("rejects a receiver that is not allowlisted", async function () {
    const { stranger, guard, router } = await deployFixture();

    await expect(
      router.executeTransfer(AGENT_ID, stranger.address, 0, await futureDeadline(), {
        value: ethers.parseEther("0.0005"),
      }),
    ).to.be.revertedWithCustomError(guard, "ReceiverNotAllowed");
  });

  it("rejects a transfer over the per-transaction limit", async function () {
    const { receiver, guard, router } = await deployFixture();

    await expect(
      router.executeTransfer(AGENT_ID, receiver.address, 0, await futureDeadline(), {
        value: ethers.parseEther("0.0011"),
      }),
    ).to.be.revertedWithCustomError(guard, "AmountExceedsTransactionLimit");
  });

  it("enforces the cumulative daily limit", async function () {
    const { receiver, guard, router } = await deployFixture();
    const deadline = await futureDeadline();

    for (let nonce = 0; nonce < 3; nonce += 1) {
      await router.executeTransfer(AGENT_ID, receiver.address, nonce, deadline, {
        value: MAX_PER_TRANSACTION,
      });
    }

    await expect(
      router.executeTransfer(AGENT_ID, receiver.address, 3, deadline, {
        value: 1,
      }),
    ).to.be.revertedWithCustomError(guard, "AmountExceedsDailyLimit");
  });

  it("rejects an expired instruction and a reused nonce", async function () {
    const { receiver, router } = await deployFixture();
    const block = await ethers.provider.getBlock("latest");

    await expect(
      router.executeTransfer(AGENT_ID, receiver.address, 0, block.timestamp - 1, {
        value: 1,
      }),
    ).to.be.revertedWithCustomError(router, "DeadlineExpired");

    await router.executeTransfer(AGENT_ID, receiver.address, 0, await futureDeadline(), {
      value: 1,
    });

    await expect(
      router.executeTransfer(AGENT_ID, receiver.address, 0, await futureDeadline(), {
        value: 1,
      }),
    ).to.be.revertedWithCustomError(router, "NonceMismatch");
  });

  it("rejects inactive agents and callers that do not own the agent", async function () {
    const { receiver, stranger, registry, router } = await deployFixture();

    await expect(
      router.connect(stranger).executeTransfer(AGENT_ID, receiver.address, 0, await futureDeadline(), {
        value: 1,
      }),
    ).to.be.revertedWithCustomError(router, "UnauthorizedOperator");

    await registry.setAgentActive(AGENT_ID, false);
    await expect(
      router.executeTransfer(AGENT_ID, receiver.address, 0, await futureDeadline(), {
        value: 1,
      }),
    ).to.be.revertedWithCustomError(router, "AgentInactive");
  });

  it("can stop execution immediately", async function () {
    const { receiver, guard, router } = await deployFixture();

    await router.pause();
    await expect(
      router.executeTransfer(AGENT_ID, receiver.address, 0, await futureDeadline(), {
        value: 1,
      }),
    ).to.be.revertedWithCustomError(router, "EnforcedPause");

    await router.unpause();
    await guard.pause();
    await expect(
      router.executeTransfer(AGENT_ID, receiver.address, 0, await futureDeadline(), {
        value: 1,
      }),
    ).to.be.revertedWithCustomError(guard, "EnforcedPause");
  });

  it("rejects direct deposits so funds are not left in the router", async function () {
    const { admin, router } = await deployFixture();

    await expect(
      admin.sendTransaction({
        to: await router.getAddress(),
        value: 1,
      }),
    ).to.be.revertedWithCustomError(router, "TransferFailed");
  });

  it("bootstraps the configured system atomically and gives up control", async function () {
    const [admin, receiver] = await ethers.getSigners();
    const bootstrap = await ethers.deployContract("ArvynTestnetBootstrap", [
      admin.address,
      receiver.address,
      MAX_PER_TRANSACTION,
      DAILY_LIMIT,
    ]);
    await bootstrap.waitForDeployment();

    const registry = await ethers.getContractAt(
      "AgentRegistry",
      await bootstrap.agentRegistry(),
    );
    const guard = await ethers.getContractAt("PolicyGuard", await bootstrap.policyGuard());
    const router = await ethers.getContractAt("ArvynRouter", await bootstrap.arvynRouter());
    const [operator, active] = await registry.getAgent(AGENT_ID);
    const policy = await guard.getPolicy(AGENT_ID);

    expect(await registry.owner()).to.equal(admin.address);
    expect(await guard.owner()).to.equal(admin.address);
    expect(await router.owner()).to.equal(admin.address);
    expect(operator).to.equal(admin.address);
    expect(active).to.equal(true);
    expect(policy.receiver).to.equal(receiver.address);
    expect(policy.maxPerTransaction).to.equal(MAX_PER_TRANSACTION);
    expect(policy.dailyLimit).to.equal(DAILY_LIMIT);
    expect(await guard.router()).to.equal(await router.getAddress());
  });
});
