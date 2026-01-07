/**
 * 學生模組 Agents 入口
 *
 * 包含 9 個 Agent
 */

export { ScaffoldingAgent, scaffoldingAgent } from './ScaffoldingAgent';
export { GraderAgent, graderAgent } from './GraderAgent';
export { LearningObserverAgent, learningObserverAgent } from './LearningObserverAgent';
export { PeerFacilitatorAgent, peerFacilitatorAgent } from './PeerFacilitatorAgent';
export { RealtimeHintAgent, realtimeHintAgent } from './RealtimeHintAgent';
export { SRLAgent, srlAgent } from './SRLAgent';
export { APOSConstructionAgent, aposConstructionAgent } from './APOSConstructionAgent';
export { TechnicalSupportAgent, technicalSupportAgent } from './TechnicalSupportAgent';
export { CPSAgent, cpsAgent } from './CPSAgent';

import { scaffoldingAgent } from './ScaffoldingAgent';
import { graderAgent } from './GraderAgent';
import { learningObserverAgent } from './LearningObserverAgent';
import { peerFacilitatorAgent } from './PeerFacilitatorAgent';
import { realtimeHintAgent } from './RealtimeHintAgent';
import { srlAgent } from './SRLAgent';
import { aposConstructionAgent } from './APOSConstructionAgent';
import { technicalSupportAgent } from './TechnicalSupportAgent';
import { cpsAgent } from './CPSAgent';

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
    aposConstructionAgent,
    technicalSupportAgent,
    cpsAgent,
];
