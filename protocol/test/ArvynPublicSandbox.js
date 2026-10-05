import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("ARVYN public sandbox", function () {
  async function deployFixture() {
    const [participant, other] = await ethers.getSigners();
    const sandbox = await ethers.deployContract("ArvynPublicSandbox");
    await sandbox.waitForDeployment();
    return { participant, other, sandbox };
  }

  it("records an isolated policy-approved test action", async function () {
    const { participant, sandbox } = await deployFixture();
    const policyId = ethers.id("ARVYN_PUBLIC_SANDBOX_V1");

    await expect(sandbox.execute()).to.emit(sandbox, "SandboxExecution");

    const events = await sandbox.queryFilter(sandbox.filters.SandboxExecution());
    expect(events).to.have.length(1);
    expect(events[0].args.participant).to.equal(participant.address);
    expect(events[0].args.nonce).to.equal(0);
    expect(events[0].args.policyId).to.equal(policyId);

    expect(await sandbox.nonces(participant.address)).to.equal(1);
    expect(await sandbox.totalExecutions()).to.equal(1);
  });

  it("keeps participant nonces independent", async function () {
    const { participant, other, sandbox } = await deployFixture();

    await sandbox.execute();
    await sandbox.connect(other).execute();

    expect(await sandbox.nonces(participant.address)).to.equal(1);
    expect(await sandbox.nonces(other.address)).to.equal(1);
    expect(await sandbox.totalExecutions()).to.equal(2);
  });

  it("enforces a short per-wallet cooldown", async function () {
    const { participant, sandbox } = await deployFixture();
    await sandbox.execute();

    await expect(sandbox.execute()).to.be.revertedWithCustomError(
      sandbox,
      "CooldownActive",
    );

    const preview = await sandbox.preview(participant.address);
    expect(preview.allowed).to.equal(false);
    expect(preview.cooldownRemaining).to.be.greaterThan(0);

    await ethers.provider.send("evm_increaseTime", [60]);
    await ethers.provider.send("evm_mine", []);
    await expect(sandbox.execute()).to.emit(sandbox, "SandboxExecution");
  });

  it("rejects ETH and cannot retain user funds", async function () {
    const { participant, sandbox } = await deployFixture();

    await expect(
      sandbox.execute({ value: 1 }),
    ).to.be.revertedWithCustomError(sandbox, "ValueNotAccepted");

    await expect(
      participant.sendTransaction({ to: await sandbox.getAddress(), value: 1 }),
    ).to.be.revertedWithCustomError(sandbox, "ValueNotAccepted");

    expect(await ethers.provider.getBalance(await sandbox.getAddress())).to.equal(0);
  });
});
