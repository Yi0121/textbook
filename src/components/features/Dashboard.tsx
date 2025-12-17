// components/features/Dashboard.tsx
import { useState } from 'react';
import { Sparkles, BarChart3, ClipboardCheck, Users } from 'lucide-react';
import { OverviewTab } from './dashboard/OverviewTab';
import { HomeworkTab } from './dashboard/HomeworkTab';
import { CollaborationTab } from './dashboard/CollaborationTab';
import { AIQuizTab } from './dashboard/AIQuizTab';

type TabId = 'overview' | 'homework' | 'collaboration' | 'ai-quiz';

interface TabConfig {
   id: TabId;
   label: string;
   icon: typeof BarChart3;
}

const TABS: TabConfig[] = [
   { id: 'overview', label: '學習數據總覽', icon: BarChart3 },
   { id: 'homework', label: '作業繳交', icon: ClipboardCheck },
   { id: 'collaboration', label: '小組協作', icon: Users },
   { id: 'ai-quiz', label: 'AI 測驗生成', icon: Sparkles },
];

const DashboardContent = () => {
   const [activeTab, setActiveTab] = useState<TabId>('overview');

   const renderTabContent = () => {
      switch (activeTab) {
         case 'overview':
            return <OverviewTab />;
         case 'homework':
            return <HomeworkTab />;
         case 'collaboration':
            return <CollaborationTab />;
         case 'ai-quiz':
            return <AIQuizTab />;
         default:
            return null;
      }
   };

   return (
      <div className="h-[600px] flex flex-col">
         {/* 儀表板導航 Tab */}
         <div className="flex border-b border-slate-200 mb-6">
            {TABS.map((tab) => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 font-bold text-sm transition-colors border-b-2 ${activeTab === tab.id
                     ? 'border-indigo-600 text-indigo-600'
                     : 'border-transparent text-slate-500 hover:text-slate-700'
                     }`}
               >
                  <tab.icon className="w-4 h-4" /> {tab.label}
               </button>
            ))}
         </div>

         {/* 內容區域 */}
         <div className="flex-1 overflow-y-auto pr-2">
            {renderTabContent()}
         </div>
      </div>
   );
};

export default DashboardContent;