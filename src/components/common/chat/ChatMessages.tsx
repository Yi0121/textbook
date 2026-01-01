
import type { PedagogyMethod } from '../../../data/pedagogyMethods';

// 簡單的 Markdown 格式化 (支援 **Bold** 和 *Italic*)
const formatText = (text: string) => {
    return text.split(/(\*\*.*?\*\*|\*.*?\*)/g).map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
            return <span key={index} className="text-gray-500 italic text-xs">{part.slice(1, -1)}</span>;
        }
        return part;
    });
};

// ==================== Message Components ====================

/** 文字訊息 */
export function TextMessage({ content, isUser }: { content: string; isUser: boolean }) {
    return (
        <div
            className={`max-w-[85%] px-5 py-3.5 rounded-2xl shadow-sm text-[15px] leading-relaxed tracking-wide transition-all ${isUser
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white ml-auto rounded-tr-sm shadow-indigo-200'
                : 'bg-white/90 backdrop-blur-sm border border-gray-100/80 text-gray-700 rounded-tl-sm shadow-gray-100'
                }`}
        >
            <p className="whitespace-pre-wrap">{isUser ? content : formatText(content)}</p>
        </div>
    );
}

/** 選項按鈕訊息 */
export function OptionsMessage({
    content,
    options,
    onSelect,
}: {
    content: string;
    options: { id: string; label: string; icon?: string }[];
    onSelect: (id: string, label: string) => void;
}) {
    return (
        <div className="max-w-[85%] space-y-3">
            <div className="bg-white border border-gray-200 shadow-sm px-4 py-3 rounded-2xl">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{formatText(content)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => onSelect(opt.id, opt.label)}
                        className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium transition-all hover:scale-105 border border-indigo-200"
                    >
                        {opt.icon && <span className="mr-1">{opt.icon}</span>}
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

/** 教學法選擇訊息 */
export function PedagogySelectMessage({
    content,
    methods,
    onSelect,
}: {
    content: string;
    methods: PedagogyMethod[];
    onSelect: (id: string, label: string) => void;
}) {
    return (
        <div className="max-w-[95%] space-y-3">
            <div className="bg-white border border-gray-200 shadow-sm px-4 py-3 rounded-2xl">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {methods.slice(0, 6).map((method) => (
                    <button
                        key={method.id}
                        onClick={() => onSelect(method.id, method.name)}
                        className="text-left px-4 py-3 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 transition-all hover:shadow-md hover:border-indigo-300 group"
                        style={{ borderLeftColor: method.color, borderLeftWidth: '4px' }}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">{method.icon}</span>
                            <span className="font-medium text-gray-900">{method.name}</span>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2">{method.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}

/** 摘要確認訊息 */
export function SummaryMessage({
    content,
    options,
    onSelect,
}: {
    content: string;
    options: { id: string; label: string; icon?: string }[];
    onSelect: (id: string, label: string) => void;
}) {
    return (
        <div className="max-w-[90%] space-y-3">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 shadow-sm px-5 py-4 rounded-2xl">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{formatText(content)}</p>
            </div>
            <div className="flex gap-3">
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => onSelect(opt.id, opt.label)}
                        className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${opt.id === 'confirm-yes'
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
