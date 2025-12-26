/**
 * CircularProgress - 圓形進度圖組件
 * 
 * Props:
 * - progress: 0-100 的進度百分比
 * - size: 圓形大小 ('sm' | 'md' | 'lg' | 'xl')
 * - color: 進度條顏色
 * - showLabel: 是否顯示百分比文字
 */

interface CircularProgressProps {
    progress: number;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    color?: string;
    showLabel?: boolean;
    className?: string;
}

export default function CircularProgress({
    progress,
    size = 'md',
    color = 'text-purple-600',
    showLabel = true,
    className = ''
}: CircularProgressProps) {
    // 確保 progress 在 0-100 之間
    const normalizedProgress = Math.min(100, Math.max(0, progress));

    // 根據 size 設定尺寸
    const sizeMap = {
        sm: { width: 48, stroke: 4, fontSize: 'text-xs' },
        md: { width: 80, stroke: 6, fontSize: 'text-lg' },
        lg: { width: 120, stroke: 8, fontSize: 'text-2xl' },
        xl: { width: 160, stroke: 10, fontSize: 'text-4xl' }
    };

    const { width, stroke, fontSize } = sizeMap[size];
    const radius = (width - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (normalizedProgress / 100) * circumference;

    return (
        <div className={`relative inline-flex items-center justify-center ${className}`}>
            <svg
                width={width}
                height={width}
                className="transform -rotate-90"
            >
                {/* 背景圓環 */}
                <circle
                    cx={width / 2}
                    cy={width / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={stroke}
                    fill="none"
                    className="text-gray-200"
                />

                {/* 進度圓環 */}
                <circle
                    cx={width / 2}
                    cy={width / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={stroke}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className={`${color} transition-all duration-700 ease-out`}
                />
            </svg>

            {/* 中間的百分比文字 */}
            {showLabel && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`font-bold ${color} ${fontSize}`}>
                        {Math.round(normalizedProgress)}%
                    </span>
                </div>
            )}
        </div>
    );
}
