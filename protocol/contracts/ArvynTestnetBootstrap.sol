// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {AgentRegistry} from "./AgentRegistry.sol";
import {PolicyGuard} from "./PolicyGuard.sol";
import {ArvynRouter} from "./ArvynRouter.sol";

/// @title ArvynTestnetBootstrap
/// @notice Atomically deploys and configures the first ARVYN testnet prototype.
/// @dev The bootstrap gives up ownership before construction completes.
contract ArvynTestnetBootstrap {
    bytes32 public constant AGENT_ID = keccak256("ARVYN_TEST_AGENT_V1");

    AgentRegistry public immutable agentRegistry;
    PolicyGuard public immutable policyGuard;
    ArvynRouter public immutable arvynRouter;

    error InvalidAdmin();
    error InvalidReceiver();

    event TestnetSystemDeployed(
        address indexed admin,
        address indexed receiver,
        address agentRegistry,
        address policyGuard,
        address arvynRouter,
        bytes32 agentId,
        uint96 maxPerTransaction,
        uint96 dailyLimit
    );

    constructor(
        address admin,
        address receiver,
        uint96 maxPerTransaction,
        uint96 dailyLimit
    ) {
        if (admin == address(0)) revert InvalidAdmin();
        if (receiver == address(0)) revert InvalidReceiver();

        AgentRegistry registry = new AgentRegistry(address(this));
        PolicyGuard guard = new PolicyGuard(address(this));
        ArvynRouter router = new ArvynRouter(admin, address(registry), address(guard));

        guard.configureRouter(address(router));
        registry.registerAgent(AGENT_ID, admin);
        guard.configurePolicy(AGENT_ID, receiver, maxPerTransaction, dailyLimit, true);

        registry.transferOwnership(admin);
        guard.transferOwnership(admin);

        agentRegistry = registry;
        policyGuard = guard;
        arvynRouter = router;

        emit TestnetSystemDeployed(
            admin,
            receiver,
            address(registry),
            address(guard),
            address(router),
            AGENT_ID,
            maxPerTransaction,
            dailyLimit
        );
    }
}
