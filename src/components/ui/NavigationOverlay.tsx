import React from 'react';
import { X, Map, ArrowRight } from 'lucide-react';

interface NavZone {
  id: number;
  label: string;
  x: number;
  y: number;
  color: string;
  description?: string; // 新增描述欄位
}

interface NavigationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (x: number, y: number) => void;
  zones: NavZone[];
}

const NavigationOverlay: React.FC<NavigationOverlayProps> = ({ 
  isOpen, 
  onClose, 
  onNavigate, 
  zones 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-white/50 transform transition-all scale-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-indigo-50/50 p-4 border-b border-indigo-100 flex justify-between items-center">
            <div className="flex items-center gap-2 text-indigo-900">
                <Map className="w-5 h-5" />
                <span className="font-bold text-lg">教材導航地圖</span>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-gray-500 hover:text-gray-800">
                <X className="w-5 h-5" />
            </button>
        </div>

        {/* Map Grid */}
        <div className="p-8 bg-gray-50/50">
            <div className="grid grid-cols-2 gap-4 aspect-video max-h-[400px]">
                {zones.map((zone) => (
                    <button
                        key={zone.id}
                        onClick={() => {
                            onNavigate(zone.x, zone.y);
                            onClose();
                        }}
                        className={`
                            relative group overflow-hidden rounded-2xl border-2 border-transparent hover:border-indigo-400 
                            transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white
                        `}
                    >
                        {/* 模擬內容區塊 (色塊) */}
                        <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 ${zone.color} transition-transform group-hover:scale-150`}></div>
                        
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
                            <span className="text-4xl font-black text-gray-100 group-hover:text-indigo-50 transition-colors">
                                0{zone.id}
                            </span>
                            <h3 className="text-xl font-bold text-gray-700 group-hover:text-indigo-600 z-10">
                                {zone.label}
                            </h3>
                            {zone.description && (
                                <p className="text-xs text-gray-400 group-hover:text-gray-600">
                                    {zone.description}
                                </p>
                            )}
                            
                            {/* Hover 指示 */}
                            <div className="absolute bottom-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs text-indigo-500 font-bold bg-indigo-50 px-3 py-1 rounded-full">
                                前往區域 <ArrowRight className="w-3 h-3" />
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
        
        {/* Footer Hint */}
        <div className="px-6 py-3 bg-white text-center text-xs text-gray-400 border-t border-gray-100">
            提示：您也可以使用鍵盤方向鍵在相鄰區域間快速移動
        </div>
      </div>
    </div>
  );
};

export default NavigationOverlay;