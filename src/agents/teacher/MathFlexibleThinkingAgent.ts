/**
 * MathFlexibleThinkingAgent - 數學變通性思考 Agent
 *
 * 職責：
 * - 生成多元解題策略
 * - 建議替代解法路徑
 * - 評估數學變通性
 */

import { BaseAgent } from '../BaseAgent';
import type { AgentId, AgentCategory, AgentTool } from '../types';

// ==================== Tool Input Types ====================

interface GenerateMultiStrategiesInput {
    problemId: string;
    problemType: 'equation' | 'geometry' | 'proof' | 'word-problem' | 'optimization';
    difficulty?: 'basic' | 'intermediate' | 'advanced';
    targetStrategies?: number;
}

interface SuggestAlternativePathsInput {
    problemId: string;
    currentSolution: string;
    studentLevel?: 'beginner' | 'intermediate' | 'advanced';
}

interface AssessFlexibilityInput {
    studentId: string;
    solutions: {
        problemId: string;
        approach: string;
        isCorrect: boolean;
    }[];
}

// ==================== Agent Implementation ====================

export class MathFlexibleThinkingAgent extends BaseAgent {
    readonly id: AgentId = 'math-flexible-thinking';
    readonly name = '數學變通性思考 Agent';
    readonly category: AgentCategory = 'teacher';

    protected defineTools(): AgentTool[] {
        return [
            this.createMockTool(
                'generate_multi_strategies',
                '為數學問題生成多種不同的解題策略',
                (input: GenerateMultiStrategiesInput) => ({
                    problemId: input.problemId,
                    problemType: input.problemType,
                    strategies: this.generateStrategies(input.problemType, input.targetStrategies || 3),
                    difficultyLevel: input.difficulty || 'intermediate',
                    pedagogicalNotes: this.getPedagogicalNotes(input.problemType),
                    commonMisconceptions: this.getCommonMisconceptions(input.problemType),
                })
            ),

            this.createMockTool(
                'suggest_alternative_paths',
                '根據學生當前解法建議替代的解題路徑',
                (input: SuggestAlternativePathsInput) => ({
                    problemId: input.problemId,
                    currentApproach: input.currentSolution,
                    alternatives: this.suggestAlternatives(input.currentSolution, input.studentLevel),
                    comparisonTable: this.createComparisonTable(input.currentSolution),
                    learningOpportunities: this.identifyLearningOpportunities(input.currentSolution),
                })
            ),

            this.createMockTool(
                'assess_flexibility',
                '評估學生的數學變通性思考能力',
                (input: AssessFlexibilityInput) => ({
                    studentId: input.studentId,
                    flexibilityScore: this.calculateFlexibilityScore(input.solutions),
                    dimensions: {
                        approachVariety: this.assessApproachVariety(input.solutions),
                        adaptability: this.assessAdaptability(input.solutions),
                        creativity: this.assessCreativity(input.solutions),
                        efficiency: this.assessEfficiency(input.solutions),
                    },
                    patterns: this.identifyPatterns(input.solutions),
                    recommendations: this.generateRecommendations(input.solutions),
                })
            ),
        ];
    }

    private generateStrategies(problemType: string, count: number): object[] {
        const strategies: Record<string, object[]> = {
            equation: [
                {
                    name: '代數法',
                    description: '使用代數運算直接求解',
                    steps: ['移項整理', '化簡', '求解'],
                    applicability: '適用於大多數方程式',
                    cognitiveLoad: 'medium',
                },
                {
                    name: '圖形法',
                    description: '將方程式轉換為函數圖形求交點',
                    steps: ['畫出函數圖', '找交點', '讀取 x 值'],
                    applicability: '適用於視覺化思考',
                    cognitiveLoad: 'low',
                },
                {
                    name: '公式法',
                    description: '套用公式直接計算',
                    steps: ['辨識類型', '套用公式', '代入計算'],
                    applicability: '適用於標準形式',
                    cognitiveLoad: 'low',
                },
                {
                    name: '因式分解法',
                    description: '將多項式分解為因式乘積',
                    steps: ['找因數', '分解', '令各因式為零'],
                    applicability: '適用於可分解情況',
                    cognitiveLoad: 'high',
                },
            ],
            geometry: [
                {
                    name: '綜合法',
                    description: '從已知條件出發逐步推導',
                    steps: ['列出已知', '應用定理', '推導結論'],
                    applicability: '經典證明方法',
                    cognitiveLoad: 'medium',
                },
                {
                    name: '解析法',
                    description: '建立座標系統用代數方法處理',
                    steps: ['建立座標', '列方程', '代數運算'],
                    applicability: '複雜圖形問題',
                    cognitiveLoad: 'high',
                },
                {
                    name: '向量法',
                    description: '使用向量運算處理幾何問題',
                    steps: ['定義向量', '向量運算', '幾何解釋'],
                    applicability: '平行與垂直問題',
                    cognitiveLoad: 'high',
                },
            ],
            proof: [
                {
                    name: '直接證明',
                    description: '從假設直接推導到結論',
                    steps: ['假設前提', '邏輯推演', '得出結論'],
                    applicability: '大多數證明題',
                    cognitiveLoad: 'medium',
                },
                {
                    name: '反證法',
                    description: '假設結論不成立推導出矛盾',
                    steps: ['假設否定', '推導矛盾', '否定假設'],
                    applicability: '否定性命題',
                    cognitiveLoad: 'high',
                },
                {
                    name: '數學歸納法',
                    description: '證明基礎情況和遞推步驟',
                    steps: ['驗證 n=1', '假設 n=k', '證明 n=k+1'],
                    applicability: '與自然數相關',
                    cognitiveLoad: 'high',
                },
            ],
            'word-problem': [
                {
                    name: '方程式建模',
                    description: '將文字條件轉化為方程式',
                    steps: ['設未知數', '列方程', '求解'],
                    applicability: '一般應用題',
                    cognitiveLoad: 'medium',
                },
                {
                    name: '圖表分析',
                    description: '使用圖表整理資訊',
                    steps: ['製作圖表', '找關係', '推算'],
                    applicability: '複雜條件題',
                    cognitiveLoad: 'low',
                },
            ],
            optimization: [
                {
                    name: '微分法',
                    description: '使用導數求極值',
                    steps: ['設目標函數', '求導', '令導數為零'],
                    applicability: '連續函數',
                    cognitiveLoad: 'high',
                },
                {
                    name: '不等式法',
                    description: '使用不等式性質',
                    steps: ['使用 AM-GM', '找等號條件'],
                    applicability: '特定形式',
                    cognitiveLoad: 'medium',
                },
            ],
        };

        const typeStrategies = strategies[problemType] || strategies.equation;
        return typeStrategies.slice(0, Math.min(count, typeStrategies.length));
    }

    private getPedagogicalNotes(problemType: string): string[] {
        const notes: Record<string, string[]> = {
            equation: [
                '鼓勵學生嘗試不同方法並比較效率',
                '討論每種方法的適用情境',
                '強調理解優於記憶公式',
            ],
            geometry: [
                '培養空間想像能力',
                '連結代數與幾何觀點',
                '重視作圖的準確性',
            ],
            proof: [
                '強調邏輯嚴謹性',
                '訓練反向思考能力',
                '培養質疑精神',
            ],
            'word-problem': [
                '著重閱讀理解',
                '訓練數學建模能力',
                '強調驗證答案合理性',
            ],
            optimization: [
                '理解極值的幾何意義',
                '注意定義域限制',
                '培養最優化思維',
            ],
        };
        return notes[problemType] || notes.equation;
    }

    private getCommonMisconceptions(problemType: string): string[] {
        const misconceptions: Record<string, string[]> = {
            equation: [
                '忘記移項要變號',
                '混淆解與根的概念',
                '忽略無解或無限多解情況',
            ],
            geometry: [
                '依賴圖形外觀而非證明',
                '混淆充分與必要條件',
                '忽略特殊情況',
            ],
        };
        return misconceptions[problemType] || [];
    }

    private suggestAlternatives(_currentSolution: string, level?: string): object[] {
        return [
            {
                approach: '替代方法 1',
                description: '使用不同的數學工具',
                suitability: level === 'advanced' ? 'high' : 'medium',
                learningValue: '拓展數學視野',
            },
            {
                approach: '替代方法 2',
                description: '從不同角度切入問題',
                suitability: 'medium',
                learningValue: '培養多元思考',
            },
        ];
    }

    private createComparisonTable(_currentSolution: string): object {
        return {
            headers: ['方法', '步驟數', '難度', '適用情境'],
            rows: [
                ['目前方法', 5, '中等', '一般情況'],
                ['替代方法 1', 3, '較易', '特定條件'],
                ['替代方法 2', 7, '較難', '進階應用'],
            ],
        };
    }

    private identifyLearningOpportunities(_currentSolution: string): string[] {
        return [
            '探索更簡潔的解法',
            '建立不同方法間的連結',
            '理解每種方法的優缺點',
        ];
    }

    private calculateFlexibilityScore(solutions: { approach: string }[]): number {
        const uniqueApproaches = new Set(solutions.map(s => s.approach)).size;
        return Math.min(uniqueApproaches * 20, 100);
    }

    private assessApproachVariety(solutions: { approach: string }[]): number {
        const unique = new Set(solutions.map(s => s.approach)).size;
        return Math.min((unique / solutions.length) * 100, 100);
    }

    private assessAdaptability(_solutions: object[]): number {
        return Math.floor(Math.random() * 30) + 60;
    }

    private assessCreativity(_solutions: object[]): number {
        return Math.floor(Math.random() * 30) + 55;
    }

    private assessEfficiency(_solutions: object[]): number {
        return Math.floor(Math.random() * 30) + 65;
    }

    private identifyPatterns(_solutions: { approach: string }[]): string[] {
        return [
            '偏好代數方法',
            '較少使用圖形思考',
            '能靈活切換策略',
        ];
    }

    private generateRecommendations(_solutions: object[]): string[] {
        return [
            '嘗試使用圖形法解決代數問題',
            '練習從不同角度分析同一問題',
            '建立解題方法的選擇流程',
        ];
    }
}

export const mathFlexibleThinkingAgent = new MathFlexibleThinkingAgent();
