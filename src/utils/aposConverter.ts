/**
 * convertAposToLessonNodes - 將 APOS 活動節點轉換為課程節點
 */
import type { LessonPlan, LessonNode } from '../types/lessonPlan';
import { AVAILABLE_AGENTS } from '../agents/types';
import { getAllActivitiesFromAlgebra } from '../mocks';

export function convertAposToLessonNodes(aposLesson: LessonPlan): LessonNode[] {
    if (!aposLesson.stages) return [];

    let globalOrder = 1;
    const allActivities = getAllActivitiesFromAlgebra(aposLesson);

    return allActivities.map(act => {
        // Map Conditions
        const conditions: LessonNode['conditions'] = {};
        let isConditional = false;

        if (act.flowControl) {
            isConditional = true;
            conditions.branchType =
                act.flowControl.type === 'differentiation' ? 'differentiated' :
                    act.flowControl.type === 'checkpoint' ? 'remedial' : undefined;

            act.flowControl.paths.forEach(p => {
                const label = p.label.toLowerCase();
                // Heuristic mapping based on label or ID
                if (label.includes('補救') || p.id.includes('remedial') || p.id.includes('fail')) {
                    conditions.notLearnedPath = p.nextActivityId;
                } else if (label.includes('進階') || p.id.includes('advanced')) {
                    conditions.advancedPath = p.nextActivityId;
                } else {
                    conditions.learnedPath = p.nextActivityId;
                }
            });

            if (act.flowControl.criteria) {
                conditions.assessmentCriteria = act.flowControl.criteria;
            }
        }

        // Determine Branch Level
        let branchLevel: LessonNode['branchLevel'] = 'standard';
        let multiBranchOptions: LessonNode['multiBranchOptions'] = undefined;

        if (act.type === 'remedial') branchLevel = 'remedial';
        if (act.id.includes('advanced')) branchLevel = 'advanced';

        // Handle multi-choice specific logic
        if (act.flowControl?.type === 'multi-choice' && act.flowControl.paths) {
            multiBranchOptions = act.flowControl.paths.map(p => ({
                id: p.id,
                label: p.label,
                nextNodeId: p.nextActivityId
            }));
        }

        // Find stage
        const stageNode = aposLesson.stages?.find(s => s.activities.some(a => a.id === act.id));

        return {
            id: act.id,
            title: act.title,
            order: globalOrder++, // Simple sequential order
            nodeType: act.resources?.[0]?.resourceType || 'worksheet',
            agent: act.resources?.[0]?.agent || AVAILABLE_AGENTS[0],
            selectedTools: [],
            stage: stageNode?.stage,
            isConditional,
            conditions,
            branchLevel,
            multiBranchOptions,
            generatedContent: {
                materials: [act.description || ''],
            }
        };
    });
}
