// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title AgentRegistry
/// @notice Stores the operator and active status for each ARVYN agent.
contract AgentRegistry is Ownable {
    struct Agent {
        address operator;
        bool active;
    }

    mapping(bytes32 agentId => Agent agent) private _agents;

    error AgentAlreadyRegistered(bytes32 agentId);
    error AgentNotRegistered(bytes32 agentId);
    error InvalidAgentId();
    error InvalidOperator();

    event AgentRegistered(bytes32 indexed agentId, address indexed operator);
    event AgentOperatorUpdated(
        bytes32 indexed agentId,
        address indexed previousOperator,
        address indexed newOperator
    );
    event AgentStatusUpdated(bytes32 indexed agentId, bool active);

    constructor(address initialOwner) Ownable(initialOwner) {}

    function registerAgent(bytes32 agentId, address operator) external onlyOwner {
        if (agentId == bytes32(0)) revert InvalidAgentId();
        if (operator == address(0)) revert InvalidOperator();
        if (_agents[agentId].operator != address(0)) {
            revert AgentAlreadyRegistered(agentId);
        }

        _agents[agentId] = Agent({operator: operator, active: true});
        emit AgentRegistered(agentId, operator);
        emit AgentStatusUpdated(agentId, true);
    }

    function setAgentOperator(bytes32 agentId, address newOperator) external onlyOwner {
        Agent storage agent = _registeredAgent(agentId);
        if (newOperator == address(0)) revert InvalidOperator();

        address previousOperator = agent.operator;
        agent.operator = newOperator;
        emit AgentOperatorUpdated(agentId, previousOperator, newOperator);
    }

    function setAgentActive(bytes32 agentId, bool active) external onlyOwner {
        Agent storage agent = _registeredAgent(agentId);
        agent.active = active;
        emit AgentStatusUpdated(agentId, active);
    }

    function getAgent(bytes32 agentId) external view returns (address operator, bool active) {
        Agent storage agent = _agents[agentId];
        return (agent.operator, agent.active);
    }

    function _registeredAgent(bytes32 agentId) private view returns (Agent storage agent) {
        agent = _agents[agentId];
        if (agent.operator == address(0)) revert AgentNotRegistered(agentId);
    }
}
