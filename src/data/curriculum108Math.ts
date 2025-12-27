/**
 * 108 課綱 - 數學科知識架構
 * 
 * 資料來源：教育部 108 課綱
 * 主要涵蓋國小、國中、高中數學領域
 */

export interface CurriculumUnit {
    code: string;           // 課綱編碼，如 N-7-1
    title: string;          // 單元名稱
    description?: string;   // 詳細說明
    keywords?: string[];    // 關鍵字，用於 AI 匹配
}

export interface GradeLevel {
    grade: string;
    units: CurriculumUnit[];
}

export interface SchoolStage {
    stage: '國小' | '國中' | '高中';
    grades: GradeLevel[];
}

// ==================== 國小數學 ====================

const ELEMENTARY_MATH: GradeLevel[] = [
    {
        grade: '三年級',
        units: [
            { code: 'N-3-1', title: '萬以內的數', keywords: ['數字', '位值', '讀數', '寫數'] },
            { code: 'N-3-2', title: '加減法心算', keywords: ['加法', '減法', '心算'] },
            { code: 'N-3-3', title: '乘法直式計算', keywords: ['乘法', '直式', '計算'] },
            { code: 'N-3-4', title: '除法', keywords: ['除法', '整除', '餘數'] },
            { code: 'N-3-5', title: '分數的初步概念', keywords: ['分數', '分子', '分母'] },
            { code: 'S-3-1', title: '角', keywords: ['角', '直角', '銳角', '鈍角'] },
            { code: 'S-3-2', title: '正方形與長方形', keywords: ['正方形', '長方形', '周長'] },
        ],
    },
    {
        grade: '四年級',
        units: [
            { code: 'N-4-1', title: '一億以內的數', keywords: ['大數', '位值', '萬', '億'] },
            { code: 'N-4-2', title: '加減乘除的應用', keywords: ['四則運算', '應用問題'] },
            { code: 'N-4-3', title: '分數的加減', keywords: ['分數加法', '分數減法', '通分'] },
            { code: 'N-4-4', title: '小數', keywords: ['小數', '小數點', '十分位'] },
            { code: 'S-4-1', title: '角度', keywords: ['角度', '量角器', '度'] },
            { code: 'S-4-2', title: '三角形', keywords: ['三角形', '等腰', '等邊', '直角三角形'] },
            { code: 'S-4-3', title: '面積', keywords: ['面積', '平方公分', '平方公尺'] },
        ],
    },
    {
        grade: '五年級',
        units: [
            { code: 'N-5-1', title: '十進位結構', keywords: ['十進位', '大數', '位值'] },
            { code: 'N-5-2', title: '因數與倍數', keywords: ['因數', '倍數', '公因數', '公倍數'] },
            { code: 'N-5-3', title: '分數的乘法', keywords: ['分數乘法', '帶分數'] },
            { code: 'N-5-4', title: '小數的乘法', keywords: ['小數乘法', '小數點位移'] },
            { code: 'N-5-5', title: '四則混合運算', keywords: ['四則運算', '運算順序', '括號'] },
            { code: 'S-5-1', title: '平面圖形的面積', keywords: ['平行四邊形', '三角形面積', '梯形'] },
            { code: 'S-5-2', title: '體積', keywords: ['體積', '立方公分', '容積'] },
            { code: 'R-5-1', title: '比率', keywords: ['比率', '百分率', '折扣'] },
        ],
    },
    {
        grade: '六年級',
        units: [
            { code: 'N-6-1', title: '分數的四則運算', keywords: ['分數除法', '分數四則'] },
            { code: 'N-6-2', title: '小數的四則運算', keywords: ['小數除法', '小數四則'] },
            { code: 'N-6-3', title: '正負數', keywords: ['正數', '負數', '數線'] },
            { code: 'S-6-1', title: '圓', keywords: ['圓', '圓周率', '圓面積', '圓周長'] },
            { code: 'S-6-2', title: '複合圖形', keywords: ['複合圖形', '組合面積'] },
            { code: 'R-6-1', title: '比與比值', keywords: ['比', '比值', '相等的比'] },
            { code: 'R-6-2', title: '正比', keywords: ['正比', '比例', '比例式'] },
            { code: 'D-6-1', title: '統計圖表', keywords: ['長條圖', '折線圖', '圓形圖'] },
        ],
    },
];

// ==================== 國中數學 ====================

const JUNIOR_HIGH_MATH: GradeLevel[] = [
    {
        grade: '七年級',
        units: [
            { code: 'N-7-1', title: '整數的四則運算', keywords: ['整數', '四則運算', '運算順序'] },
            { code: 'N-7-2', title: '分數的四則運算', keywords: ['分數', '四則運算', '混合運算'] },
            { code: 'N-7-3', title: '一元一次方程式', keywords: ['方程式', '未知數', '解方程式'], description: '理解變數概念，學習列式與解一元一次方程式' },
            { code: 'N-7-4', title: '比例', keywords: ['比例', '比例式', '正比', '反比'] },
            { code: 'N-7-5', title: '數線與絕對值', keywords: ['數線', '絕對值', '相反數'] },
            { code: 'S-7-1', title: '點、線、面', keywords: ['點', '線', '面', '幾何基礎'] },
            { code: 'S-7-2', title: '角與平行線', keywords: ['角', '平行線', '垂直', '對頂角'] },
            { code: 'D-7-1', title: '統計量', keywords: ['平均數', '中位數', '眾數'] },
        ],
    },
    {
        grade: '八年級',
        units: [
            { code: 'N-8-1', title: '乘法公式', keywords: ['乘法公式', '平方差', '完全平方'] },
            { code: 'N-8-2', title: '因式分解', keywords: ['因式分解', '提公因式', '十字交乘'] },
            { code: 'A-8-1', title: '二元一次方程組', keywords: ['二元一次', '方程組', '代入消去法', '加減消去法', '二元一次方程式', '聯立方程式'], description: '學習二元一次聯立方程組的解法與應用' },
            { code: 'A-8-2', title: '一次函數', keywords: ['函數', '一次函數', '圖形', '斜率'] },
            { code: 'A-8-3', title: '一次不等式', keywords: ['不等式', '解不等式', '不等號'] },
            { code: 'S-8-1', title: '三角形的性質', keywords: ['三角形', '全等', '三角形內角'] },
            { code: 'S-8-2', title: '平行四邊形', keywords: ['平行四邊形', '對角線', '性質'] },
            { code: 'S-8-3', title: '畢氏定理', keywords: ['畢氏定理', '勾股定理', '直角三角形'] },
        ],
    },
    {
        grade: '九年級',
        units: [
            { code: 'N-9-1', title: '平方根與實數', keywords: ['平方根', '根號', '實數', '無理數'] },
            { code: 'N-9-2', title: '科學記號', keywords: ['科學記號', '次方', '大數小數'] },
            { code: 'A-9-1', title: '一元二次方程式', keywords: ['一元二次', '配方法', '公式解', '判別式'], description: '學習一元二次方程式的各種解法' },
            { code: 'A-9-2', title: '二次函數', keywords: ['二次函數', '拋物線', '頂點', '對稱軸'] },
            { code: 'S-9-1', title: '相似形', keywords: ['相似', '相似三角形', '比例'] },
            { code: 'S-9-2', title: '圓', keywords: ['圓', '弦', '弧', '切線', '圓心角'] },
            { code: 'S-9-3', title: '三角比', keywords: ['三角比', '正弦', '餘弦', '正切'] },
            { code: 'D-9-1', title: '機率', keywords: ['機率', '隨機', '樣本空間'] },
        ],
    },
];

// ==================== 高中數學 ====================

const SENIOR_HIGH_MATH: GradeLevel[] = [
    {
        grade: '高一',
        units: [
            { code: 'N-10-1', title: '實數與數線', keywords: ['實數', '數線', '絕對值', '區間'] },
            { code: 'N-10-2', title: '指數與對數', keywords: ['指數', '對數', '指數律', '對數律'] },
            { code: 'A-10-1', title: '多項式', keywords: ['多項式', '餘式定理', '因式定理'] },
            { code: 'A-10-2', title: '方程式', keywords: ['方程式', '二次方程式', '高次方程式'] },
            { code: 'A-10-3', title: '不等式', keywords: ['不等式', '二次不等式', '絕對值不等式'] },
            { code: 'F-10-1', title: '數列與級數', keywords: ['數列', '等差', '等比', '級數'] },
            { code: 'S-10-1', title: '直線方程式', keywords: ['直線', '斜率', '截距', '平行垂直'] },
            { code: 'S-10-2', title: '圓方程式', keywords: ['圓方程式', '圓心', '半徑'] },
        ],
    },
    {
        grade: '高二',
        units: [
            { code: 'N-11-1', title: '三角函數', keywords: ['三角函數', '弧度', '週期', '圖形'] },
            { code: 'N-11-2', title: '三角恆等式', keywords: ['和差化積', '積化和差', '倍角公式'] },
            { code: 'A-11-1', title: '指數與對數函數', keywords: ['指數函數', '對數函數', '應用'] },
            { code: 'S-11-1', title: '向量', keywords: ['向量', '內積', '向量運算'] },
            { code: 'S-11-2', title: '空間概念', keywords: ['空間', '平面方程式', '直線方程式'] },
            { code: 'S-11-3', title: '圓錐曲線', keywords: ['拋物線', '橢圓', '雙曲線'] },
            { code: 'D-11-1', title: '排列組合', keywords: ['排列', '組合', '階乘'] },
            { code: 'D-11-2', title: '機率', keywords: ['機率', '條件機率', '獨立事件'] },
        ],
    },
    {
        grade: '高三',
        units: [
            { code: 'A-12-1', title: '矩陣', keywords: ['矩陣', '行列式', '線性方程組'] },
            { code: 'A-12-2', title: '極限', keywords: ['極限', '連續', '無窮'] },
            { code: 'A-12-3', title: '微分', keywords: ['微分', '導數', '切線', '極值'] },
            { code: 'A-12-4', title: '積分', keywords: ['積分', '定積分', '面積', '體積'] },
            { code: 'D-12-1', title: '統計', keywords: ['統計', '常態分布', '信賴區間'] },
        ],
    },
];

// ==================== 完整課綱資料 ====================

export const CURRICULUM_108_MATH: SchoolStage[] = [
    { stage: '國小', grades: ELEMENTARY_MATH },
    { stage: '國中', grades: JUNIOR_HIGH_MATH },
    { stage: '高中', grades: SENIOR_HIGH_MATH },
];

// ==================== 輔助函數 ====================

/**
 * 根據關鍵字搜尋課綱單元
 */
export function searchCurriculumByKeyword(keyword: string): CurriculumUnit[] {
    const results: CurriculumUnit[] = [];
    const lowerKeyword = keyword.toLowerCase();

    for (const stage of CURRICULUM_108_MATH) {
        for (const grade of stage.grades) {
            for (const unit of grade.units) {
                const matchTitle = unit.title.toLowerCase().includes(lowerKeyword);
                const matchKeywords = unit.keywords?.some(k => k.includes(lowerKeyword));
                const matchCode = unit.code.toLowerCase().includes(lowerKeyword);

                if (matchTitle || matchKeywords || matchCode) {
                    results.push({
                        ...unit,
                        description: `${stage.stage} ${grade.grade} - ${unit.title}`,
                    });
                }
            }
        }
    }

    return results;
}

/**
 * 根據課綱編碼取得單元
 */
export function getCurriculumByCode(code: string): { stage: string; grade: string; unit: CurriculumUnit } | null {
    for (const stage of CURRICULUM_108_MATH) {
        for (const grade of stage.grades) {
            const unit = grade.units.find(u => u.code === code);
            if (unit) {
                return { stage: stage.stage, grade: grade.grade, unit };
            }
        }
    }
    return null;
}

/**
 * 取得所有年級列表
 */
export function getAllGrades(): { stage: string; grade: string }[] {
    const grades: { stage: string; grade: string }[] = [];
    for (const stage of CURRICULUM_108_MATH) {
        for (const grade of stage.grades) {
            grades.push({ stage: stage.stage, grade: grade.grade });
        }
    }
    return grades;
}
