/**
 * CPS TopBar - Navigation bar for CPS learning flow
 */

import React from 'react';
import { ChevronRight } from 'lucide-react';

export type Stage = 'S2' | 'S3' | 'S4' | 'S5' | 'S6';

export interface StageConfig {
    id: Stage;
    label: string;
    description: string;
    role?: string;
    color: string;
}

export const STAGES: StageConfig[] = [
    { id: 'S2', label: '課前自學', description: '影片與前測', color: 'bg-blue-500' },
    { id: 'S3', label: '個人解題', description: '圓周實測', color: 'bg-blue-600' },
    { id: 'S4', label: '組內共學', description: '協作與共識', role: 'A1 提案者', color: 'bg-orange-500' },
    { id: 'S5', label: '組間互學', description: '發表與互評', role: 'D2 評分員', color: 'bg-green-500' },
    { id: 'S6', label: '總結課後', description: '反思與報告', color: 'bg-purple-500' },
];

interface TopBarProps {
    currentStage: Stage;
    setStage: (s: Stage) => void;
}

export const TopBar = ({ currentStage, setStage }: TopBarProps) => {
    const activeStageInfo = STAGES.find(s => s.id === currentStage);

    return (
        <div className="h-16 bg-white border-b border-slate-200 flex items-center px-6 justify-between shadow-sm z-20">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                        CPS
                    </div>
                    <span className="font-bold text-slate-700 text-lg">圓周長</span>
                </div>

                {/* Progress Stepper */}
                <div className="flex items-center bg-slate-50 rounded-full px-2 py-1 border border-slate-100">
                    {STAGES.map((stage, idx) => {
                        const isActive = stage.id === currentStage;
                        const isPast = STAGES.findIndex(s => s.id === currentStage) > idx;

                        return (
                            <React.Fragment key={stage.id}>
                                <button
                                    onClick={() => setStage(stage.id)}
                                    className={`
                                        flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold transition-all
                                        ${isActive ? `${stage.color} text-white shadow-md` : isPast ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-300'}
                                    `}
                                >
                                    <span>{stage.label}</span>
                                </button>
                                {idx < STAGES.length - 1 && (
                                    <ChevronRight size={14} className="text-slate-300 mx-1" />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            {/* User State / Role */}
            <div className="flex items-center gap-4">
                {activeStageInfo?.role && (
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${activeStageInfo.color} bg-opacity-10 text-${activeStageInfo.color.split('-')[1]}-700 border border-${activeStageInfo.color.split('-')[1]}-200`}>
                        Role: {activeStageInfo.role}
                    </div>
                )}
                <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-slate-500 font-bold text-xs ring-2 ring-indigo-50">
                    ST
                </div>
            </div>
        </div>
    );
};
