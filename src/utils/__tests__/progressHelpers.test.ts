import { describe, it, expect } from 'vitest';
import { getNodeProgress, getNodeStatus, formatDuration, formatTimeMMSS } from '../progressHelpers';

describe('progressHelpers', () => {
    describe('getNodeProgress', () => {
        it('should find progress by nodeId', () => {
            const progress = [
                { nodeId: 'node-1', completed: true },
                { nodeId: 'node-2', completed: false },
            ];
            expect(getNodeProgress(progress as any, 'node-1')?.completed).toBe(true);
        });

        it('should return undefined for unknown nodeId', () => {
            expect(getNodeProgress([], 'unknown')).toBeUndefined();
        });
    });

    describe('getNodeStatus', () => {
        const node = { id: 'node-1', title: 'Test' } as any;

        it('should return completed when progress.completed is true', () => {
            const progress = [{ nodeId: 'node-1', completed: true }] as any;
            expect(getNodeStatus(node, progress, 'node-2')).toBe('completed');
        });

        it('should return current when node is currentNodeId', () => {
            const progress = [{ nodeId: 'node-1', completed: false }] as any;
            expect(getNodeStatus(node, progress, 'node-1')).toBe('current');
        });

        it('should return locked when no progress', () => {
            expect(getNodeStatus(node, [], 'node-2')).toBe('locked');
        });
    });

    describe('formatDuration', () => {
        it('should format 120 seconds as "2 分鐘"', () => {
            expect(formatDuration(120)).toBe('2 分鐘');
        });

        it('should format 0 seconds as "-"', () => {
            expect(formatDuration(0)).toBe('-');
        });

        it('should return "-" for undefined', () => {
            expect(formatDuration(undefined)).toBe('-');
        });
    });

    describe('formatTimeMMSS', () => {
        it('should format 125 seconds as "2:05"', () => {
            expect(formatTimeMMSS(125)).toBe('2:05');
        });

        it('should format 60 seconds as "1:00"', () => {
            expect(formatTimeMMSS(60)).toBe('1:00');
        });

        it('should return "-" for undefined', () => {
            expect(formatTimeMMSS(undefined)).toBe('-');
        });
    });
});
