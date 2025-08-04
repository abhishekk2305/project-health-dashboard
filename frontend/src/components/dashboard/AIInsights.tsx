import { Brain, Lightbulb, BarChart3, CheckSquare, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { queryClient } from "@/lib/queryClient";

interface AIInsightsProps {
  data?: any;
  isLoading: boolean;
  error?: Error | null;
}

/**
 * AI-powered insights component providing project analysis and recommendations
 * Displays key recommendations, performance metrics, and suggested action items
 */
export function AIInsights({ data, isLoading, error }: AIInsightsProps) {
  /**
   * Handle insights regeneration
   */
  const handleRegenerateInsights = async () => {
    await queryClient.invalidateQueries({ queryKey: ["/api/insights"] });
  };

  if (error) {
    return (
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Brain className="w-5 h-5 text-green-600 mr-3" />
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 text-sm">Failed to load insights</p>
            <p className="text-gray-500 text-xs mt-1">
              Insights may not be available or there was an error generating recommendations
            </p>
            <Button 
              onClick={handleRegenerateInsights}
              variant="outline"
              className="mt-4"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
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
            <Brain className="w-5 h-5 text-green-600 mr-3" />
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Skeleton className="h-4 w-3/4" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <Skeleton className="h-4 w-3/4" />
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format generated time
  const getGeneratedTime = () => {
    if (!data.generatedAt) return "Unknown";
    
    const generated = new Date(data.generatedAt);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - generated.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
    return `${Math.floor(diffMinutes / 1440)} days ago`;
  };

  /**
   * Get priority styling for recommendations and action items
   */
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': case 'opportunity': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  /**
   * Get action item styling based on priority
   */
  const getActionItemStyling = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-yellow-50 border-yellow-200';
      case 'opportunity': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getActionItemTextColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'text-red-900';
      case 'medium': return 'text-yellow-900';
      case 'opportunity': return 'text-green-900';
      default: return 'text-gray-900';
    }
  };

  const getActionItemSubtextColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'opportunity': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <Brain className="w-5 h-5 text-green-600 mr-3" />
            AI-Powered Insights
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-blue-100 text-blue-800">
              Updated {getGeneratedTime()}
            </Badge>
            <Button
              onClick={handleRegenerateInsights}
              variant="ghost"
              size="sm"
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Key Recommendations */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
              <Lightbulb className="w-4 h-4 text-yellow-600 mr-2" />
              Key Recommendations
            </h4>
            <div className="space-y-4">
              {data.recommendations?.map((rec: any, index: number) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${getPriorityColor(rec.priority)}`}></div>
                  <div>
                    <p className="text-sm text-gray-900 font-medium">{rec.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="w-4 h-4 text-blue-600 mr-2" />
              Performance Metrics
            </h4>
            <div className="space-y-4">
              {Object.entries(data.performanceMetrics || {}).map(([key, metric]: [string, any]) => (
                <div key={key} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                    <span className={`text-sm flex items-center ${
                      metric.direction === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.direction === 'up' ? '↑' : '↓'} {Math.abs(metric.value)}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">{metric.comparison}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Items */}
        <div className="">
          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
            <CheckSquare className="w-4 h-4 text-blue-600 mr-2" />
            Suggested Action Items
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.actionItems?.map((item: any, index: number) => (
              <div 
                key={index} 
                className={`rounded-lg p-4 border ${getActionItemStyling(item.priority)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${getActionItemTextColor(item.priority)}`}>
                    {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} Priority
                  </span>
                  <span className={`text-xs ${getActionItemSubtextColor(item.priority)}`}>
                    Due: {item.dueDate}
                  </span>
                </div>
                <p className={`text-sm ${getActionItemTextColor(item.priority)}`}>
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
