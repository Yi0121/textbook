/**
 * TechnicalSupportAgent - 技術工具支援 Agent
 *
 * 職責：
 * - GeoGebra 動態幾何工具整合
 * - 代數求解支援
 * - 手寫辨識
 * - 技術提示與操作指引
 */

import { BaseAgent } from '../BaseAgent';
import type { AgentId, AgentCategory, AgentTool } from '../types';

// ==================== Tool Input Types ====================

interface GetGeoGebraStateInput {
    sessionId: string;
    objectIds?: string[];
}

interface SolveAlgebraInput {
    expression: string;
    variable?: string;
    showSteps?: boolean;
}

interface RecognizeHandwritingInput {
    imageData: string; // base64 encoded
    expectedType?: 'equation' | 'number' | 'expression' | 'geometry';
}

interface ProvideTechnicalHintInput {
    tool: 'geogebra' | 'wolfram' | 'desmos' | 'handwriting';
    operation: string;
    difficulty?: 'basic' | 'intermediate' | 'advanced';
}

// ==================== Agent Implementation ====================

export class TechnicalSupportAgent extends BaseAgent {
    readonly id: AgentId = 'technical-support';
    readonly name = '技術工具支援 Agent';
    readonly category: AgentCategory = 'student';

    protected defineTools(): AgentTool[] {
        return [
            this.createMockTool(
                'get_geogebra_state',
                '取得 GeoGebra 畫布的當前狀態和物件資訊',
                (input: GetGeoGebraStateInput) => ({
                    sessionId: input.sessionId,
                    objects: this.mockGeoGebraObjects(input.objectIds),
                    viewSettings: {
                        xMin: -10,
                        xMax: 10,
                        yMin: -10,
                        yMax: 10,
                        gridVisible: true,
                        axesVisible: true,
                    },
                    constructionSteps: [
                        { step: 1, command: 'Point(0,0)', object: 'A' },
                        { step: 2, command: 'Point(3,4)', object: 'B' },
                        { step: 3, command: 'Line(A,B)', object: 'f' },
                    ],
                })
            ),

            this.createMockTool(
                'solve_algebra',
                '使用代數引擎求解方程式或化簡表達式',
                (input: SolveAlgebraInput) => ({
                    expression: input.expression,
                    variable: input.variable || 'x',
                    solution: this.mockSolveAlgebra(input.expression, input.variable),
                    steps: input.showSteps ? this.mockSolutionSteps(input.expression) : undefined,
                    alternativeForms: ['標準式', '因式分解', '頂點式'],
                })
            ),

            this.createMockTool(
                'recognize_handwriting',
                '辨識手寫數學符號並轉換為 LaTeX 或可計算格式',
                (input: RecognizeHandwritingInput) => ({
                    success: true,
                    recognizedText: this.mockHandwritingRecognition(input.expectedType),
                    latex: '\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}',
                    confidence: 0.92,
                    alternatives: [
                        { text: 'x = (-b ± √(b²-4ac)) / 2a', confidence: 0.87 },
                    ],
                    expectedType: input.expectedType || 'expression',
                })
            ),

            this.createMockTool(
                'provide_technical_hint',
                '提供特定技術工具的操作提示和指引',
                (input: ProvideTechnicalHintInput) => ({
                    tool: input.tool,
                    operation: input.operation,
                    hints: this.getTechnicalHints(input.tool, input.operation),
                    tutorialLink: this.getTutorialLink(input.tool, input.operation),
                    shortcuts: this.getShortcuts(input.tool),
                    difficulty: input.difficulty || 'basic',
                })
            ),
        ];
    }

    private mockGeoGebraObjects(objectIds?: string[]): object[] {
        const allObjects = [
            { id: 'A', type: 'point', coords: [0, 0], visible: true },
            { id: 'B', type: 'point', coords: [3, 4], visible: true },
            { id: 'f', type: 'line', equation: 'y = 4/3 * x', visible: true },
            { id: 'c', type: 'circle', center: [0, 0], radius: 5, visible: true },
        ];
        if (objectIds && objectIds.length > 0) {
            return allObjects.filter(obj => objectIds.includes(obj.id));
        }
        return allObjects;
    }

    private mockSolveAlgebra(expression: string, _variable?: string): string {
        // 簡化模擬：根據輸入返回假解
        if (expression.includes('x^2')) {
            return 'x = 2 或 x = -3';
        }
        if (expression.includes('x')) {
            return 'x = 5';
        }
        return '無法求解';
    }

    private mockSolutionSteps(expression: string): string[] {
        return [
            `原式: ${expression}`,
            '移項整理',
            '因式分解',
            '求解各因式',
            '得到解集',
        ];
    }

    private mockHandwritingRecognition(expectedType?: string): string {
        const results: Record<string, string> = {
            equation: 'x² + 5x + 6 = 0',
            number: '3.14159',
            expression: '2x + 3y',
            geometry: '△ABC',
        };
        return results[expectedType || 'expression'] || '2x + 3';
    }

    private getTechnicalHints(tool: string, operation: string): string[] {
        const hints: Record<string, Record<string, string[]>> = {
            geogebra: {
                default: ['使用工具列選擇繪圖工具', '點擊畫布建立物件', '拖曳物件進行調整'],
                circle: ['選擇「圓」工具', '點擊圓心位置', '拖曳設定半徑'],
                line: ['選擇「直線」工具', '點擊兩點建立直線', '或輸入方程式'],
            },
            wolfram: {
                default: ['輸入數學表達式', '使用 Solve[] 求解方程式', '使用 Plot[] 繪圖'],
                solve: ['Solve[equation, variable]', '例: Solve[x^2 - 4 == 0, x]'],
            },
            desmos: {
                default: ['在輸入欄輸入函數', '使用滑桿建立動態參數', '點擊設定調整顯示'],
            },
            handwriting: {
                default: ['書寫清晰的數學符號', '分數使用水平線', '根號要完整包覆'],
            },
        };
        return hints[tool]?.[operation] || hints[tool]?.default || ['請參考工具說明文件'];
    }

    private getTutorialLink(tool: string, _operation: string): string {
        const links: Record<string, string> = {
            geogebra: 'https://www.geogebra.org/manual',
            wolfram: 'https://www.wolframalpha.com/examples',
            desmos: 'https://learn.desmos.com',
            handwriting: '/help/handwriting-guide',
        };
        return links[tool] || '/help';
    }

    private getShortcuts(tool: string): Record<string, string> {
        const shortcuts: Record<string, Record<string, string>> = {
            geogebra: {
                'Ctrl+Z': '復原',
                'Ctrl+Y': '重做',
                'Delete': '刪除選取物件',
                'Esc': '取消目前操作',
            },
            desmos: {
                'Ctrl+/': '新增表達式',
                'Ctrl+F': '新增資料夾',
            },
        };
        return shortcuts[tool] || {};
    }
}

export const technicalSupportAgent = new TechnicalSupportAgent();
