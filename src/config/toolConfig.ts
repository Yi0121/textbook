import {
  MousePointer2, Hand, PenTool, Highlighter, Type, Eraser,
  Zap, Timer, Grid2X2, LayoutDashboard, Dices,
  Focus, Sparkles, Scan, Bot, Users
} from 'lucide-react';

// --- 定義型別 ---

export type UserRole = 'teacher' | 'student' | 'all';
export type ToolCategory = 'editor' | 'navigation' | 'widget' | 'system' | 'ai';
export type ActionType = 'set-tool' | 'toggle' | 'modal' | 'menu';

export interface ToolConfig {
  id: string;              // 唯一識別碼
  label: string;           // 提示文字
  icon: any;               // Icon 元件
  role: UserRole;          // 權限角色
  isCore: boolean;         // 是否為核心工具 (不可隱藏)
  category: ToolCategory;  // 分類 (用於分組顯示)
  actionType: ActionType;  // 行為模式
  targetStateValue?: string; // 對應到 currentTool 的字串值
  hasSubMenu?: boolean;    // 是否有右鍵/長按選單
  activeColorClass?: string; // 啟動時的顏色樣式
}

// --- 工具清單設定 ---

export const ALL_TOOLS: ToolConfig[] = [
  // === 1. 基礎編輯器 (核心) ===
  {
    id: 'cursor',
    label: '一般選取',
    icon: MousePointer2,
    role: 'all',
    isCore: true,
    category: 'editor',
    actionType: 'set-tool',
    targetStateValue: 'cursor'
  },
 {
    id: 'select',
    label: '範圍選取',
    icon: Scan,
    role: 'all',
    isCore: true,
    category: 'editor',
    actionType: 'set-tool',
    targetStateValue: 'select'
  },
  {
    id: 'pan',
    label: '平移畫布',
    icon: Hand,
    role: 'all',
    isCore: true,
    category: 'editor',
    actionType: 'set-tool',
    targetStateValue: 'pan'
  },
  {
    id: 'pen',
    label: '畫筆',
    icon: PenTool,
    role: 'all',
    isCore: true,
    category: 'editor',
    actionType: 'set-tool',
    targetStateValue: 'pen',
    hasSubMenu: true,
    activeColorClass: 'bg-indigo-50 text-indigo-600'
  },
  {
    id: 'highlighter',
    label: '螢光筆',
    icon: Highlighter,
    role: 'all',
    isCore: true,
    category: 'editor',
    actionType: 'set-tool',
    targetStateValue: 'highlighter',
    hasSubMenu: true,
    activeColorClass: 'bg-yellow-50 text-yellow-600'
  },
  {
    id: 'text',
    label: '文字',
    icon: Type,
    role: 'all',
    isCore: true,
    category: 'editor',
    actionType: 'set-tool',
    targetStateValue: 'text',
    hasSubMenu: true
  },
  {
    id: 'eraser',
    label: '橡皮擦',
    icon: Eraser,
    role: 'all',
    isCore: true,
    category: 'editor',
    actionType: 'set-tool',
    targetStateValue: 'eraser',
    activeColorClass: 'bg-rose-50 text-rose-600'
  },

  // === 2. 老師專用工具 (預設顯示) ===
  {
    id: 'laser',
    label: '雷射筆',
    icon: Zap,
    role: 'teacher',
    isCore: false, 
    category: 'editor',
    actionType: 'set-tool',
    targetStateValue: 'laser',
    activeColorClass: 'bg-red-50 text-red-600'
  },
  {
    id: 'timer',
    label: '計時器',
    icon: Timer,
    role: 'teacher',
    isCore: false,
    category: 'widget',
    actionType: 'toggle'
  },
  {
    id: 'dashboard',
    label: '學習數據',
    icon: LayoutDashboard,
    role: 'teacher',
    isCore: false,
    category: 'system',
    actionType: 'toggle'  // 修正: 從 modal 改為 toggle
  },
  {
    id: 'ai_console',
    label: 'AI 中控台',
    icon: Bot,
    role: 'teacher',
    isCore: true,     // 這是老師的核心功能
    category: 'ai',
    actionType: 'toggle',
    activeColorClass: 'bg-indigo-50 text-indigo-600'
  },
  
  // === 3. 課堂互動小工具 (收納在百寶箱或獨立顯示) ===
  {
    id: 'nav_grid',
    label: '章節導航',
    icon: Grid2X2,
    role: 'teacher',
    isCore: false,
    category: 'navigation',
    actionType: 'toggle'
  },
  {
    id: 'lucky_draw',
    label: '隨機抽籤',
    icon: Dices,
    role: 'teacher',
    isCore: false,
    category: 'widget',
    actionType: 'toggle'
  },
  {
    id: 'spotlight',
    label: '聚光燈',
    icon: Focus,
    role: 'teacher',
    isCore: false,
    category: 'widget',
    actionType: 'toggle'
  },

  // === 4. 學生專用工具 ===
  {
    id: 'ai_tutor',
    label: 'AI 家教',
    icon: Sparkles,
    role: 'student',
    isCore: true, // 學生端的核心功能
    category: 'ai',
    actionType: 'toggle',
    activeColorClass: 'bg-purple-50 text-purple-600'
  },

  // === 5. 協作工具 ===
  {
    id: 'whiteboard',
    label: '電子白板',
    icon: Users,
    role: 'teacher',
    isCore: false,
    category: 'widget',
    actionType: 'toggle',
    activeColorClass: 'bg-indigo-50 text-indigo-600'
  }

];

// --- Helper Functions ---

export const getDefaultToolbarState = (role: UserRole): string[] => {
  // 這裡定義哪些工具是「預設」就會出現在工具列上的
  const defaultTools = [
    'cursor', 'select', 'pan', // 基礎
    'pen', 'highlighter', 'text', 'eraser', // 編輯
  ];

  if (role === 'teacher') {
    return [...defaultTools, 'laser', 'timer', 'dashboard','ai_console','nav_grid'];
  }
  
  if (role === 'student') {
    return [...defaultTools, 'ai_tutor'];
  }

  return defaultTools;
};