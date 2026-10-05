// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IAgentRegistry {
    function getAgent(bytes32 agentId) external view returns (address operator, bool active);
}

interface IPolicyGuard {
    function validateAndConsume(bytes32 agentId, address receiver, uint256 amount) external;
}

/// @title ArvynRouter
/// @notice Executes a policy-approved native ETH transfer without taking custody.
contract ArvynRouter is Ownable, Pausable, ReentrancyGuard {
    IAgentRegistry public immutable agentRegistry;
    IPolicyGuard public immutable policyGuard;

    mapping(address operator => uint256 nextNonce) public nonces;

    error AgentInactive(bytes32 agentId);
    error DeadlineExpired(uint256 deadline, uint256 currentTimestamp);
    error InvalidRegistry();
    error InvalidPolicyGuard();
    error InvalidReceiver();
    error NonceMismatch(uint256 expected, uint256 provided);
    error TransferFailed();
    error UnauthorizedOperator(address caller, address expectedOperator);
    error ZeroValue();

    event TransferExecuted(
        bytes32 indexed agentId,
        address indexed operator,
        address indexed receiver,
        uint256 amount,
        uint256 nonce
    );

    constructor(address initialOwner, address registryAddress, address policyGuardAddress)
        Ownable(initialOwner)
    {
        if (registryAddress == address(0)) revert InvalidRegistry();
        if (policyGuardAddress == address(0)) revert InvalidPolicyGuard();
        agentRegistry = IAgentRegistry(registryAddress);
        policyGuard = IPolicyGuard(policyGuardAddress);
    }

    function executeTransfer(
        bytes32 agentId,
        address payable receiver,
        uint256 nonce,
        uint256 deadline
    ) external payable whenNotPaused nonReentrant {
        if (receiver == address(0)) revert InvalidReceiver();
        if (msg.value == 0) revert ZeroValue();
        if (block.timestamp > deadline) {
            revert DeadlineExpired(deadline, block.timestamp);
        }

        uint256 expectedNonce = nonces[msg.sender];
        if (nonce != expectedNonce) revert NonceMismatch(expectedNonce, nonce);

        (address operator, bool active) = agentRegistry.getAgent(agentId);
        if (!active) revert AgentInactive(agentId);
        if (operator != msg.sender) revert UnauthorizedOperator(msg.sender, operator);

        nonces[msg.sender] = expectedNonce + 1;
        policyGuard.validateAndConsume(agentId, receiver, msg.value);

        (bool success, ) = receiver.call{value: msg.value}("");
        if (!success) revert TransferFailed();

        emit TransferExecuted(agentId, msg.sender, receiver, msg.value, expectedNonce);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    receive() external payable {
        revert TransferFailed();
    }

    fallback() external payable {
        revert TransferFailed();
    }
}
