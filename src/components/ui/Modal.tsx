import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  fullWidth?: boolean;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, icon, children, fullWidth }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`${fullWidth ? 'w-full h-[95vh] max-w-[95vw]' : 'w-[500px] h-[600px]'} bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 ring-1 ring-black/5`}>
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-2 text-gray-800 font-bold text-lg"><div className="p-1.5 bg-white rounded-lg shadow-sm text-indigo-600">{icon}</div>{title}</div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-full text-gray-400 transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-hidden p-6 relative bg-white">{children}</div>
      </div>
    </div>
  );
};

export default Modal;