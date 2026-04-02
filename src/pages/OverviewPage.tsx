import { useState, useEffect, useMemo } from 'react';
import ActivityHeatmap from '@/components/ActivityHeatmap';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useLocalStorageResources } from '@/hooks/useLocalStorage';
import { format } from 'date-fns';

export default function OverviewPage() {
  const { resources, getResourcesByDate } = useLocalStorageResources();
  const [metric, setMetric] = useState<'time' | 'count'>('time');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Aggregate data for heatmap
  const heatmapData = useMemo(() => {
    const agg: Record<string, { value: number }> = {};

    resources.forEach(resource => {
      const date = resource.date_completed;
      if (!agg[date]) {
        agg[date] = { value: 0 };
      }
      if (metric === 'time') {
        agg[date].value += resource.time_spent_minutes;
      } else {
        agg[date].value += 1;
      }
    });

    return agg;
  }, [resources, metric]);

  const dailyResources = selectedDate ? getResourcesByDate(selectedDate) : [];

  const totalTime = resources.reduce((sum, r) => sum + r.time_spent_minutes, 0);
  const totalResources = resources.length;

  return (
    <div className="flex-1 p-8 overflow-auto">
      <div className="max-w-6xl mx-auto space-y-10">
        <div>
          <h1 className="text-4xl font-bold mb-2">Overview</h1>
          <p className="text-zinc-400">Your learning activity over time</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <p className="text-sm text-zinc-400">Total Time Spent</p>
            <p className="text-5xl font-semibold mt-3">{totalTime} <span className="text-2xl">min</span></p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-zinc-400">Resources Logged</p>
            <p className="text-5xl font-semibold mt-3">{totalResources}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-zinc-400">Current Streak</p>
            <p className="text-5xl font-semibold mt-3 text-emerald-400">— days</p>
          </Card>
        </div>

        {/* Heatmap */}
        <Card className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold">Activity Heatmap</h2>
            <div className="flex gap-2">
              <Button 
                variant={metric === 'time' ? 'default' : 'outline'}
                onClick={() => setMetric('time')}
              >
                Time Spent
              </Button>
              <Button 
                variant={metric === 'count' ? 'default' : 'outline'}
                onClick={() => setMetric('count')}
              >
                Completions
              </Button>
            </div>
          </div>

          <ActivityHeatmap 
            data={heatmapData} 
            metric={metric}
            onDayClick={setSelectedDate}
          />
        </Card>

        {/* Selected Day Detail */}
        {selectedDate && (
          <Card className="p-8">
            <h3 className="text-xl font-semibold mb-6">
              {format(new Date(selectedDate), 'EEEE, MMMM dd, yyyy')}
            </h3>
            
            {dailyResources.length > 0 ? (
              <div className="space-y-4">
                {dailyResources.map(resource => (
                  <div key={resource.id} className="flex justify-between items-center p-4 bg-zinc-900 rounded-xl">
                    <div>
                      <a href={resource.url} target="_blank" className="font-medium hover:text-emerald-400">
                        {resource.title}
                      </a>
                      <p className="text-sm text-zinc-500">{resource.resource_type} • {resource.time_spent_minutes} min</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-500">No resources on this day.</p>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
