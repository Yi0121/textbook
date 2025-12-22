/**
 * ScaffoldingAgent - 鷹架切換 Agent
 * 
 * 職責：
 * - 切換鷹架模式 (臆測/推論/CPS/創造力)
 * - 提供提示
 * - 調整難度
 * - 啟動技術工具 (GeoGebra/手寫板)
 */

import { BaseAgent } from '../BaseAgent';
import type { AgentId, AgentCategory, AgentTool } from '../types';

// ==================== Tool Input Types ====================

interface SwitchScaffoldModeInput {
    mode: 'conjecture' | 'reasoning' | 'cps' | 'creativity' | 'tool';
    studentId?: string;
}

interface ProvideHintInput {
    studentId: string;
    problemId: string;
    hintLevel?: number; // 1-3, 越高越詳細
}

interface AdjustDifficultyInput {
    studentId: string;
    direction: 'easier' | 'harder';
    currentDifficulty?: 'easy' | 'medium' | 'hard';
}

interface LaunchGeogebraInput {
    activityId?: string;
    preset?: 'geometry' | 'algebra' | 'graphing' | 'blank';
}

interface EnableHandwritingInput {
    studentId: string;
    canvasId?: string;
}

// ==================== Agent Implementation ====================

export class ScaffoldingAgent extends BaseAgent {
    readonly id: AgentId = 'scaffolding';
    readonly name = '鷹架切換 Agent';
    readonly category: AgentCategory = 'student';

    protected defineTools(): AgentTool[] {
        return [
            this.createMockTool(
                'switch_scaffold_mode',
                '切換鷹架模式 (臆測/推論/CPS/創造力/工具)',
                (input: SwitchScaffoldModeInput) => ({
                    previousMode: 'reasoning',
                    currentMode: input.mode,
                    modeDescription: this.getModeDescription(input.mode),
                    timestamp: Date.now(),
                })
            ),

            this.createMockTool(
                'provide_hint',
                '根據學生當前狀態提供適當提示',
                (input: ProvideHintInput) => ({
                    hintLevel: input.hintLevel || 1,
                    hint: this.generateHint(input.hintLevel || 1),
                    remainingHints: 3 - (input.hintLevel || 1),
                })
            ),

            this.createMockTool(
                'adjust_difficulty',
                '調整題目難度',
                (input: AdjustDifficultyInput) => {
                    const difficulties = ['easy', 'medium', 'hard'];
                    const currentIdx = difficulties.indexOf(input.currentDifficulty || 'medium');
                    const newIdx = input.direction === 'easier'
                        ? Math.max(0, currentIdx - 1)
                        : Math.min(2, currentIdx + 1);
                    return {
                        previousDifficulty: input.currentDifficulty || 'medium',
                        newDifficulty: difficulties[newIdx],
                        adjusted: currentIdx !== newIdx,
                    };
                }
            ),

            this.createMockTool(
                'launch_geogebra',
                '啟動 GeoGebra 數學工具',
                (input: LaunchGeogebraInput) => ({
                    launched: true,
                    preset: input.preset || 'blank',
                    url: `geogebra://activity/${input.activityId || 'new'}`,
                    features: ['geometry', 'graphing', 'cas'],
                })
            ),

            this.createMockTool(
                'enable_handwriting',
                '啟用手寫板功能',
                (input: EnableHandwritingInput) => ({
                    enabled: true,
                    canvasId: input.canvasId || `canvas-${Date.now()}`,
                    studentId: input.studentId,
                    recognitionEnabled: true,
                })
            ),
        ];
    }

    private getModeDescription(mode: string): string {
        const descriptions: Record<string, string> = {
            conjecture: '數學臆測模式：引導學生提出猜想並驗證',
            reasoning: '數學推論模式：培養邏輯推理能力',
            cps: '合作問題解決模式：鼓勵團隊協作',
            creativity: '數學創造力模式：開放性問題探索',
            tool: '技術工具模式：使用數位工具輔助學習',
        };
        return descriptions[mode] || '未知模式';
    }

    private generateHint(level: number): string {
        const hints = [
            '提示 1：請再仔細閱讀題目，注意已知條件。',
            '提示 2：試著把問題分解成更小的步驟。',
            '提示 3：答案的關鍵在於運用公式 ax² + bx + c = 0 的判別式。',
        ];
        return hints[Math.min(level - 1, 2)];
    }
}

export const scaffoldingAgent = new ScaffoldingAgent();
