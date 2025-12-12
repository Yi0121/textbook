// ========================================
// 📁 src/context/ToolContext.tsx
// 功能：管理工具狀態（畫筆、顏色）
// ========================================
import { createContext, useContext, useState, type ReactNode } from 'react';
import { type UserRole } from '../config/toolConfig';

interface ToolState {
  userRole: UserRole;
  isEditMode: boolean;
  currentTool: string;
  penColor: string;
  penSize: number;
  laserPath: { x: number; y: number; timestamp: number }[];
  isStudentStage: boolean;
}

interface ToolActions {
  setUserRole: (role: UserRole) => void;
  setEditMode: (mode: boolean) => void;
  setCurrentTool: (tool: string) => void;
  setPenColor: (color: string) => void;
  setPenSize: (size: number) => void;
  setLaserPath: (path: { x: number; y: number; timestamp: number }[]) => void;
  addLaserPoint: (point: { x: number; y: number; timestamp: number }) => void;
  toggleStudentStage: () => void;
}

const ToolContext = createContext<(ToolState & ToolActions) | undefined>(undefined);

export function ToolProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>('teacher');
  const [isEditMode, setEditMode] = useState(false);
  const [currentTool, setCurrentTool] = useState('cursor');
  const [penColor, setPenColor] = useState('#ef4444');
  const [penSize, setPenSize] = useState(4);
  const [laserPath, setLaserPath] = useState<{ x: number; y: number; timestamp: number }[]>([]);
  const [isStudentStage, setStudentStage] = useState(false);

  const addLaserPoint = (point: { x: number; y: number; timestamp: number }) => {
    setLaserPath(prev => [...prev, point]);
  };

  const toggleStudentStage = () => {
    setStudentStage(prev => !prev);
  };

  return (
    <ToolContext.Provider
      value={{
        userRole,
        isEditMode,
        currentTool,
        penColor,
        penSize,
        laserPath,
        isStudentStage,
        setUserRole,
        setEditMode,
        setCurrentTool,
        setPenColor,
        setPenSize,
        setLaserPath,
        addLaserPoint,
        toggleStudentStage,
      }}
    >
      {children}
    </ToolContext.Provider>
  );
}

export function useTool() {
  const context = useContext(ToolContext);
  if (!context) throw new Error('useTool must be used within ToolProvider');
  return context;
}

