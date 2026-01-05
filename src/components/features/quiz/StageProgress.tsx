import { CheckCircle2 } from 'lucide-react';
import { STAGES, type Stage } from './types';

interface StageProgressProps {
    currentStage: Stage;
}

export function StageProgress({ currentStage }: StageProgressProps) {
    const currentIdx = STAGES.findIndex(s => s.id === currentStage);

    return (
        <div className="flex items-center justify-between max-w-2xl mx-auto mb-10 px-4">
            {STAGES.map((stage, idx) => {
                const isActive = idx === currentIdx;
                const isCompleted = idx < currentIdx;

                return (
                    <div key={stage.id} className="flex items-center relative flex-1 last:flex-none">
                        <div className={`
                            relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 
                            transition-all duration-300
                            ${isActive
                                ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-200 scale-110'
                                : isCompleted
                                    ? 'bg-green-100 border-green-500 text-green-600'
                                    : 'bg-white border-gray-200 text-gray-300'
                            }
                        `}>
                            {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <span className="font-bold">{idx + 1}</span>}
                        </div>

                        <div className={`ml-3 ${isActive ? 'block' : 'hidden lg:block'}`}>
                            <p className={`text-sm font-bold ${isActive ? 'text-purple-700' : 'text-gray-500'}`}>{stage.title}</p>
                            <p className="text-xs text-gray-400">{stage.subtitle}</p>
                        </div>

                        {idx < STAGES.length - 1 && (
                            <div className="absolute top-5 left-10 w-full h-0.5 bg-gray-200 -z-0">
                                <div
                                    className="h-full bg-green-500 transition-all duration-500"
                                    style={{ width: isCompleted ? '100%' : '0%' }}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
