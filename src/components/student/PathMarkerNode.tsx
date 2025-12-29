import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Play, Flag } from 'lucide-react';

const StartMarker = () => (
    <div className="flex flex-col items-center group">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-green-300/50 group-hover:scale-110 transition-transform">
            <Play className="w-4 h-4 fill-white ml-0.5" />
        </div>
        <Handle type="source" position={Position.Right} className="!w-1 !h-1 !opacity-0" />
    </div>
);

const FinishMarker = () => (
    <div className="flex flex-col items-center group">
        <Handle type="target" position={Position.Left} className="!w-1 !h-1 !opacity-0" />
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-400/50 group-hover:scale-110 transition-transform ring-4 ring-white/50">
            <Flag className="w-5 h-5 fill-white" />
        </div>
        <span className="text-[10px] text-orange-600 mt-2 font-bold tracking-wider uppercase bg-white/80 px-2 py-0.5 rounded-full backdrop-blur-sm shadow-sm">終點</span>
    </div>
);

export default function PathMarkerNode({ data }: NodeProps) {
    const type = data.type as 'start' | 'finish';

    if (type === 'start') return <StartMarker />;
    if (type === 'finish') return <FinishMarker />;
    return null;
}
