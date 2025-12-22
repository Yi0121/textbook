/**
 * ContentGeneratorAgent - 內容生成 Agent
 * 
 * 職責：
 * - 生成文字教材
 * - 生成練習題與測驗
 * - 生成多模態素材
 * - 整合現有 learningPathService
 */

import { BaseAgent } from '../BaseAgent';
import type { AgentId, AgentCategory, AgentTool, ToolInput } from '../types';
import {
    analyzeStudentAndGeneratePath,
    generateContentForKnowledgeNode,
} from '../../services/ai/learningPathService';
import type { StudentLearningRecord } from '../../types';

// ==================== Tool Input Types ====================

interface GenerateTextContentInput extends ToolInput {
    topic: string;
    style?: 'formal' | 'casual' | 'tutorial';
    length?: 'short' | 'medium' | 'long';
}

interface GenerateExerciseInput extends ToolInput {
    topic: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    count?: number;
    type?: 'multiple-choice' | 'fill-blank' | 'short-answer';
}

interface GenerateQuizInput extends ToolInput {
    topic: string;
    questionCount?: number;
    duration?: number; // 分鐘
    passingScore?: number;
}

interface GenerateMultimediaInput extends ToolInput {
    topic: string;
    type: 'image' | 'video' | 'diagram';
    description?: string;
}

interface PreviewMaterialInput extends ToolInput {
    materialId: string;
}

interface AnalyzeAndGeneratePathInput extends ToolInput {
    studentRecord: StudentLearningRecord;
}

interface GenerateKnowledgeContentInput extends ToolInput {
    nodeId: string;
    nodeName: string;
}

// ==================== Tool Output Types ====================

interface GeneratedContent {
    id: string;
    content: string;
    createdAt: number;
}

interface GeneratedExercise {
    id: string;
    question: string;
    options?: string[];
    answer: string;
    difficulty: string;
}

interface GeneratedQuiz {
    id: string;
    title: string;
    questions: GeneratedExercise[];
    duration: number;
    passingScore: number;
}

// ==================== Agent Implementation ====================

export class ContentGeneratorAgent extends BaseAgent {
    readonly id: AgentId = 'content-generator';
    readonly name = '內容生成 Agent';
    readonly category: AgentCategory = 'teacher';

    protected defineTools(): AgentTool[] {
        return [
            this.createMockTool<GenerateTextContentInput, GeneratedContent>(
                'generate_text_content',
                '生成文字教材內容',
                (input) => ({
                    id: `content-${Date.now()}`,
                    content: `【${input.topic}】\n\n這是關於「${input.topic}」的${input.style || '正式'}風格教材內容。\n\n（此為 Mock 資料，實際內容將由 AI 生成）`,
                    createdAt: Date.now(),
                })
            ),

            this.createMockTool<GenerateExerciseInput, GeneratedExercise[]>(
                'generate_exercise',
                '生成練習題',
                (input) => {
                    const count = input.count || 3;
                    return Array.from({ length: count }, (_, i) => ({
                        id: `exercise-${Date.now()}-${i}`,
                        question: `關於「${input.topic}」的第 ${i + 1} 題 (${input.difficulty || 'medium'})`,
                        options: input.type === 'multiple-choice'
                            ? ['選項 A', '選項 B', '選項 C', '選項 D']
                            : undefined,
                        answer: '正確答案',
                        difficulty: input.difficulty || 'medium',
                    }));
                }
            ),

            this.createMockTool<GenerateQuizInput, GeneratedQuiz>(
                'generate_quiz',
                '生成完整測驗',
                (input) => ({
                    id: `quiz-${Date.now()}`,
                    title: `${input.topic} 測驗`,
                    questions: Array.from({ length: input.questionCount || 5 }, (_, i) => ({
                        id: `q-${i}`,
                        question: `測驗題目 ${i + 1}`,
                        options: ['A', 'B', 'C', 'D'],
                        answer: 'A',
                        difficulty: 'medium',
                    })),
                    duration: input.duration || 30,
                    passingScore: input.passingScore || 60,
                })
            ),

            this.createMockTool<GenerateMultimediaInput, { id: string; url: string; type: string }>(
                'generate_multimedia',
                '生成多模態素材（圖片/影片/圖表）',
                (input) => ({
                    id: `media-${Date.now()}`,
                    url: `https://example.com/media/${input.type}/${Date.now()}`,
                    type: input.type,
                })
            ),

            this.createMockTool<PreviewMaterialInput, { found: boolean; preview: string }>(
                'preview_material',
                '預覽教材內容',
                (input) => ({
                    found: true,
                    preview: `教材 ${input.materialId} 的預覽內容...`,
                })
            ),

            // 整合現有服務的真實 Tool
            {
                name: 'analyze_and_generate_path',
                description: '分析學生學習記錄並生成個人化學習路徑',
                execute: async (input: AnalyzeAndGeneratePathInput) => {
                    return analyzeStudentAndGeneratePath(input.studentRecord);
                },
            },

            {
                name: 'generate_knowledge_content',
                description: '根據知識節點生成補充內容',
                execute: async (input: GenerateKnowledgeContentInput) => {
                    return generateContentForKnowledgeNode(input.nodeId, input.nodeName);
                },
            },
        ];
    }
}

/**
 * ContentGeneratorAgent 單例
 */
export const contentGeneratorAgent = new ContentGeneratorAgent();
