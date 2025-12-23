/**
 * Mock AI Provider
 * 
 * 用於開發與測試的模擬 AI 供應商
 */

import type { AIProvider, Message, ChatOptions, ChatResponse, StreamChunk } from '../api/aiProvider';
import { registerProvider } from '../api/aiProvider';

// ==================== Mock Responses ====================

const MOCK_RESPONSES: Record<string, string> = {
    default: '這是一個模擬回應。實際部署時會連接真實的 AI 服務。',
    greeting: '你好！我是 AI 學習助教，有什麼可以幫助你的嗎？',
    explanation: '讓我來解釋這個概念...',
    exercise: '這裡有一些練習題讓你練習：\n1. 問題一\n2. 問題二\n3. 問題三',
    feedback: '做得好！你的答案是正確的。',
};

/**
 * Mock AI Provider 實作
 */
class MockProvider implements AIProvider {
    name = 'mock';
    private delay: number;

    constructor(options?: { delay?: number }) {
        this.delay = options?.delay ?? 500;
    }

    async chat(messages: Message[], _options?: ChatOptions): Promise<ChatResponse> {
        await this.simulateDelay();

        // 根據最後一條訊息內容決定回應
        const lastMessage = messages[messages.length - 1];
        const response = this.generateResponse(lastMessage?.content || '');

        return {
            content: response,
            usage: {
                promptTokens: this.estimateTokens(messages.map(m => m.content).join(' ')),
                completionTokens: this.estimateTokens(response),
                totalTokens: 0, // Will be calculated
            },
            finishReason: 'stop',
        };
    }

    async *streamChat(messages: Message[], _options?: ChatOptions): AsyncGenerator<StreamChunk> {
        const response = this.generateResponse(messages[messages.length - 1]?.content || '');
        const words = response.split(' ');

        for (let i = 0; i < words.length; i++) {
            await this.simulateDelay(50);
            yield {
                content: words[i] + (i < words.length - 1 ? ' ' : ''),
                done: i === words.length - 1,
            };
        }
    }

    async healthCheck(): Promise<boolean> {
        return true;
    }

    // ==================== Private Methods ====================

    private async simulateDelay(ms?: number): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, ms ?? this.delay));
    }

    private generateResponse(input: string): string {
        const lowerInput = input.toLowerCase();

        if (lowerInput.includes('你好') || lowerInput.includes('hello')) {
            return MOCK_RESPONSES.greeting;
        }
        if (lowerInput.includes('解釋') || lowerInput.includes('explain')) {
            return MOCK_RESPONSES.explanation;
        }
        if (lowerInput.includes('練習') || lowerInput.includes('exercise')) {
            return MOCK_RESPONSES.exercise;
        }
        if (lowerInput.includes('正確') || lowerInput.includes('correct')) {
            return MOCK_RESPONSES.feedback;
        }

        return MOCK_RESPONSES.default;
    }

    private estimateTokens(text: string): number {
        // 簡單估算：每 4 個字元約 1 個 token
        return Math.ceil(text.length / 4);
    }
}

// ==================== Registration ====================

registerProvider('mock', () => new MockProvider());

// ==================== Export ====================

export { MockProvider };
