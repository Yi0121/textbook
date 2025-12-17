// components/features/index.ts
export { default as DashboardContent } from './Dashboard';
export { default as ClassroomWidgets } from './ClassroomWidgets';
export { default as EPUBImporter } from './EPUBImporter';
export { default as LuckyDraw } from './LuckyDraw';

// Dashboard sub-components - use explicit paths to avoid casing issues
export { OverviewTab } from './dashboard/OverviewTab';
export { HomeworkTab } from './dashboard/HomeworkTab';
export { CollaborationTab } from './dashboard/CollaborationTab';
export { AIQuizTab } from './dashboard/AIQuizTab';

