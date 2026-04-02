import { useMemo, useState } from 'react';
import { format, eachDayOfInterval, startOfYear, endOfYear } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HeatmapProps {
  data: Record<string, { value: number }>;
  metric: 'time' | 'count';
  onDayClick?: (date: string) => void;
}

const ActivityHeatmap = ({ data, metric, onDayClick }: HeatmapProps) => {
  const [selectedYear] = useState(new Date().getFullYear());

  const days = useMemo(() => {
    const start = startOfYear(new Date(selectedYear, 0, 1));
    const end = endOfYear(new Date(selectedYear, 0, 1));
    return eachDayOfInterval({ start, end });
  }, [selectedYear]);

  const getIntensity = (value: number): number => {
    if (value === 0) return 0;
    if (metric === 'time') {
      if (value <= 25) return 1;
      if (value <= 50) return 2;
      if (value <= 100) return 3;
      return 4;
    } else {
      if (value <= 1) return 1;
      if (value <= 3) return 2;
      if (value <= 6) return 3;
      return 4;
    }
  };

  const getColor = (intensity: number) => {
    if (intensity === 0) return 'bg-zinc-700 hover:bg-zinc-600';
    if (intensity === 1) return 'bg-emerald-900 hover:bg-emerald-800';
    if (intensity === 2) return 'bg-emerald-700 hover:bg-emerald-600';
    if (intensity === 3) return 'bg-emerald-500 hover:bg-emerald-400';
    return 'bg-emerald-400 hover:bg-emerald-300';
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Contribution Activity</h2>

          <div className="flex gap-2">
            <button
              onClick={() => {}}
              className={`px-5 py-1.5 text-sm font-medium rounded-md transition-all ${
                metric === 'time' ? 'bg-emerald-600 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400'
              }`}
            >
              Time Spent
            </button>
            <button
              onClick={() => {}}
              className={`px-5 py-1.5 text-sm font-medium rounded-md transition-all ${
                metric === 'count' ? 'bg-emerald-600 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400'
              }`}
            >
              Completions
            </button>
          </div>
        </div>

        {/* Clean Heatmap Grid - No labels */}
        <div className="overflow-x-auto pb-4">
          <div 
            className="grid gap-[3px] inline-grid" 
            style={{ gridTemplateColumns: `repeat(${Math.ceil(days.length / 7)}, 13px)` }}
          >
            {days.map((day, index) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const value = data[dateStr]?.value || 0;
              const intensity = getIntensity(value);
              const colorClass = getColor(intensity);

              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <div
                      className={`w-[13px] h-[13px] rounded-sm cursor-pointer transition-all ${colorClass}`}
                      onClick={() => onDayClick?.(dateStr)}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-center">
                      <div className="font-medium">{format(day, 'EEEE, MMMM dd, yyyy')}</div>
                      <div className="text-emerald-400 mt-0.5">
                        {value} {metric === 'time' ? 'minutes' : 'resources'}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs text-zinc-400 pl-2">
          <span>Less</span>
          <div className="flex gap-[3px]">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className={`w-[13px] h-[13px] rounded-sm ${getColor(i)}`} />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ActivityHeatmap;
