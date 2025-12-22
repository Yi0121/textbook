/**
 * DashboardPage - 學習數據儀表板頁面
 * 
 * 整合現有的 Dashboard 功能
 */

import { useOutletContext } from 'react-router-dom';
import { type UserRole } from '../config/toolConfig';
import DashboardContent from '../components/features/Dashboard';

export default function DashboardPage() {
    const { userRole } = useOutletContext<{ userRole: UserRole }>();

    return (
        <div className="h-full bg-gray-50 dark:bg-gray-900 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                    {userRole === 'teacher' ? '📊 班級學習數據' : '📊 我的學習進度'}
                </h1>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-[calc(100vh-180px)]">
                    <DashboardContent />
                </div>
            </div>
        </div>
    );
}
