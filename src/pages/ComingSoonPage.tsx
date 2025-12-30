import { useNavigate } from 'react-router-dom';
import { Construction, ArrowLeft } from 'lucide-react';

interface ComingSoonPageProps {
    title?: string;
    description?: string;
}

export default function ComingSoonPage({
    title = "功能開發中",
    description = "我們正在努力構建這個精彩的功能，敬請期待！"
}: ComingSoonPageProps) {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-sm border border-gray-100">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Construction className="w-10 h-10 text-indigo-600" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-3">{title}</h1>
                <p className="text-gray-500 mb-8 leading-relaxed">
                    {description}
                </p>

                <button
                    onClick={() => navigate(-1)}
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    返回上一頁
                </button>
            </div>
        </div>
    );
}
