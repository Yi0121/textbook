/**
 * CPSStudentView - Main page for CPS learning flow
 * 
 * This page orchestrates the CPS (Collaborative Problem Solving) learning stages,
 * now using extracted components for better maintainability.
 */

import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import {
    TopBar,
    SmartSidebar,
    StageS2,
    StageS3,
    StageS4,
    StageS5,
    StageS6,
    type Stage
} from '../components/student/cps';

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

const CPSStudentView = () => {
    const [currentStage, setCurrentStage] = useState<Stage>('S2');

    return (
        <div className="w-full h-screen bg-slate-50 flex flex-col font-sans overflow-hidden">
            {/* 1. Global Top Navigation */}
            <TopBar currentStage={currentStage} setStage={setCurrentStage} />

            {/* 2. Main Workspace Layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Main Content Area */}
                <div className="flex-1 relative z-0 transition-all duration-300">
                    {currentStage === 'S2' && <StageS2 />}
                    {currentStage === 'S3' && <StageS3 />}
                    {currentStage === 'S4' && <StageS4 />}
                    {currentStage === 'S5' && <StageS5 />}
                    {currentStage === 'S6' && <StageS6 />}

                    {/* Help Button (Floating) - Hidden during S2 */}
                    {currentStage !== 'S2' && (
                        <button className="absolute bottom-6 left-6 p-3 bg-white border border-red-100 text-red-500 rounded-full shadow-lg hover:bg-red-50 transition-all flex items-center gap-2 group z-50">
                            <HelpCircle size={24} />
                            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-bold">呼叫老師</span>
                        </button>
                    )}
                </div>

                {/* 3. Global Sidebar - Hidden during S2 */}
                {currentStage !== 'S2' && <SmartSidebar stage={currentStage} />}
            </div>
        </div>
    );
};

export default CPSStudentView;
