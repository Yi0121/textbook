/**
 * Agent Types Re-export
 * 
 * Re-exports agent types from the agents module for convenience.
 * This allows imports from '../types' to include agent types.
 */

export {
    type AgentCategory,
    type AgentId,
    type ToolInput,
    type ToolOutput,
    type AgentTool,
    type AgentContext,
    type AgentRequest,
    type AgentResponse,
    type IAgent,
    type AgentRegistration,
    type OrchestratorRequest,
    type OrchestratorResponse,
    type UIAgentCategory,
    type UIAgent,
    type Agent,
    AVAILABLE_AGENTS,
    findAgentById,
} from '../agents/types';
