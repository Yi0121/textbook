import { Video, FileText, CheckSquare, Wrench } from 'lucide-react';

interface DraggableResourceProps {
    id: string;
    title: string;
    desc: string;
    source: string;
    color: string;
    resourceType: 'video' | 'material' | 'worksheet' | 'external';
}

export function DraggableResource({ id, title, desc, color, resourceType }: DraggableResourceProps) {
    const colorMap: Record<string, string> = {
        red: 'border-red-200 bg-red-50 hover:bg-red-100',
        blue: 'border-blue-200 bg-blue-50 hover:bg-blue-100',
        green: 'border-green-200 bg-green-50 hover:bg-green-100',
        purple: 'border-purple-200 bg-purple-50 hover:bg-purple-100',
    };

    // Explicit type mapping for Lucide icons
    const iconMap = {
        video: Video,
        material: FileText,
        worksheet: CheckSquare,
        external: Wrench,
    };

    const Icon = iconMap[resourceType];

    return (
        <div
            draggable
            onDragStart={(e) => {
                e.dataTransfer.setData('application/reactflow', 'resource');
                e.dataTransfer.setData('resourceId', id);
                e.dataTransfer.setData('resourceTitle', title);
                e.dataTransfer.setData('resourceType', resourceType);
                e.dataTransfer.effectAllowed = 'move';
            }}
            className={`
                group p-3 border rounded-xl cursor-move transition-all duration-200
                ${colorMap[color] || 'border-gray-200 bg-gray-50'} shadow-sm hover:shadow-md hover:-translate-y-0.5
            `}
        >
            <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                    <Icon size={16} className={`text-${color}-500`} />
                </div>
                <div>
                    <div className="font-bold text-sm text-gray-800 leading-tight mb-1">{title}</div>
                    <div className="text-xs text-gray-500">{desc}</div>
                </div>
            </div>
        </div>
    );
}
