/**
 * Analytics Module Agent 測試
 */

import { describe, it, expect } from 'vitest';
import { Orchestrator } from '../Orchestrator';
import { analyticsAgents } from '../analytics';
import {
    dataStewardAgent,
    snaAnalystAgent,
    enaAnalystAgent,
    srlAnalystAgent,
    processAnalystAgent,
    mathProblemAnalystAgent,
    synthesisAgent,
    dashboardAgent,
} from '../analytics';

describe('Analytics Module Agents', () => {
    describe('Registration', () => {
        it('should have 8 analytics agents', () => {
            expect(analyticsAgents).toHaveLength(8);
        });

        it('should register all analytics agents', () => {
            const orchestrator = new Orchestrator();
            orchestrator.registerAll(analyticsAgents);
            expect(orchestrator.listAgentsByCategory('analytics')).toHaveLength(8);
        });
    });

    describe('DataStewardAgent', () => {
        it('should have correct id and category', () => {
            expect(dataStewardAgent.id).toBe('data-cleaning');
            expect(dataStewardAgent.category).toBe('analytics');
        });

        it('should execute collect_raw_data', async () => {
            const response = await dataStewardAgent.execute({
                action: 'collect_raw_data',
                payload: { dataType: 'learning-behavior', studentId: 'student-1' },
            });
            expect(response.success).toBe(true);
            expect(response.data).toHaveProperty('collected', true);
            expect(response.data).toHaveProperty('dataId');
        });

        it('should execute clean_data', async () => {
            const response = await dataStewardAgent.execute({
                action: 'clean_data',
                payload: { dataId: 'data-123', operations: ['remove_duplicates', 'validate'] },
            });
            expect(response.success).toBe(true);
            expect(response.data).toHaveProperty('cleaned', true);
            expect(response.data).toHaveProperty('qualityScore');
        });

        it('should execute export_data', async () => {
            const response = await dataStewardAgent.execute({
                action: 'export_data',
                payload: { dataType: 'assessment', format: 'csv' },
            });
            expect(response.success).toBe(true);
            expect(response.data).toHaveProperty('exported', true);
            expect(response.data).toHaveProperty('filename');
        });
    });

    describe('SNAAnalystAgent', () => {
        it('should have correct id and category', () => {
            expect(snaAnalystAgent.id).toBe('sna-analyst');
            expect(snaAnalystAgent.category).toBe('analytics');
        });

        it('should execute analyze_social_network', async () => {
            const response = await snaAnalystAgent.execute({
                action: 'analyze_social_network',
                payload: { classId: 'class-1' },
            });
            expect(response.success).toBe(true);
            expect(response.data).toHaveProperty('networkMetrics');
        });
    });

    describe('ENAAnalystAgent', () => {
        it('should have correct id and category', () => {
            expect(enaAnalystAgent.id).toBe('ena-analyst');
            expect(enaAnalystAgent.category).toBe('analytics');
        });

        it('should execute analyze_epistemic_network', async () => {
            const response = await enaAnalystAgent.execute({
                action: 'analyze_epistemic_network',
                payload: { studentId: 'student-1', topic: '代數' },
            });
            expect(response.success).toBe(true);
            expect(response.data).toHaveProperty('conceptConnections');
        });
    });

    describe('SRLAnalystAgent', () => {
        it('should have correct id and category', () => {
            expect(srlAnalystAgent.id).toBe('srl-analyst');
            expect(srlAnalystAgent.category).toBe('analytics');
        });

        it('should execute analyze_srl_patterns', async () => {
            const response = await srlAnalystAgent.execute({
                action: 'analyze_srl_patterns',
                payload: { studentId: 'student-1' },
            });
            expect(response.success).toBe(true);
            expect(response.data).toHaveProperty('srlProfile');
        });
    });

    describe('ProcessAnalystAgent', () => {
        it('should have correct id and category', () => {
            expect(processAnalystAgent.id).toBe('process-analyst');
            expect(processAnalystAgent.category).toBe('analytics');
        });

        it('should execute analyze_learning_trajectory', async () => {
            const response = await processAnalystAgent.execute({
                action: 'analyze_learning_trajectory',
                payload: { studentId: 'student-1', courseId: 'course-1' },
            });
            expect(response.success).toBe(true);
            expect(response.data).toHaveProperty('trajectoryType');
        });
    });

    describe('MathProblemAnalystAgent', () => {
        it('should have correct id and category', () => {
            expect(mathProblemAnalystAgent.id).toBe('math-problem-analyst');
            expect(mathProblemAnalystAgent.category).toBe('analytics');
        });

        it('should execute analyze_problem_solving', async () => {
            const response = await mathProblemAnalystAgent.execute({
                action: 'analyze_problem_solving',
                payload: { studentId: 'student-1', problemId: 'prob-1' },
            });
            expect(response.success).toBe(true);
            expect(response.data).toHaveProperty('solvingPhases');
        });
    });

    describe('SynthesisAgent', () => {
        it('should have correct id and category', () => {
            expect(synthesisAgent.id).toBe('synthesis');
            expect(synthesisAgent.category).toBe('analytics');
        });

        it('should execute aggregate_analyses', async () => {
            const response = await synthesisAgent.execute({
                action: 'aggregate_analyses',
                payload: { studentId: 'student-1', analyses: { sna: {}, ena: {} } },
            });
            expect(response.success).toBe(true);
            expect(response.data).toHaveProperty('aggregatedReport');
        });

        it('should execute generate_teaching_suggestions', async () => {
            const response = await synthesisAgent.execute({
                action: 'generate_teaching_suggestions',
                payload: { studentId: 'student-1', weakAreas: ['代數', '幾何'] },
            });
            expect(response.success).toBe(true);
            expect(response.data).toHaveProperty('suggestions');
        });
    });

    describe('DashboardAgent', () => {
        it('should have correct id and category', () => {
            expect(dashboardAgent.id).toBe('viz');
            expect(dashboardAgent.category).toBe('analytics');
        });

        it('should execute render_student_dashboard', async () => {
            const response = await dashboardAgent.execute({
                action: 'render_student_dashboard',
                payload: { studentId: 'student-1' },
            });
            expect(response.success).toBe(true);
            expect(response.data).toHaveProperty('data');
        });

        it('should execute render_teacher_dashboard', async () => {
            const response = await dashboardAgent.execute({
                action: 'render_teacher_dashboard',
                payload: { classId: 'class-1', teacherId: 'teacher-1' },
            });
            expect(response.success).toBe(true);
            expect(response.data).toHaveProperty('widgets');
        });
    });
});
