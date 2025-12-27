/**
 * 教學法資料
 * 
 * 定義可選用的教學法/教學策略
 */

export interface PedagogyMethod {
    id: string;
    name: string;
    nameEn: string;
    description: string;
    stages: string[];           // 適用的學習階段
    icon: string;               // emoji icon
    color: string;              // 主題色
    characteristics: string[];  // 特色說明
}

export const PEDAGOGY_METHODS: PedagogyMethod[] = [
    {
        id: 'four-learning',
        name: '四學',
        nameEn: 'Four-Stage Learning',
        description: '自學 → 互學 → 導學 → 共學，強調學生自主探索與合作學習',
        stages: ['導入', '探索', '引導', '統整'],
        icon: '🔄',
        color: '#6366f1', // indigo
        characteristics: [
            '自學：學生自主預習與探索',
            '互學：同儕討論與交流',
            '導學：教師引導與澄清',
            '共學：全班統整與分享',
        ],
    },
    {
        id: 'apos',
        name: 'APOS 理論',
        nameEn: 'APOS Theory',
        description: 'Action → Process → Object → Schema，數學概念發展理論',
        stages: ['行動', '過程', '物件', '基模'],
        icon: '🧠',
        color: '#8b5cf6', // violet
        characteristics: [
            'Action：具體操作與執行步驟',
            'Process：內化為心智過程',
            'Object：將過程視為可操作的物件',
            'Schema：整合為概念結構',
        ],
    },
    {
        id: 'cps',
        name: '合作問題解決',
        nameEn: 'Collaborative Problem Solving',
        description: '透過小組合作解決真實情境問題，培養溝通與協作能力',
        stages: ['問題理解', '策略規劃', '分工執行', '反思整合'],
        icon: '🤝',
        color: '#0ea5e9', // sky
        characteristics: [
            '建立共識：理解問題與目標',
            '分工協作：各司其職',
            '溝通協調：即時溝通與調整',
            '共同反思：檢討與改進',
        ],
    },
    {
        id: 'inquiry',
        name: '探究式學習',
        nameEn: 'Inquiry-Based Learning',
        description: '以問題或假設出發，引導學生自主探究與發現',
        stages: ['提問', '假設', '探究', '結論'],
        icon: '🔍',
        color: '#14b8a6', // teal
        characteristics: [
            '引發好奇心與問題意識',
            '培養假設與驗證能力',
            '強調實作與觀察',
            '發展批判性思考',
        ],
    },
    {
        id: 'pbl',
        name: '專題導向學習',
        nameEn: 'Project-Based Learning',
        description: '以專題任務為核心，整合知識與技能完成作品',
        stages: ['任務分析', '資料蒐集', '作品製作', '成果發表'],
        icon: '📋',
        color: '#f59e0b', // amber
        characteristics: [
            '真實情境任務',
            '跨領域整合',
            '長期規劃與執行',
            '作品產出導向',
        ],
    },
    {
        id: 'direct',
        name: '直接教學法',
        nameEn: 'Direct Instruction',
        description: '教師主導的結構化教學，適合基礎概念與技能傳授',
        stages: ['說明', '示範', '練習', '評量'],
        icon: '📚',
        color: '#64748b', // slate
        characteristics: [
            '清晰明確的教學目標',
            '教師示範與講解',
            '充分的練習機會',
            '即時回饋與修正',
        ],
    },
    {
        id: 'flipped',
        name: '翻轉教室',
        nameEn: 'Flipped Classroom',
        description: '課前預習影片，課堂進行討論與實作',
        stages: ['課前預習', '課中實作', '討論解惑', '延伸應用'],
        icon: '🔃',
        color: '#ec4899', // pink
        characteristics: [
            '學生課前自學',
            '課堂時間用於深度學習',
            '個別化學習步調',
            '教師成為引導者',
        ],
    },
];

/**
 * 根據 ID 取得教學法
 */
export function getPedagogyById(id: string): PedagogyMethod | undefined {
    return PEDAGOGY_METHODS.find(p => p.id === id);
}

/**
 * 取得所有教學法名稱（用於快速選擇）
 */
export function getPedagogyNames(): { id: string; name: string; icon: string }[] {
    return PEDAGOGY_METHODS.map(p => ({ id: p.id, name: p.name, icon: p.icon }));
}
