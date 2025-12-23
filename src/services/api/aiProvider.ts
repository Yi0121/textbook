/**
 * AIProvider 介面定義
 * 
 * 提供統一的 AI 服務抽象，支援：
 * - 多種 AI 供應商（OpenAI, Gemini, Mock）
 * - 串流/非串流回應
 * - 結構化輸出
 */

// ==================== Types ====================

export interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface ChatOptions {
    temperature?: number;
    maxTokens?: number;
    stopSequences?: string[];
}

export interface ChatResponse {
    content: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
    finishReason?: 'stop' | 'length' | 'tool_calls';
}

export interface StreamChunk {
    content: string;
    done: boolean;
}

// ==================== AIProvider Interface ====================

export interface AIProvider {
    /** 供應商名稱 */
    name: string;

    /** 非串流對話 */
    chat(messages: Message[], options?: ChatOptions): Promise<ChatResponse>;

    /** 串流對話 */
    streamChat(messages: Message[], options?: ChatOptions): AsyncGenerator<StreamChunk>;

    /** 文字嵌入 (可選) */
    embed?(text: string): Promise<number[]>;

    /** 檢查服務狀態 */
    healthCheck(): Promise<boolean>;
}

// ==================== Provider Registry ====================

type ProviderFactory = () => AIProvider;

const providerRegistry = new Map<string, ProviderFactory>();

/**
 * 註冊 AI 供應商
 */
export function registerProvider(name: string, factory: ProviderFactory): void {
    providerRegistry.set(name, factory);
}

/**
 * 取得 AI 供應商
 */
export function getProvider(name: string): AIProvider {
    const factory = providerRegistry.get(name);
    if (!factory) {
        throw new Error(`AI Provider "${name}" is not registered`);
    }
    return factory();
}

/**
 * 列出所有已註冊的供應商
 */
export function listProviders(): string[] {
    return Array.from(providerRegistry.keys());
}

// ==================== Default Export ====================

export type { AIProvider as default };
