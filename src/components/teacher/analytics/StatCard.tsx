/**
 * StatCard & StatBox - 統計卡片元件
 */

import React from 'react';

interface StatCardProps {
    icon: React.ReactNode;
    iconBg: string;
    value: string | number;
    label: string;
}

export function StatCard({ icon, iconBg, value, label }: StatCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-md p-5">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center`}>
                    {icon}
                </div>
                <div className="flex-1">
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    <p className="text-sm text-gray-500">{label}</p>
                </div>
            </div>
        </div>
    );
}

interface StatBoxProps {
    icon: React.ReactNode;
    value: number;
    label: string;
    bgColor: string;
}

export function StatBox({ icon, value, label, bgColor }: StatBoxProps) {
    return (
        <div className={`${bgColor} rounded-lg p-4 text-center`}>
            <div className="flex justify-center mb-2">{icon}</div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-600">{label}</p>
        </div>
    );
}
