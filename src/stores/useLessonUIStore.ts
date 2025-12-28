import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface LessonUIState {
    // Editor Visibility
    isEditorOpen: boolean;
    activeTab: string;
    isSidebarOpen: boolean;

    // Generation Status
    isGenerating: boolean;
}

interface LessonUIActions {
    setEditorOpen: (isOpen: boolean) => void;
    setActiveTab: (tab: string) => void;
    setSidebarOpen: (isOpen: boolean) => void;
    setGenerating: (isGenerating: boolean) => void;
    reset: () => void;
}

const initialState: LessonUIState = {
    isEditorOpen: false,
    activeTab: 'agents',
    isSidebarOpen: false,
    isGenerating: false,
};

export const useLessonUIStore = create<LessonUIState & LessonUIActions>()(
    devtools((set) => ({
        ...initialState,
        setEditorOpen: (isOpen) => set({ isEditorOpen: isOpen }),
        setActiveTab: (tab) => set({ activeTab: tab }),
        setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
        setGenerating: (isGenerating) => set({ isGenerating }),
        reset: () => set(initialState),
    }), { name: 'lesson-ui-store' })
);
