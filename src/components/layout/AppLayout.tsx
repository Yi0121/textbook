/**
 * AppLayout - 應用程式全局佈局
 * 
 * 結構：
 * - 左側：AppSidebar (導航選單)
 * - 右側：主內容區 (Outlet)
 * - 頂部：Header (角色切換、主題、頭像)
 */

import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';
import { type UserRole } from '../../config/toolConfig';

// Context Providers
import { AppProviders } from '../../context/IndexContext';

export default function AppLayout() {
    const [userRole, setUserRole] = useState<UserRole>('teacher');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <AppProviders>
            <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
                {/* 左側導航 */}
                <AppSidebar
                    userRole={userRole}
                    collapsed={sidebarCollapsed}
                    onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                />

                {/* 右側主區域 */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    {/* 頂部導航 */}
                    <AppHeader
                        userRole={userRole}
                        setUserRole={setUserRole}
                    />

                    {/* 主內容區 */}
                    <main className="flex-1 overflow-auto">
                        <Outlet context={{ userRole, setUserRole }} />
                    </main>
                </div>
            </div>
        </AppProviders>
    );
}
