/**
 * AppLayout - 應用程式全局佈局
 * 
 * 結構：
 * - 左側：AppSidebar (導航選單)
 * - 右側：主內容區 (Outlet)
 * - 頂部：Header (角色切換、主題、頭像)
 * 
 * 響應式：
 * - 桌面：側邊欄常駐
 * - 行動：側邊欄隱藏，透過 Hamburger 開啟
 */

import { Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';
import GlobalAIAssistant from './GlobalAIAssistant';
import { type UserRole } from '../../config/toolConfig';

// Context Providers
import { AppProviders } from '../../context/IndexContext';

// 判斷是否為行動裝置寬度
const MOBILE_BREAKPOINT = 768;

export default function AppLayout() {
    const location = useLocation();
    const [userRole, setUserRole] = useState<UserRole>('teacher');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // 監聽視窗大小變化
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < MOBILE_BREAKPOINT;
            setIsMobile(mobile);
            // 切換到桌面版時，關閉行動選單
            if (!mobile) {
                setMobileMenuOpen(false);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // 關閉行動選單
    const closeMobileMenu = () => setMobileMenuOpen(false);

    return (
        <AppProviders>
            <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
                {/* 行動版：Overlay 背景 */}
                {isMobile && mobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 transition-opacity animate-fadeIn"
                        onClick={closeMobileMenu}
                    />
                )}

                {/* 左側導航 */}
                <div
                    className={`
                        ${isMobile
                            ? `fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`
                            : ''
                        }
                    `}
                >
                    <AppSidebar
                        userRole={userRole}
                        collapsed={isMobile ? false : sidebarCollapsed}
                        onToggleCollapse={() => {
                            if (isMobile) {
                                closeMobileMenu();
                            } else {
                                setSidebarCollapsed(!sidebarCollapsed);
                            }
                        }}
                    />
                </div>

                {/* 右側主區域 */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    {/* 頂部導航 */}
                    <AppHeader
                        userRole={userRole}
                        setUserRole={setUserRole}
                        onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        showMenuButton={isMobile}
                    />

                    {/* 主內容區 */}
                    <main className="flex-1 overflow-auto">
                        <Outlet context={{ userRole, setUserRole }} />
                    </main>
                </div>

                {/* 全局 AI 助教按鈕 (首頁隱藏) */}
                {location.pathname !== '/' && <GlobalAIAssistant />}
            </div>
        </AppProviders>
    );
}
