/**
 * 學生模組 Agents 入口
 * 
 * 包含 6 個 Agent
 */

export { ScaffoldingAgent, scaffoldingAgent } from './ScaffoldingAgent';
export { GraderAgent, graderAgent } from './GraderAgent';
export { LearningObserverAgent, learningObserverAgent } from './LearningObserverAgent';
export { PeerFacilitatorAgent, peerFacilitatorAgent } from './PeerFacilitatorAgent';
export { RealtimeHintAgent, realtimeHintAgent } from './RealtimeHintAgent';
export { SRLAgent, srlAgent } from './SRLAgent';

import { scaffoldingAgent } from './ScaffoldingAgent';
import { graderAgent } from './GraderAgent';
import { learningObserverAgent } from './LearningObserverAgent';
import { peerFacilitatorAgent } from './PeerFacilitatorAgent';
import { realtimeHintAgent } from './RealtimeHintAgent';
import { srlAgent } from './SRLAgent';

/**
 * 所有學生模組 Agents
 */
export const studentAgents = [
    scaffoldingAgent,
    graderAgent,
    learningObserverAgent,
    peerFacilitatorAgent,
    realtimeHintAgent,
    srlAgent,
];
