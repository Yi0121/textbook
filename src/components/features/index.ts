// components/features/index.ts
export { default as DashboardContent } from '../teacher/dashboard/Dashboard';
export { default as EPUBImporter } from './EPUBImporter';

// Classroom tools
export { ClassroomWidgets, LuckyDraw } from '../teacher/classroom';

// Dashboard sub-components
export { OverviewTab, HomeworkTab, CollaborationTab, AIQuizTab } from '../teacher/dashboard';

// Lesson Prep Feature
export * from './lesson-prep';
