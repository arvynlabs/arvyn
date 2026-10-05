// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

/// @title PolicyGuard
/// @notice Enforces a fixed receiver, per-transaction limit and daily limit.
contract PolicyGuard is Ownable, Pausable {
    struct Policy {
        address receiver;
        uint96 maxPerTransaction;
        uint96 dailyLimit;
        uint96 spentToday;
        uint64 dayIndex;
        bool active;
    }

    mapping(bytes32 agentId => Policy policy) private _policies;
    address public router;

    error AmountExceedsDailyLimit(uint256 requested, uint256 remaining);
    error AmountExceedsTransactionLimit(uint256 requested, uint256 limit);
    error AmountTooLarge();
    error InvalidAmount();
    error InvalidPolicyLimits();
    error InvalidReceiver();
    error InvalidRouter();
    error PolicyInactive(bytes32 agentId);
    error ReceiverNotAllowed(address receiver);
    error RouterAlreadyConfigured();
    error UnauthorizedRouter(address caller);

    event PolicyConfigured(
        bytes32 indexed agentId,
        address indexed receiver,
        uint96 maxPerTransaction,
        uint96 dailyLimit,
        bool active
    );
    event PolicyConsumed(
        bytes32 indexed agentId,
        address indexed receiver,
        uint256 amount,
        uint256 spentToday
    );
    event RouterConfigured(address indexed router);

    constructor(address initialOwner) Ownable(initialOwner) {}

    modifier onlyRouter() {
        if (msg.sender != router) revert UnauthorizedRouter(msg.sender);
        _;
    }

    function configurePolicy(
        bytes32 agentId,
        address receiver,
        uint96 maxPerTransaction,
        uint96 dailyLimit,
        bool active
    ) external onlyOwner {
        if (receiver == address(0)) revert InvalidReceiver();
        if (maxPerTransaction == 0 || dailyLimit < maxPerTransaction) {
            revert InvalidPolicyLimits();
        }

        _policies[agentId] = Policy({
            receiver: receiver,
            maxPerTransaction: maxPerTransaction,
            dailyLimit: dailyLimit,
            spentToday: 0,
            dayIndex: uint64(block.timestamp / 1 days),
            active: active
        });

        emit PolicyConfigured(agentId, receiver, maxPerTransaction, dailyLimit, active);
    }

    /// @notice Connects the execution router once. It cannot be silently replaced later.
    function configureRouter(address newRouter) external onlyOwner {
        if (newRouter == address(0)) revert InvalidRouter();
        if (router != address(0)) revert RouterAlreadyConfigured();
        router = newRouter;
        emit RouterConfigured(newRouter);
    }

    function validateAndConsume(
        bytes32 agentId,
        address receiver,
        uint256 amount
    ) external onlyRouter whenNotPaused {
        Policy storage policy = _policies[agentId];
        if (!policy.active) revert PolicyInactive(agentId);
        if (receiver != policy.receiver) revert ReceiverNotAllowed(receiver);
        if (amount == 0) revert InvalidAmount();
        if (amount > type(uint96).max) revert AmountTooLarge();
        if (amount > policy.maxPerTransaction) {
            revert AmountExceedsTransactionLimit(amount, policy.maxPerTransaction);
        }

        uint64 today = uint64(block.timestamp / 1 days);
        uint256 spent = today == policy.dayIndex ? policy.spentToday : 0;
        uint256 remaining = uint256(policy.dailyLimit) - spent;
        if (amount > remaining) revert AmountExceedsDailyLimit(amount, remaining);

        uint256 updatedSpent = spent + amount;
        policy.dayIndex = today;
        policy.spentToday = uint96(updatedSpent);
        emit PolicyConsumed(agentId, receiver, amount, updatedSpent);
    }

    function getPolicy(bytes32 agentId) external view returns (Policy memory) {
        return _policies[agentId];
    }

    function remainingToday(bytes32 agentId) external view returns (uint256) {
        Policy storage policy = _policies[agentId];
        uint64 today = uint64(block.timestamp / 1 days);
        if (today != policy.dayIndex) return policy.dailyLimit;
        return uint256(policy.dailyLimit) - policy.spentToday;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
