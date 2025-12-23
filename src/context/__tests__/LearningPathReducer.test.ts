/**
 * LearningPathReducer 單元測試
 * 
 * 測試項目：
 * - CREATE_PATH
 * - ADD_NODE / DELETE_NODE
 * - UPDATE_NODE_POSITION
 * - SET_NODES_AND_EDGES
 */

import { describe, it, expect } from 'vitest';
import {
    learningPathReducer,
    initialLearningPathState,
    type LearningPathAction,
} from '../LearningPathContext';
import type { LearningPathNode, LearningPathEdge } from '../../types';

// ==================== Helper Functions ====================

function createTestNode(id: string, type = 'chapter'): LearningPathNode {
    return {
        id,
        type: type as LearningPathNode['type'],
        position: { x: 0, y: 0 },
        data: {
            label: `Test Node ${id}`,
            description: 'Test description',
        },
    };
}

function createTestEdge(source: string, target: string): LearningPathEdge {
    return {
        id: `e-${source}-${target}`,
        source,
        target,
        type: 'default',
    };
}

// ==================== Tests ====================

describe('LearningPathReducer', () => {
    describe('CREATE_PATH', () => {
        it('should create a new path for a student', () => {
            const action: LearningPathAction = {
                type: 'CREATE_PATH',
                payload: { studentId: 'student-1', studentName: '測試學生' },
            };

            const state = learningPathReducer(initialLearningPathState, action);

            expect(state.studentPaths.has('student-1')).toBe(true);

            const path = state.studentPaths.get('student-1');
            expect(path?.studentName).toBe('測試學生');
            expect(path?.nodes).toHaveLength(0);
            expect(path?.edges).toHaveLength(0);
        });

        it('should not affect other paths when creating a new one', () => {
            let state = learningPathReducer(initialLearningPathState, {
                type: 'CREATE_PATH',
                payload: { studentId: 'student-1', studentName: '學生一' },
            });

            state = learningPathReducer(state, {
                type: 'CREATE_PATH',
                payload: { studentId: 'student-2', studentName: '學生二' },
            });

            expect(state.studentPaths.size).toBe(2);
            expect(state.studentPaths.get('student-1')?.studentName).toBe('學生一');
            expect(state.studentPaths.get('student-2')?.studentName).toBe('學生二');
        });
    });

    describe('ADD_NODE', () => {
        it('should add a node to existing path', () => {
            let state = learningPathReducer(initialLearningPathState, {
                type: 'CREATE_PATH',
                payload: { studentId: 'student-1', studentName: '測試學生' },
            });

            const node = createTestNode('node-1');
            state = learningPathReducer(state, {
                type: 'ADD_NODE',
                payload: { studentId: 'student-1', node },
            });

            const path = state.studentPaths.get('student-1');
            expect(path?.nodes).toHaveLength(1);
            expect(path?.nodes[0].id).toBe('node-1');
            expect(path?.progress.totalNodes).toBe(1);
        });

        it('should not add node if path does not exist', () => {
            const node = createTestNode('node-1');
            const state = learningPathReducer(initialLearningPathState, {
                type: 'ADD_NODE',
                payload: { studentId: 'non-existent', node },
            });

            expect(state.studentPaths.size).toBe(0);
        });
    });

    describe('DELETE_NODE', () => {
        it('should delete a node and related edges', () => {
            // Setup: Create path with nodes and edges
            let state = learningPathReducer(initialLearningPathState, {
                type: 'CREATE_PATH',
                payload: { studentId: 'student-1', studentName: '測試學生' },
            });

            state = learningPathReducer(state, {
                type: 'ADD_NODE',
                payload: { studentId: 'student-1', node: createTestNode('node-1') },
            });
            state = learningPathReducer(state, {
                type: 'ADD_NODE',
                payload: { studentId: 'student-1', node: createTestNode('node-2') },
            });
            state = learningPathReducer(state, {
                type: 'ADD_EDGE',
                payload: { studentId: 'student-1', edge: createTestEdge('node-1', 'node-2') },
            });

            // Act: Delete node-1
            state = learningPathReducer(state, {
                type: 'DELETE_NODE',
                payload: { studentId: 'student-1', nodeId: 'node-1' },
            });

            // Assert
            const path = state.studentPaths.get('student-1');
            expect(path?.nodes).toHaveLength(1);
            expect(path?.nodes[0].id).toBe('node-2');
            expect(path?.edges).toHaveLength(0); // Edge should be deleted
        });
    });

    describe('UPDATE_NODE_POSITION', () => {
        it('should update node position', () => {
            let state = learningPathReducer(initialLearningPathState, {
                type: 'CREATE_PATH',
                payload: { studentId: 'student-1', studentName: '測試學生' },
            });
            state = learningPathReducer(state, {
                type: 'ADD_NODE',
                payload: { studentId: 'student-1', node: createTestNode('node-1') },
            });

            state = learningPathReducer(state, {
                type: 'UPDATE_NODE_POSITION',
                payload: {
                    studentId: 'student-1',
                    nodeId: 'node-1',
                    position: { x: 100, y: 200 },
                },
            });

            const path = state.studentPaths.get('student-1');
            const node = path?.nodes.find(n => n.id === 'node-1');
            expect(node?.position).toEqual({ x: 100, y: 200 });
        });
    });

    describe('SET_NODES_AND_EDGES', () => {
        it('should replace all nodes and edges in a path', () => {
            let state = learningPathReducer(initialLearningPathState, {
                type: 'CREATE_PATH',
                payload: { studentId: 'student-1', studentName: '測試學生' },
            });

            const newNodes = [
                createTestNode('new-1'),
                createTestNode('new-2'),
                createTestNode('new-3'),
            ];
            const newEdges = [
                createTestEdge('new-1', 'new-2'),
                createTestEdge('new-2', 'new-3'),
            ];

            state = learningPathReducer(state, {
                type: 'SET_NODES_AND_EDGES',
                payload: {
                    studentId: 'student-1',
                    nodes: newNodes,
                    edges: newEdges,
                },
            });

            const path = state.studentPaths.get('student-1');
            expect(path?.nodes).toHaveLength(3);
            expect(path?.edges).toHaveLength(2);
            expect(path?.progress.totalNodes).toBe(3);
        });

        it('should create path if it does not exist', () => {
            const nodes = [createTestNode('node-1')];
            const edges: LearningPathEdge[] = [];

            const state = learningPathReducer(initialLearningPathState, {
                type: 'SET_NODES_AND_EDGES',
                payload: {
                    studentId: 'new-student',
                    nodes,
                    edges,
                },
            });

            expect(state.studentPaths.has('new-student')).toBe(true);
            expect(state.studentPaths.get('new-student')?.nodes).toHaveLength(1);
        });
    });

    describe('SET_GENERATING', () => {
        it('should toggle generating state', () => {
            let state = learningPathReducer(initialLearningPathState, {
                type: 'SET_GENERATING',
                payload: true,
            });
            expect(state.isGenerating).toBe(true);

            state = learningPathReducer(state, {
                type: 'SET_GENERATING',
                payload: false,
            });
            expect(state.isGenerating).toBe(false);
        });
    });
});
