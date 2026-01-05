import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Sparkles, Calculator, MessageSquare, HelpCircle } from 'lucide-react';

// Quiz Feature Module
import {
    type Stage,
    StageProgress,
    SolveStage,
    PoseStage,
    ExploreStage
} from '../components/features/quiz';

import CPSStudentView from './CPSStudentView';

// ==================== VariableDivisionQuiz ====================
function VariableDivisionQuiz() {
    const [currentStage, setCurrentStage] = useState<Stage>('solve');
    const [isGifted, setIsGifted] = useState(false);

    const handleNextStage = () => {
        if (currentStage === 'solve') setCurrentStage('pose');
        else if (currentStage === 'pose') setCurrentStage('explore');
    };

    return (
        <div className="min-h-screen bg-indigo-50/30 dark:bg-gray-900 p-4 md:p-8 font-sans">
            {/* Top Bar */}
            <header className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-600 text-white rounded-lg">
                        <Calculator className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800 dark:text-white">數學冒險任務</h1>
                        <p className="text-xs text-gray-500">Unit: Division & Creativity</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Gifted Toggle */}
                    <button
                        onClick={() => setIsGifted(!isGifted)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${isGifted
                            ? 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200'
                            : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                            }`}
                    >
                        <Sparkles className={`w-3 h-3 ${isGifted ? 'fill-purple-700' : ''}`} />
                        {isGifted ? '資優挑戰模式 ON' : '切換挑戰模式'}
                    </button>

                    <div className="flex gap-2">
                        <button className="p-2 bg-white rounded-full shadow-sm text-gray-400 hover:text-indigo-600">
                            <MessageSquare className="w-5 h-5" />
                        </button>
                        <button className="p-2 bg-white rounded-full shadow-sm text-gray-400 hover:text-indigo-600">
                            <HelpCircle className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Progress Visualization */}
            <StageProgress currentStage={currentStage} />

            {/* Active Stage Content */}
            <div className="pb-20">
                {currentStage === 'solve' && <SolveStage onComplete={handleNextStage} isGifted={isGifted} />}
                {currentStage === 'pose' && <PoseStage onComplete={handleNextStage} isGifted={isGifted} />}
                {currentStage === 'explore' && <ExploreStage onComplete={() => alert('恭喜完成所有挑戰！')} isGifted={isGifted} />}
            </div>
        </div>
    );
}

export default function StudentQuizPage() {
    const { assignmentId } = useParams();

    // 針對 'assign-002' 顯示 CPS 圓周長課程
    if (assignmentId === 'assign-002') {
        return <CPSStudentView />;
    }

    // 預設顯示原有的「除法變變變」任務 (assign-001)
    return <VariableDivisionQuiz />;
}
