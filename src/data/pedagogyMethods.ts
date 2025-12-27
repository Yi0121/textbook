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
        stages: ['自學', '互學', '導學', '共學'],
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
        stages: ['Action', 'Process', 'Object', 'Schema'],
        icon: '🧠',
        color: '#8b5cf6', // violet
        characteristics: [
            'Action：具體操作與執行步驟',
            'Process：內化為心智過程',
            'Object：將過程視為可操作的物件',
            'Schema：整合為概念結構',
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
