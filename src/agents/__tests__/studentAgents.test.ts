/**
 * Student Module Agent 測試
 */

import { describe, it, expect } from 'vitest';
import { Orchestrator } from '../Orchestrator';
import { studentAgents } from '../student';
import {
    scaffoldingAgent,
    graderAgent,
    learningObserverAgent,
    peerFacilitatorAgent,
    realtimeHintAgent,
    srlAgent,
    aposConstructionAgent,
    technicalSupportAgent,
    cpsAgent,
} from '../student';

describe('Student Module Agents', () => {
    describe('Registration', () => {
        it('should have 9 student agents', () => {
            expect(studentAgents).toHaveLength(9);
        });

        it('should register all student agents', () => {
            const orchestrator = new Orchestrator();
            orchestrator.registerAll(studentAgents);
            expect(orchestrator.listAgentsByCategory('student')).toHaveLength(9);
        });
    });

    describe('ScaffoldingAgent', () => {
        it('should have correct id and category', () => {
            expect(scaffoldingAgent.id).toBe('scaffolding');
            expect(scaffoldingAgent.category).toBe('student');
        });

        it('should execute switch_scaffold_mode', async () => {
            const response = await scaffoldingAgent.execute({
                action: 'switch_scaffold_mode',
                payload: { mode: 'cps' },
            });
            expect(response.success).toBe(true);
            expect(response.data).toHaveProperty('currentMode', 'cps');
        });

        it('should execute provide_hint', async () => {
            const response = await scaffoldingAgent.execute({
                action: 'provide_hint',
                payload: { studentId: 'student-1', problemId: 'prob-1', hintLevel: 2 },
            });
            expect(response.success).toBe(true);
            expect(response.data).toHaveProperty('hint');
        });
    });

    describe('GraderAgent', () => {
        it('should have correct id and category', () => {
            expect(graderAgent.id).toBe('automated-assessment');
            expect(graderAgent.category).toBe('student');
        });

        it('should execute auto_grade', async () => {
            const response = await graderAgent.execute({
                action: 'auto_grade',
                payload: { submissionId: 'sub-1', rubricId: 'rubric-1' },
            });
            expect(response.success).toBe(true);
            expect(response.data).toHaveProperty('score');
        });
    });

    describe('LearningObserverAgent', () => {
        it('should have correct id and category', () => {
            expect(learningObserverAgent.id).toBe('learning-behavior-observer');
            expect(learningObserverAgent.category).toBe('student');
        });

        it('should execute track_behavior', async () => {
            const response = await learningObserverAgent.execute({
                action: 'track_behavior',
                payload: { studentId: 'student-1', behaviorType: 'click' },
            });
            expect(response.success).toBe(true);
            expect(response.data).toHaveProperty('tracked', true);
        });
    });

    describe('PeerFacilitatorAgent', () => {
        it('should have correct id and category', () => {
            expect(peerFacilitatorAgent.id).toBe('virtual-collaborative-facilitator');
            expect(peerFacilitatorAgent.category).toBe('student');
        });

        it('should execute join_whiteboard', async () => {
            const response = await peerFacilitatorAgent.execute({
                action: 'join_whiteboard',
                payload: { sessionId: 'session-1' },
            });
            expect(response.success).toBe(true);
        });
    });

    describe('RealtimeHintAgent', () => {
        it('should have correct id and category', () => {
            expect(realtimeHintAgent.id).toBe('multi-strategy-advisor');
            expect(realtimeHintAgent.category).toBe('student');
        });

        it('should execute suggest_strategy', async () => {
            const response = await realtimeHintAgent.execute({
                action: 'suggest_strategy',
                payload: { studentId: 'student-1', problemId: 'prob-1', problemType: 'algebra' },
            });
            expect(response.success).toBe(true);
            expect(response.data).toHaveProperty('strategy');
        });
    });

    describe('SRLAgent', () => {
        it('should have correct id and category', () => {
            expect(srlAgent.id).toBe('math-srl');
            expect(srlAgent.category).toBe('student');
        });

        it('should execute assess_srl_state', async () => {
            const response = await srlAgent.execute({
                action: 'assess_srl_state',
                payload: { studentId: 'student-1' },
            });
            expect(response.success).toBe(true);
            expect(response.data).toHaveProperty('overallScore');
        });
    });

    describe('APOSConstructionAgent', () => {
        it('should have correct id and category', () => {
            expect(aposConstructionAgent.id).toBe('apos-construction');
            expect(aposConstructionAgent.category).toBe('student');
        });

        it('should execute socratic_dialogue', async () => {
            const response = await aposConstructionAgent.execute({
                action: 'socratic_dialogue',
                payload: { studentId: 'student-1', currentTopic: '二次方程式' },
            });
            expect(response.success).toBe(true);
            expect(response.data).toHaveProperty('question');
            expect(response.data).toHaveProperty('stage');
        });

        it('should execute apos_scaffolding', async () => {
            const response = await aposConstructionAgent.execute({
                action: 'apos_scaffolding',
                payload: {
                    studentId: 'student-1',
                    currentStage: 'process',
                    concept: '函數',
                },
            });
            expect(response.success).toBe(true);
            expect(response.data).toHaveProperty('scaffoldType');
            expect(response.data).toHaveProperty('activities');
        });

        it('should execute assess_apos_level', async () => {
            const response = await aposConstructionAgent.execute({
                action: 'assess_apos_level',
                payload: {
                    studentId: 'student-1',
                    concept: '多項式',
                    evidence: ['能執行計算', '理解步驟'],
                },
            });
            expect(response.success).toBe(true);
            expect(response.data).toHaveProperty('assessedLevel');
            expect(response.data).toHaveProperty('recommendations');
        });
    });

    describe('TechnicalSupportAgent', () => {
        it('should have correct id and category', () => {
            expect(technicalSupportAgent.id).toBe('technical-support');
            expect(technicalSupportAgent.category).toBe('student');
        });

        it('should execute get_geogebra_state', async () => {
            const response = await technicalSupportAgent.execute({
                action: 'get_geogebra_state',
                payload: { sessionId: 'ggb-session-1' },
            });
            expect(response.success).toBe(true);
            expect(response.data).toHaveProperty('objects');
            expect(response.data).toHaveProperty('viewSettings');
        });

        it('should execute solve_algebra', async () => {
            const response = await technicalSupportAgent.execute({
                action: 'solve_algebra',
                payload: { expression: 'x^2 - 4 = 0', showSteps: true },
            });
            expect(response.success).toBe(true);
            expect(response.data).toHaveProperty('solution');
            expect(response.data).toHaveProperty('steps');
        });

        it('should execute provide_technical_hint', async () => {
            const response = await technicalSupportAgent.execute({
                action: 'provide_technical_hint',
                payload: { tool: 'geogebra', operation: 'circle' },
            });
            expect(response.success).toBe(true);
            expect(response.data).toHaveProperty('hints');
        });
    });

    describe('CPSAgent', () => {
        it('should have correct id and category', () => {
            expect(cpsAgent.id).toBe('cps-agent');
            expect(cpsAgent.category).toBe('student');
        });

        it('should execute guide_shared_understanding', async () => {
            const response = await cpsAgent.execute({
                action: 'guide_shared_understanding',
                payload: { groupId: 'group-1', problemId: 'prob-1' },
            });
            expect(response.success).toBe(true);
            expect(response.data).toHaveProperty('guidancePrompts');
            expect(response.data).toHaveProperty('currentPhase');
        });

        it('should execute coordinate_collaboration', async () => {
            const response = await cpsAgent.execute({
                action: 'coordinate_collaboration',
                payload: {
                    groupId: 'group-1',
                    taskId: 'task-1',
                    coordinationType: 'role-assignment',
                    members: ['Alice', 'Bob', 'Carol'],
                },
            });
            expect(response.success).toBe(true);
            expect(response.data).toHaveProperty('memberRoles');
            expect(response.data).toHaveProperty('guidelines');
        });

        it('should execute assess_cps_skill', async () => {
            const response = await cpsAgent.execute({
                action: 'assess_cps_skill',
                payload: {
                    studentId: 'student-1',
                    groupId: 'group-1',
                    observedBehaviors: ['主動發言', '傾聽他人', '提出建議'],
                },
            });
            expect(response.success).toBe(true);
            expect(response.data).toHaveProperty('assessment');
            expect((response.data as any).assessment).toHaveProperty('overallScore');
        });
    });
});
