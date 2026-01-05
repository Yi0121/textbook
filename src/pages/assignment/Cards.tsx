import { CheckCircle2 } from 'lucide-react';
import type { Methodology } from './types';

// ==================== StatCard ====================
interface StatCardProps {
    label: string;
    value: string | number;
    subtext?: string;
    icon: React.ElementType;
    color: string;
}

export function StatCard({ label, value, subtext, icon: Icon, color }: StatCardProps) {
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{value}</h3>
                    {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
                </div>
                <div className={`p-2 rounded-lg ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
        </div>
    );
}

// ==================== MethodCard ====================
export function MethodCard({ method }: { method: Methodology }) {
    return (
        <div className={`p-4 rounded-xl border ${method.color} transition-all hover:shadow-md cursor-pointer`}>
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                    {method.icon}
                </div>
                <h4 className="font-bold text-sm">{method.title}</h4>
            </div>
            <div className="mb-3 text-lg font-mono bg-white/50 p-2 rounded text-center">
                {method.description}
            </div>
            <ul className="space-y-1">
                {method.features.map((feature, idx) => (
                    <li key={idx} className="text-xs flex items-center gap-1.5 opacity-80">
                        <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                        {feature}
                    </li>
                ))}
            </ul>
        </div>
    );
}
