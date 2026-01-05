// Types and mock data for Division Exploration Page

export type ViewTab = 'overview' | 'advanced';

export interface StudentInfo {
    name: string;
    class: string;
    systemTag: string;
    taskName: string;
}

export interface TimeDataItem {
    name: string;
    duration: number;
    label: string;
    color: string;
}

export interface AbilityDataItem {
    subject: string;
    individual: number;
    class: number;
}

export interface PRStatItem {
    label: string;
    pr: number | null;
    status: 'normal' | 'not-tested';
}

// ==================== Mock Data ====================

export const studentInfo: StudentInfo = {
    name: '王小明',
    class: '資優班',
    systemTag: '個人化教育計劃 DB',
    taskName: '除法探究第八題'
};

export const timeData: TimeDataItem[] = [
    { name: '個人平均', duration: 80, label: '1分20秒', color: '#6366f1' },
    { name: '全班平均', duration: 110, label: '1分50秒', color: '#94a3b8' },
];

export const abilityData: AbilityDataItem[] = [
    { subject: '流暢性', individual: 1.1, class: 1.2 },
    { subject: '變通性', individual: 1.53, class: 1.2 },
    { subject: '精密性', individual: 0.83, class: 0.51 },
];

export const prStats: PRStatItem[] = [
    { label: '工作記憶廣度 Test', pr: 75, status: 'normal' },
    { label: '變通性前測', pr: 65, status: 'normal' },
    { label: '變通性後測', pr: null, status: 'not-tested' },
];
