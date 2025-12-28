import { BookOpen } from 'lucide-react';
import type { CurriculumUnit } from '../../../data/curriculum108Math';
import type { PedagogyMethod } from '../../../data/pedagogyMethods';

// ==================== Message Components ====================

/** 文字訊息 */
export function TextMessage({ content, isUser }: { content: string; isUser: boolean }) {
    return (
        <div
            className={`max-w-[80%] px-4 py-3 rounded-2xl ${isUser
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white ml-auto'
                : 'bg-white border border-gray-200 shadow-sm'
                }`}
        >
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
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
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
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

/** 課綱匹配選項訊息 */
export function CurriculumMatchesMessage({
    content,
    matches,
    onSelect,
}: {
    content: string;
    matches: CurriculumUnit[];
    onSelect: (id: string, label: string) => void;
}) {
    return (
        <div className="max-w-[90%] space-y-3">
            <div className="bg-white border border-gray-200 shadow-sm px-4 py-3 rounded-2xl">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
            </div>
            <div className="space-y-2">
                {matches.map((unit) => (
                    <button
                        key={unit.code}
                        onClick={() => onSelect(unit.code, `${unit.code} ${unit.title}`)}
                        className="w-full text-left px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl border border-blue-200 transition-all hover:shadow-md group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">
                                    <span className="text-indigo-600 font-mono text-xs mr-2">{unit.code}</span>
                                    {unit.title}
                                </div>
                                {unit.description && (
                                    <div className="text-xs text-gray-500 mt-0.5">{unit.description}</div>
                                )}
                            </div>
                        </div>
                    </button>
                ))}
                <button
                    onClick={() => onSelect('skip', '跳過')}
                    className="w-full text-center px-4 py-2 text-gray-500 hover:text-gray-700 text-sm transition-colors"
                >
                    跳過，使用自訂主題
                </button>
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
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
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
