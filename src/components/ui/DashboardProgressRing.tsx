/**
 * DashboardProgressRing - 儀表板進度環
 */
interface DashboardProgressRingProps {
    percentage: number;
    size?: number;
}

export function DashboardProgressRing({ percentage, size = 60 }: DashboardProgressRingProps) {
    const strokeWidth = 5;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-purple-100" />
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="url(#progressGradient)" strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-1000 ease-out" />
                <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#d8b4fe" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-slate-700">{percentage}%</span>
            </div>
        </div>
    );
}

export default DashboardProgressRing;
