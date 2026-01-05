/**
 * 環境變數配置
 * 
 * 型別安全的環境變數存取
 */

// ==================== Types ====================

interface EnvConfig {
    // API
    apiBaseUrl: string;

    // MCP
    useMcp: boolean;
    mcpServerUrl: string;

    // Feature Flags
    devTools: boolean;
    useMock: boolean;

    // Mode
    isDev: boolean;
    isProd: boolean;
}

// ==================== Parser ====================

function parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
    if (value === undefined || value === '') return defaultValue;
    return value.toLowerCase() === 'true';
}

// ==================== Config ====================

export const env: EnvConfig = {
    // API
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '',

    // MCP
    useMcp: parseBoolean(import.meta.env.VITE_USE_MCP, false),
    mcpServerUrl: import.meta.env.VITE_MCP_SERVER_URL || '',

    // Feature Flags
    devTools: parseBoolean(import.meta.env.VITE_DEV_TOOLS, import.meta.env.DEV),
    useMock: parseBoolean(import.meta.env.VITE_USE_MOCK, true),

    // Mode
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD,
};

// ==================== Validation (Dev Only) ====================

if (env.isDev) {
    console.log('[Config] Environment:', {
        mode: env.isProd ? 'production' : 'development',
        useMcp: env.useMcp,
        useMock: env.useMock,
        apiBaseUrl: env.apiBaseUrl || '(not set)',
    });
}
