import React from 'react';

const DashboardContent = () => {
    return (
      <div className="h-full flex flex-col bg-slate-50/50">
        <div className="grid grid-cols-4 gap-6 p-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden ring-1 ring-gray-100">
                <div className="aspect-[4/3] bg-slate-50 relative border-b border-gray-100 overflow-hidden">
                    <div className="absolute inset-4 bg-white shadow-sm border border-gray-100 rounded-lg flex items-center justify-center opacity-80"><span className="text-3xl opacity-20 filter grayscale">✏️</span></div>
                </div>
                <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-slate-200 border-2 border-white shadow-sm"></div>
                        <div>
                            <div className="font-bold text-gray-800 text-sm leading-tight">Student {i}</div>
                            <div className="text-[10px] text-gray-400 font-medium">已提交</div>
                        </div>
                    </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
};

export default DashboardContent;