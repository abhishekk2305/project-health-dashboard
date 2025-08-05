import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface SchedulePanelProps {
  data?: any;
  isLoading: boolean;
  error?: Error | null;
}

/**
 * Schedule health panel component displaying sprint progress and burndown chart
 * Shows completion percentage, story points tracking, and visual burndown visualization
 */
export function SchedulePanel({ data, isLoading, error }: SchedulePanelProps) {
  if (error) {
    return (
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <TrendingUp className="w-5 h-5 text-blue-600 mr-3" />
            Schedule Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 text-sm">Failed to load schedule data</p>
            <p className="text-gray-500 text-xs mt-1">Please try refreshing the page</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading || !data) {
    return (
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <TrendingUp className="w-5 h-5 text-blue-600 mr-3" />
            Schedule Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-2 w-full" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
            <Skeleton className="h-48 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare chart data from burndown information
  const chartData = data.burndownData?.ideal?.map((idealValue: number, index: number) => ({
    day: `Day ${index + 1}`,
    ideal: idealValue,
    actual: data.burndownData?.actual?.[index] ?? null
  })) || [];

  // Filter out null values for the actual line (representing future days)
  const actualData = chartData.filter((item: any) => item.actual !== null);

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <TrendingUp className="w-5 h-5 text-blue-600 mr-3" />
            Schedule Health
          </CardTitle>
          <Badge 
            variant={data.status === "On Track" ? "default" : "destructive"}
            className={data.status === "On Track" ? "bg-green-100 text-green-800" : ""}
          >
            {data.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Sprint Progress */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-medium text-gray-600">
              Sprint {data.sprintNumber} Progress
            </span>
            <span className="text-2xl font-bold text-gray-900">
              {data.completionPercentage}%
            </span>
          </div>
          <Progress value={data.completionPercentage} className="h-2" />
        </div>

        {/* Sprint Metrics */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Planned Story Points</span>
            <span className="text-sm font-medium text-gray-900">{data.plannedPoints}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Completed Points</span>
            <span className="text-sm font-medium text-gray-900">{data.completedPoints}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Days Remaining</span>
            <span className="text-sm font-medium text-gray-900">{data.daysRemaining}</span>
          </div>
        </div>

        {/* Burndown Chart */}
        <div className="relative h-48 bg-gray-50 rounded-lg p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                label={{ value: 'Day', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                label={{ value: 'Story Points Remaining', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
              />
              <Legend 
                iconType="line"
                wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
              />
              <Line
                type="monotone"
                dataKey="ideal"
                stroke="#94A3B8"
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
                name="Ideal Burndown"
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#2563EB"
                strokeWidth={2}
                dot={{ fill: '#2563EB', r: 3 }}
                connectNulls={false}
                name="Actual Progress"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
