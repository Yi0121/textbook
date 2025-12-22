/**
 * ClassroomPage - 上課頁面
 * 
 * 整合現有的 TextbookEditor 功能
 * 這是原本的教材編輯器/閱讀器介面
 */

import { useOutletContext } from 'react-router-dom';
import { type UserRole } from '../config/toolConfig';

// 暫時使用簡單的佔位元件，之後可以整合現有的 TextbookEditor
export default function ClassroomPage() {
    const { userRole } = useOutletContext<{ userRole: UserRole }>();

    return (
        <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    📖 上課頁面
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    {userRole === 'teacher' ? '教材編輯器將在這裡載入' : '教材閱讀器將在這裡載入'}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-4">
                    (待整合現有 TextbookEditor)
                </p>
            </div>
        </div>
    );
}
