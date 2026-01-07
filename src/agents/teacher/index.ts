/**
 * 教師模組 Agents 入口
 *
 * 包含 4 個 Agent
 */

export { LessonPlannerAgent, lessonPlannerAgent } from './LessonPlannerAgent';
export { ContentGeneratorAgent, contentGeneratorAgent } from './ContentGeneratorAgent';
export { GroupingAgent, groupingAgent } from './GroupingAgent';
export { MathFlexibleThinkingAgent, mathFlexibleThinkingAgent } from './MathFlexibleThinkingAgent';

import { lessonPlannerAgent } from './LessonPlannerAgent';
import { contentGeneratorAgent } from './ContentGeneratorAgent';
import { groupingAgent } from './GroupingAgent';
import { mathFlexibleThinkingAgent } from './MathFlexibleThinkingAgent';

/**
 * 所有教師模組 Agents
 */
export const teacherAgents = [
    lessonPlannerAgent,
    contentGeneratorAgent,
    groupingAgent,
    mathFlexibleThinkingAgent,
];
