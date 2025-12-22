/**
 * 分析模組 Agents 入口
 * 
 * 包含 8 個 Agent：
 * - 第一層: DataSteward
 * - 第二層: SNA, ENA, SRL, Process, MathProblem Analysts
 * - 綜合層: Synthesis
 * - 第三層: Dashboard
 */

// Data Steward
export { DataStewardAgent, dataStewardAgent } from './DataStewardAgent';

// Analyst Agents
export {
    SNAAnalystAgent, snaAnalystAgent,
    ENAAnalystAgent, enaAnalystAgent,
    SRLAnalystAgent, srlAnalystAgent,
    ProcessAnalystAgent, processAnalystAgent,
    MathProblemAnalystAgent, mathProblemAnalystAgent,
} from './AnalystAgents';

// Synthesis
export { SynthesisAgent, synthesisAgent } from './SynthesisAgent';

// Dashboard
export { DashboardAgent, dashboardAgent } from './DashboardAgent';

// Import instances
import { dataStewardAgent } from './DataStewardAgent';
import {
    snaAnalystAgent,
    enaAnalystAgent,
    srlAnalystAgent,
    processAnalystAgent,
    mathProblemAnalystAgent,
} from './AnalystAgents';
import { synthesisAgent } from './SynthesisAgent';
import { dashboardAgent } from './DashboardAgent';

/**
 * 所有分析模組 Agents
 */
export const analyticsAgents = [
    dataStewardAgent,
    snaAnalystAgent,
    enaAnalystAgent,
    srlAnalystAgent,
    processAnalystAgent,
    mathProblemAnalystAgent,
    synthesisAgent,
    dashboardAgent,
];
