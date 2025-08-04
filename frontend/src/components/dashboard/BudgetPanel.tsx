import { DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface BudgetPanelProps {
  data?: any;
  isLoading: boolean;
  error?: Error | null;
}

/**
 * Budget health panel component displaying budget tracking and burn rate
 * Shows total budget, spent amount, burn rate with visual radial gauge
 */
export function BudgetPanel({ data, isLoading, error }: BudgetPanelProps) {
  if (error) {
    return (
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <DollarSign className="w-5 h-5 text-yellow-600 mr-3" />
            Budget Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 text-sm">Failed to load budget data</p>
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
            <DollarSign className="w-5 h-5 text-yellow-600 mr-3" />
            Budget Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-center">
              <Skeleton className="h-32 w-32 rounded-full" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare gauge data
  const burnRate = data.burnRate;
  const gaugeData = [
    { name: 'Used', value: burnRate, fill: burnRate > 80 ? '#EF4444' : burnRate > 70 ? '#F59E0B' : '#10B981' },
    { name: 'Remaining', value: 100 - burnRate, fill: '#E5E7EB' }
  ];

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Determine status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Track': return 'bg-green-100 text-green-800';
      case 'At Risk': return 'bg-yellow-100 text-yellow-800';
      case 'Over Budget': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <DollarSign className="w-5 h-5 text-yellow-600 mr-3" />
            Budget Health
          </CardTitle>
          <Badge className={getStatusColor(data.status)}>
            {data.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Radial Gauge */}
        <div className="flex justify-center">
          <div className="relative w-32 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gaugeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                >
                  {gaugeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-2xl font-bold text-gray-900">{burnRate}%</span>
              <span className="text-xs text-gray-500">Burn Rate</span>
            </div>
          </div>
        </div>

        {/* Budget Metrics */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Total Budget</span>
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(data.totalBudget)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Spent to Date</span>
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(data.spentAmount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Remaining</span>
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(data.remainingBudget)}
            </span>
          </div>
          <div className="flex justify-between border-t pt-3">
            <span className="text-sm text-gray-600">Projected Completion</span>
            <span className="text-sm font-medium text-yellow-600">
              {formatCurrency(data.projectedCompletion)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
