/**
 * Agent 系統單元測試
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Orchestrator, orchestrator } from '../Orchestrator';
import { lessonPlannerAgent } from '../teacher/LessonPlannerAgent';
import { contentGeneratorAgent } from '../teacher/ContentGeneratorAgent';
import { groupingAgent } from '../teacher/GroupingAgent';
import { teacherAgents } from '../teacher';
import type { AgentRequest } from '../types';

describe('Orchestrator', () => {
    let testOrchestrator: Orchestrator;

    beforeEach(() => {
        testOrchestrator = new Orchestrator();
    });

    describe('Agent Registration', () => {
        it('should register an agent', () => {
            testOrchestrator.register(lessonPlannerAgent);
            expect(testOrchestrator.hasAgent('curriculum-design')).toBe(true);
        });

        it('should register multiple agents', () => {
            testOrchestrator.registerAll(teacherAgents);
            expect(testOrchestrator.listAgentIds()).toHaveLength(4);
        });

        it('should list registered agents', () => {
            testOrchestrator.registerAll(teacherAgents);
            const agents = testOrchestrator.listAgents();
            expect(agents.map(a => a.id)).toContain('curriculum-design');
            expect(agents.map(a => a.id)).toContain('content-generator');
            expect(agents.map(a => a.id)).toContain('collaborative-grouping');
        });

        it('should unregister an agent', () => {
            testOrchestrator.register(lessonPlannerAgent);
            expect(testOrchestrator.unregister('curriculum-design')).toBe(true);
            expect(testOrchestrator.hasAgent('curriculum-design')).toBe(false);
        });
    });

    describe('Request Routing', () => {
        beforeEach(() => {
            testOrchestrator.registerAll(teacherAgents);
        });

        it('should route request to correct agent', async () => {
            const request: AgentRequest = {
                action: 'create_lesson_plan',
                payload: { title: '測試教案' },
            };

            const response = await testOrchestrator.route('curriculum-design', request);
            expect(response.success).toBe(true);
            expect(response.handledBy).toBe('curriculum-design');
        });

        it('should return error for unknown agent', async () => {
            const request: AgentRequest = {
                action: 'some_action',
                payload: {},
            };

            const response = await testOrchestrator.route('unknown-agent' as any, request);
            expect(response.success).toBe(false);
            expect(response.error).toContain('not found');
        });

        it('should return error for unknown tool', async () => {
            const request: AgentRequest = {
                action: 'unknown_tool',
                payload: {},
            };

            const response = await testOrchestrator.route('curriculum-design', request);
            expect(response.success).toBe(false);
            expect(response.error).toContain('not found');
        });
    });

    describe('Tool Discovery', () => {
        beforeEach(() => {
            testOrchestrator.registerAll(teacherAgents);
        });

        it('should list all available tools', () => {
            const tools = testOrchestrator.listAllTools();
            expect(tools.length).toBeGreaterThan(0);
            expect(tools.some(t => t.toolName === 'create_lesson_plan')).toBe(true);
        });

        it('should find agent by tool name', () => {
            const agent = testOrchestrator.findAgentByTool('generate_exercise');
            expect(agent?.id).toBe('content-generator');
        });
    });
});

describe('LessonPlannerAgent', () => {
    it('should have correct id and category', () => {
        expect(lessonPlannerAgent.id).toBe('curriculum-design');
        expect(lessonPlannerAgent.category).toBe('teacher');
    });

    it('should list tool names', () => {
        const toolNames = lessonPlannerAgent.getToolNames();
        expect(toolNames).toContain('create_lesson_plan');
        expect(toolNames).toContain('edit_lesson_flow');
        expect(toolNames).toContain('assign_activities');
        expect(toolNames).toContain('schedule_content');
    });

    it('should execute create_lesson_plan', async () => {
        const response = await lessonPlannerAgent.execute({
            action: 'create_lesson_plan',
            payload: { title: '一元二次方程式' },
        });

        expect(response.success).toBe(true);
        expect(response.data).toHaveProperty('id');
        expect(response.data).toHaveProperty('title', '一元二次方程式');
    });
});

describe('ContentGeneratorAgent', () => {
    it('should have correct id and category', () => {
        expect(contentGeneratorAgent.id).toBe('content-generator');
        expect(contentGeneratorAgent.category).toBe('teacher');
    });

    it('should execute generate_exercise', async () => {
        const response = await contentGeneratorAgent.execute({
            action: 'generate_exercise',
            payload: { topic: '二次函數', count: 3 },
        });

        expect(response.success).toBe(true);
        expect(Array.isArray(response.data)).toBe(true);
        expect((response.data as any[]).length).toBe(3);
    });

    it('should execute generate_quiz', async () => {
        const response = await contentGeneratorAgent.execute({
            action: 'generate_quiz',
            payload: { topic: '判別式', questionCount: 5 },
        });

        expect(response.success).toBe(true);
        expect(response.data).toHaveProperty('questions');
        expect((response.data as any).questions.length).toBe(5);
    });
});

describe('GroupingAgent', () => {
    it('should have correct id and category', () => {
        expect(groupingAgent.id).toBe('collaborative-grouping');
        expect(groupingAgent.category).toBe('teacher');
    });

    it('should execute auto_group_students', async () => {
        const response = await groupingAgent.execute({
            action: 'auto_group_students',
            payload: { classId: 'class-1', groupCount: 4, strategy: 'mixed' },
        });

        expect(response.success).toBe(true);
        expect(response.data).toHaveProperty('groups');
        expect((response.data as any).groups.length).toBe(4);
    });

    it('should execute get_group_analytics', async () => {
        const response = await groupingAgent.execute({
            action: 'get_group_analytics',
            payload: { classId: 'class-1' },
        });

        expect(response.success).toBe(true);
        expect(Array.isArray(response.data)).toBe(true);
    });
});

describe('Global Orchestrator', () => {
    it('should be a singleton', () => {
        expect(orchestrator).toBeInstanceOf(Orchestrator);
    });
});
