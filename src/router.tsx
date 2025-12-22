/**
 * 路由配置
 * 
 * 定義應用程式的路由結構
 */

import { createBrowserRouter } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import HomePage from './pages/HomePage';
import ClassroomPage from './pages/ClassroomPage';
import DashboardPage from './pages/DashboardPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: 'class',
                element: <ClassroomPage />,
            },
            {
                path: 'dashboard',
                element: <DashboardPage />,
            },
        ],
    },
]);
