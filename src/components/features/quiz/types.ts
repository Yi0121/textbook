// Quiz Feature - Types and Mock Data

export type Stage = 'solve' | 'pose' | 'explore';

export interface StageInfo {
    id: Stage;
    title: string;
    subtitle: string;
}

export const STAGES: StageInfo[] = [
    { id: 'solve', title: '挑戰 1：解題', subtitle: '算出正確答案' },
    { id: 'pose', title: '挑戰 2：我是出題者', subtitle: '設計你的題目' },
    { id: 'explore', title: '挑戰 3：開放探索', subtitle: '發現數字的秘密' },
];
