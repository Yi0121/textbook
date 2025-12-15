import { useState } from 'react';
import { Sparkles, CheckCircle, BarChart3, RefreshCw, Users, TrendingUp, ClipboardCheck, BookOpen } from 'lucide-react';

const DashboardContent = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizGenerated, setQuizGenerated] = useState(false);

  const handleGenerateQuiz = () => {
    setIsGenerating(true);
    // 模擬 AI 生成過程
    setTimeout(() => {
      setIsGenerating(false);
      setQuizGenerated(true);
    }, 2000);
  };

  return (
    <div className="h-[600px] flex flex-col">
      {/* 儀表板導航 Tab */}
      <div className="flex border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-sm transition-colors border-b-2 ${activeTab === 'overview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <BarChart3 className="w-4 h-4" /> 學習數據總覽
        </button>
        <button
          onClick={() => setActiveTab('homework')}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-sm transition-colors border-b-2 ${activeTab === 'homework' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <ClipboardCheck className="w-4 h-4" /> 作業繳交
        </button>
        <button
          onClick={() => setActiveTab('collaboration')}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-sm transition-colors border-b-2 ${activeTab === 'collaboration' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <Users className="w-4 h-4" /> 小組協作
        </button>
        <button
          onClick={() => setActiveTab('ai-quiz')}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-sm transition-colors border-b-2 ${activeTab === 'ai-quiz' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <Sparkles className="w-4 h-4" /> AI 測驗生成
        </button>
      </div>

      {/* 內容區域 */}
      <div className="flex-1 overflow-y-auto pr-2">
        
        {/* 1. 學習數據總覽 */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             {/* 數據卡片 */}
             <div className="grid grid-cols-4 gap-4">
                <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100">
                   <div className="text-emerald-800 font-medium mb-2 flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4"/> 平均答對率</div>
                   <div className="text-3xl font-bold text-emerald-600">87%</div>
                   <div className="text-xs text-emerald-600/70 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> 較上週 +5%</div>
                </div>
                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                   <div className="text-blue-800 font-medium mb-2 flex items-center gap-2 text-sm"><ClipboardCheck className="w-4 h-4"/> 作業繳交率</div>
                   <div className="text-3xl font-bold text-blue-600">93%</div>
                   <div className="text-xs text-blue-600/70 mt-1">28/30 已繳交</div>
                </div>
                <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
                   <div className="text-purple-800 font-medium mb-2 flex items-center gap-2 text-sm"><Users className="w-4 h-4"/> 活躍學生</div>
                   <div className="text-3xl font-bold text-purple-600">26</div>
                   <div className="text-xs text-purple-600/70 mt-1">本週上線人數</div>
                </div>
                <div className="bg-orange-50 p-5 rounded-xl border border-orange-100">
                   <div className="text-orange-800 font-medium mb-2 flex items-center gap-2 text-sm"><BookOpen className="w-4 h-4"/> 平均學習時長</div>
                   <div className="text-3xl font-bold text-orange-600">42m</div>
                   <div className="text-xs text-orange-600/70 mt-1">每日平均</div>
                </div>
             </div>

             {/* 學生列表 */}
             <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                   <h3 className="font-bold text-gray-800">全班學習狀況</h3>
                </div>
                <div className="overflow-auto max-h-80">
                   <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                         <tr className="text-left text-gray-600">
                            <th className="px-6 py-3 font-medium">學生姓名</th>
                            <th className="px-6 py-3 font-medium">作業進度</th>
                            <th className="px-6 py-3 font-medium">測驗成績</th>
                            <th className="px-6 py-3 font-medium">學習狀態</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                         {[
                            { name: '王小明', homework: '5/5', score: 92, status: 'good' },
                            { name: '陳小美', homework: '5/5', score: 88, status: 'good' },
                            { name: '林大華', homework: '4/5', score: 76, status: 'warning' },
                            { name: '張小芳', homework: '3/5', score: 65, status: 'need-help' },
                            { name: '李志明', homework: '5/5', score: 95, status: 'good' }
                         ].map((student, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                               <td className="px-6 py-4 font-medium text-gray-800">{student.name}</td>
                               <td className="px-6 py-4 text-gray-600">{student.homework}</td>
                               <td className="px-6 py-4">
                                  <span className={`font-bold ${student.score >= 80 ? 'text-green-600' : student.score >= 60 ? 'text-orange-600' : 'text-red-600'}`}>
                                     {student.score}分
                                  </span>
                               </td>
                               <td className="px-6 py-4">
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                     student.status === 'good' ? 'bg-green-100 text-green-700' :
                                     student.status === 'warning' ? 'bg-orange-100 text-orange-700' :
                                     'bg-red-100 text-red-700'
                                  }`}>
                                     {student.status === 'good' ? '良好' : student.status === 'warning' ? '注意' : '需協助'}
                                  </span>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        )}

        {/* 2. 作業繳交狀況 */}
        {activeTab === 'homework' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-800 mb-4">本週作業繳交明細</h3>
                <div className="space-y-3">
                   {[
                      { hw: '作業 1: 粒線體結構圖', submitted: 30, total: 30, deadline: '已截止' },
                      { hw: '作業 2: ATP 生成機制', submitted: 28, total: 30, deadline: '2天後' },
                      { hw: '作業 3: 細胞呼吸實驗報告', submitted: 25, total: 30, deadline: '5天後' }
                   ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                         <div className="flex-1">
                            <div className="font-medium text-gray-800">{item.hw}</div>
                            <div className="text-sm text-gray-500 mt-1">繳交: {item.submitted}/{item.total} ({Math.round(item.submitted/item.total*100)}%)</div>
                         </div>
                         <div className="text-right">
                            <div className="text-xs text-gray-500">{item.deadline}</div>
                            <div className="mt-1 w-32 bg-gray-200 rounded-full h-2">
                               <div className="bg-indigo-600 h-2 rounded-full" style={{width: `${item.submitted/item.total*100}%`}}></div>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* 3. 小組協作狀況 */}
        {activeTab === 'collaboration' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="grid grid-cols-2 gap-4">
                {[
                   { group: '第一組', members: ['王小明', '陳小美', '林大華'], progress: 85, topic: '粒線體與能量代謝' },
                   { group: '第二組', members: ['張小芳', '李志明', '黃小華'], progress: 92, topic: '細胞呼吸作用探討' },
                   { group: '第三組', members: ['吳小強', '周小文', '鄭小玲'], progress: 78, topic: 'ATP合成酶機制' },
                   { group: '第四組', members: ['許小雯', '蔡小明', '劉小芬'], progress: 88, topic: '有氧與無氧呼吸比較' }
                ].map((group, idx) => (
                   <div key={idx} className="bg-white rounded-xl border border-gray-200 p-5">
                      <div className="flex items-center justify-between mb-3">
                         <h4 className="font-bold text-gray-800">{group.group}</h4>
                         <span className="text-2xl font-bold text-indigo-600">{group.progress}%</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">{group.topic}</div>
                      <div className="flex flex-wrap gap-2">
                         {group.members.map((member, i) => (
                            <span key={i} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs">
                               {member}
                            </span>
                         ))}
                      </div>
                      <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                         <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{width: `${group.progress}%`}}></div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}

        {/* 2. AI 出題視圖 (重點修改) */}
        {activeTab === 'ai-quiz' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             {!quizGenerated ? (
               <div className="text-center py-20">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">AI 智能出題助手</h3>
                  <p className="text-slate-500 max-w-md mx-auto mb-8">
                    系統將根據目前的教科書內容（粒線體結構）與筆記，自動生成適合全班程度的 5 題測驗，並自動批改。
                  </p>
                  
                  <button 
                    onClick={handleGenerateQuiz}
                    disabled={isGenerating}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2 mx-auto disabled:opacity-70"
                  >
                    {isGenerating ? (
                      <><RefreshCw className="w-5 h-5 animate-spin"/> 正在分析教材與生成題目...</>
                    ) : (
                      <><Sparkles className="w-5 h-5"/> 立即生成測驗</>
                    )}
                  </button>
               </div>
             ) : (
               <div className="space-y-6">
                  <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                     <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded shadow-sm"><CheckCircle className="w-6 h-6 text-green-500" /></div>
                        <div>
                           <div className="font-bold text-indigo-900">測驗已生成並發送</div>
                           <div className="text-xs text-indigo-600">基於內容：粒線體與 ATP (P.42)</div>
                        </div>
                     </div>
                     <button className="text-sm font-bold text-indigo-600 bg-white px-4 py-2 rounded border border-indigo-200 shadow-sm">
                        查看即時答題狀況
                     </button>
                  </div>

                  {/* 題目預覽列表 */}
                  {[1, 2, 3].map(i => (
                    <div key={i} className="border border-slate-200 rounded-lg p-5 hover:border-indigo-300 transition-colors bg-white">
                       <div className="flex gap-4">
                          <span className="font-bold text-slate-400">Q{i}</span>
                          <div className="flex-1">
                             <div className="font-bold text-slate-800 mb-3">
                                {i === 1 ? "粒線體內膜向內摺疊形成的結構稱為什麼？" : 
                                 i === 2 ? "下列何者是粒線體的主要功能？" : "關於粒線體DNA (mtDNA) 的描述，何者正確？"}
                             </div>
                             <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                                <div className={`p-2 rounded ${i===1?'bg-green-100 border border-green-200 text-green-800 font-bold':''}`}>A. 嵴 (Cristae)</div>
                                <div className="p-2 border border-slate-100 rounded">B. 基質 (Matrix)</div>
                                <div className="p-2 border border-slate-100 rounded">C. 類囊體</div>
                                <div className="p-2 border border-slate-100 rounded">D. 內質網</div>
                             </div>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardContent;