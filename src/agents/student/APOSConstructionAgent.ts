/**
 * APOSConstructionAgent - APOS 數學建構 Agent
 *
 * 職責：
 * - 蘇格拉底式對話引導
 * - APOS 階段鷹架支援
 * - 評估學生 APOS 認知層級
 */

import { BaseAgent } from '../BaseAgent';
import type { AgentId, AgentCategory, AgentTool } from '../types';

// ==================== Tool Input Types ====================

interface SocraticDialogueInput {
    studentId: string;
    currentTopic: string;
    studentResponse?: string;
    dialogueStage?: 'questioning' | 'clarifying' | 'probing' | 'concluding';
}

interface APOSScaffoldingInput {
    studentId: string;
    currentStage: 'action' | 'process' | 'object' | 'schema';
    concept: string;
    supportLevel?: 'minimal' | 'moderate' | 'intensive';
}

interface AssessAPOSLevelInput {
    studentId: string;
    concept: string;
    evidence: string[];
}

// ==================== Agent Implementation ====================

export class APOSConstructionAgent extends BaseAgent {
    readonly id: AgentId = 'apos-construction';
    readonly name = 'APOS 數學建構 Agent';
    readonly category: AgentCategory = 'student';

    protected defineTools(): AgentTool[] {
        return [
            this.createMockTool(
                'socratic_dialogue',
                '透過蘇格拉底式對話引導學生思考數學概念',
                (input: SocraticDialogueInput) => ({
                    studentId: input.studentId,
                    topic: input.currentTopic,
                    stage: input.dialogueStage || 'questioning',
                    question: this.generateSocraticQuestion(input.dialogueStage || 'questioning', input.currentTopic),
                    hints: this.generateDialogueHints(input.dialogueStage || 'questioning'),
                    nextStage: this.getNextDialogueStage(input.dialogueStage || 'questioning'),
                })
            ),

            this.createMockTool(
                'apos_scaffolding',
                '根據學生當前 APOS 階段提供適當的鷹架支援',
                (input: APOSScaffoldingInput) => ({
                    studentId: input.studentId,
                    currentStage: input.currentStage,
                    concept: input.concept,
                    scaffoldType: this.getScaffoldType(input.currentStage),
                    activities: this.getStageActivities(input.currentStage, input.concept),
                    supportLevel: input.supportLevel || 'moderate',
                    progressIndicators: this.getProgressIndicators(input.currentStage),
                })
            ),

            this.createMockTool(
                'assess_apos_level',
                '評估學生對特定概念的 APOS 認知層級',
                (input: AssessAPOSLevelInput) => ({
                    studentId: input.studentId,
                    concept: input.concept,
                    assessedLevel: this.assessLevel(input.evidence),
                    levelDescription: this.getLevelDescription(this.assessLevel(input.evidence)),
                    strengths: ['能執行基本運算', '理解步驟順序'],
                    areasForGrowth: ['需加強概念抽象化', '建立與其他概念的連結'],
                    recommendations: this.getRecommendations(this.assessLevel(input.evidence)),
                })
            ),
        ];
    }

    private generateSocraticQuestion(stage: string, topic: string): string {
        const questions: Record<string, string> = {
            questioning: `關於「${topic}」，你認為最重要的特性是什麼？`,
            clarifying: `你能用自己的話解釋一下「${topic}」的意思嗎？`,
            probing: `如果改變某個條件，結果會有什麼不同？`,
            concluding: `根據我們的討論，你現在如何理解「${topic}」？`,
        };
        return questions[stage] || questions.questioning;
    }

    private generateDialogueHints(stage: string): string[] {
        const hints: Record<string, string[]> = {
            questioning: ['引導學生觀察', '提供具體例子'],
            clarifying: ['要求舉例說明', '比較不同案例'],
            probing: ['假設性問題', '反例思考'],
            concluding: ['總結重點', '連結新舊知識'],
        };
        return hints[stage] || hints.questioning;
    }

    private getNextDialogueStage(current: string): string {
        const sequence = ['questioning', 'clarifying', 'probing', 'concluding'];
        const idx = sequence.indexOf(current);
        return idx < sequence.length - 1 ? sequence[idx + 1] : 'questioning';
    }

    private getScaffoldType(stage: string): string {
        const types: Record<string, string> = {
            action: '具體操作引導',
            process: '步驟內化支援',
            object: '概念封裝協助',
            schema: '知識整合連結',
        };
        return types[stage] || '一般支援';
    }

    private getStageActivities(stage: string, concept: string): string[] {
        const activities: Record<string, string[]> = {
            action: [`操作「${concept}」的具體例子`, '按步驟完成計算', '使用視覺化工具'],
            process: [`心智模擬「${concept}」的過程`, '預測結果', '反向推導'],
            object: [`將「${concept}」視為可操作的對象`, '探索其性質', '分析結構'],
            schema: [`連結「${concept}」與相關概念`, '建立知識網絡', '應用於新情境'],
        };
        return activities[stage] || activities.action;
    }

    private getProgressIndicators(stage: string): string[] {
        const indicators: Record<string, string[]> = {
            action: ['能正確執行步驟', '理解操作順序'],
            process: ['能內化過程', '無需外部提示'],
            object: ['視為獨立概念', '能討論其性質'],
            schema: ['整合多個概念', '靈活應用'],
        };
        return indicators[stage] || [];
    }

    private assessLevel(evidence: string[]): 'action' | 'process' | 'object' | 'schema' {
        // 簡化評估邏輯：根據證據數量判斷
        if (evidence.length >= 4) return 'schema';
        if (evidence.length >= 3) return 'object';
        if (evidence.length >= 2) return 'process';
        return 'action';
    }

    private getLevelDescription(level: string): string {
        const descriptions: Record<string, string> = {
            action: '學生處於行動階段，需要具體步驟引導',
            process: '學生能內化過程，開始理解運算的意義',
            object: '學生能將概念視為獨立對象進行操作',
            schema: '學生能整合多個概念形成知識架構',
        };
        return descriptions[level] || '評估中';
    }

    private getRecommendations(level: string): string[] {
        const recommendations: Record<string, string[]> = {
            action: ['提供更多具體操作機會', '使用視覺化工具', '分解複雜步驟'],
            process: ['減少外部提示', '鼓勵心智模擬', '增加變式練習'],
            object: ['探索概念性質', '比較不同表徵', '討論數學結構'],
            schema: ['跨概念連結', '開放性問題', '真實情境應用'],
        };
        return recommendations[level] || [];
    }
}

export const aposConstructionAgent = new APOSConstructionAgent();
