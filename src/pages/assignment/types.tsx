import React from 'react';
import { Sparkles, Users } from 'lucide-react';

// ==================== Types ====================
export interface Methodology {
    id: string;
    title: string;
    description: string;
    features: string[];
    suitableFor: string;
    color: string;
    icon: React.ReactNode;
}

export interface MethodDistribution {
    id: string;
    count: number;
    percent: number;
}

export interface StudentStats {
    total: number;
    submitted: number;
    methodDistribution: MethodDistribution[];
}

// ==================== Mock Data ====================
export const METHODOLOGIES: Methodology[] = [
    {
        id: 'standard',
        title: '解法 1：標準除法 (低創造門檻)',
        description: '24 ÷ 4 = 6',
        features: ['程序正確，但思考單一路徑'],
        suitableFor: 'Action 階段學生',
        color: 'bg-blue-50 border-blue-200 text-blue-700',
        icon: <div className="text-xl font-mono font-bold">÷</div>
    },
{
    id: 'subtraction',
        title: '解法 2：重複減法',
            description: '24 − 4 − 4... = 0 (減6次)',
                features: ['除法本質是重複減法', '連結概念：乘除互逆', '能「轉換表徵」'],
                    suitableFor: '強化觀念',
                        color: 'bg-green-50 border-green-200 text-green-700',
                            icon: <div className="text-xl font-mono font-bold" >−</div>
},
{
    id: 'multiplication',
        title: '解法 3：乘法反推',
            description: '4 × 6 = 24',
                features: ['強化乘除關係'],
                    suitableFor: 'Process → Object 過渡',
                        color: 'bg-purple-50 border-purple-200 text-purple-700',
                            icon: <div className="text-xl font-mono font-bold" >×</div>
},
{
    id: 'decomposition',
        title: '解法 4：先拆再分 (高價值)',
            description: '24 = 20 + 4',
                features: ['策略：數字拆解 + 分別運算', '創造力重要指標'],
                    suitableFor: '高階思考',
                        color: 'bg-amber-50 border-amber-200 text-amber-700',
                            icon: <Sparkles className="w-5 h-5" />
    },
{
    id: 'grouping',
        title: '解法 5：等量分組 (圖像/心算)',
            description: '先給2顆...再給4顆...',
                features: ['不靠公式，靠策略', '非常適合國小學生'],
                    suitableFor: '直觀思考',
                        color: 'bg-rose-50 border-rose-200 text-rose-700',
                            icon: <Users className="w-5 h-5" />
    }
];

export const STUDENT_STATS: StudentStats = {
    total: 28,
    submitted: 24,
    methodDistribution: [
        { id: 'standard', count: 10, percent: 42 },
        { id: 'subtraction', count: 5, percent: 21 },
        { id: 'multiplication', count: 6, percent: 25 },
        { id: 'decomposition', count: 2, percent: 8 },
        { id: 'grouping', count: 1, percent: 4 },
    ]
};
