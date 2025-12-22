/**
 * 教師模組 Agents 入口
 */

export { LessonPlannerAgent, lessonPlannerAgent } from './LessonPlannerAgent';
export { ContentGeneratorAgent, contentGeneratorAgent } from './ContentGeneratorAgent';
export { GroupingAgent, groupingAgent } from './GroupingAgent';

import { lessonPlannerAgent } from './LessonPlannerAgent';
import { contentGeneratorAgent } from './ContentGeneratorAgent';
import { groupingAgent } from './GroupingAgent';

/**
 * 所有教師模組 Agents
 */
export const teacherAgents = [
    lessonPlannerAgent,
    contentGeneratorAgent,
    groupingAgent,
];
