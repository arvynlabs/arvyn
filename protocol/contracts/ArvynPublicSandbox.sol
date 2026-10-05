// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title ArvynPublicSandbox
/// @notice A no-value, rate-limited testnet sandbox for public ARVYN demonstrations.
/// @dev This contract is deliberately isolated from the ARVYN transfer prototype.
contract ArvynPublicSandbox {
    uint64 public constant COOLDOWN = 60;
    bytes32 public constant POLICY_ID = keccak256("ARVYN_PUBLIC_SANDBOX_V1");

    mapping(address participant => uint256 nextNonce) public nonces;
    mapping(address participant => uint64 timestamp) public lastExecutionAt;
    uint256 public totalExecutions;

    error CooldownActive(uint256 retryAfter);
    error ValueNotAccepted();

    event SandboxExecution(
        address indexed participant,
        uint256 indexed nonce,
        bytes32 indexed policyId,
        uint256 timestamp
    );

    /// @notice Records a policy-approved test action without transferring or storing funds.
    function execute() external payable {
        if (msg.value != 0) revert ValueNotAccepted();

        uint64 previousExecution = lastExecutionAt[msg.sender];
        uint256 availableAt = uint256(previousExecution) + COOLDOWN;
        if (previousExecution != 0 && block.timestamp < availableAt) {
            revert CooldownActive(availableAt);
        }

        uint256 nonce = nonces[msg.sender];
        nonces[msg.sender] = nonce + 1;
        lastExecutionAt[msg.sender] = uint64(block.timestamp);
        totalExecutions += 1;

        emit SandboxExecution(msg.sender, nonce, POLICY_ID, block.timestamp);
    }

    /// @notice Returns the current public policy result for a participant.
    function preview(address participant)
        external
        view
        returns (uint256 nextNonce, uint256 cooldownRemaining, bool allowed, uint256 total)
    {
        nextNonce = nonces[participant];
        uint64 previousExecution = lastExecutionAt[participant];
        uint256 availableAt = uint256(previousExecution) + COOLDOWN;
        cooldownRemaining = previousExecution != 0 && block.timestamp < availableAt
            ? availableAt - block.timestamp
            : 0;
        allowed = cooldownRemaining == 0;
        total = totalExecutions;
    }

    receive() external payable {
        revert ValueNotAccepted();
    }

    fallback() external payable {
        revert ValueNotAccepted();
    }
}
