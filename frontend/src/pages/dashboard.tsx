import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TopNavigation } from "@/components/dashboard/TopNavigation";
import { KPICards } from "@/components/dashboard/KPICards";
import { SchedulePanel } from "@/components/dashboard/SchedulePanel";
import { BudgetPanel } from "@/components/dashboard/BudgetPanel";
import { RiskPanel } from "@/components/dashboard/RiskPanel";
import { AIInsights } from "@/components/dashboard/AIInsights";
import { TimeRangeSelector } from "@/components/dashboard/TimeRangeSelector";
import { ExportButton } from "@/components/dashboard/ExportButton";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

/**
 * Main dashboard page component that orchestrates all dashboard panels
 * Handles data fetching, loading states, and error handling for the entire dashboard
 */
export default function Dashboard() {
  const [timeRange, setTimeRange] = useState("current_sprint");
  // Fetch all dashboard data
  const scheduleQuery = useQuery({
    queryKey: ["/api/schedule"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const budgetQuery = useQuery({
    queryKey: ["/api/budget"],
    staleTime: 5 * 60 * 1000,
  });

  const risksQuery = useQuery({
    queryKey: ["/api/risks"],
    staleTime: 5 * 60 * 1000,
  });

  const insightsQuery = useQuery({
    queryKey: ["/api/insights"],
    staleTime: 10 * 60 * 1000, // 10 minutes for insights
  });

  /**
   * Handles manual refresh of all dashboard data
   */
  const handleRefresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["/api/schedule"] }),
      queryClient.invalidateQueries({ queryKey: ["/api/budget"] }),
      queryClient.invalidateQueries({ queryKey: ["/api/risks"] }),
      queryClient.invalidateQueries({ queryKey: ["/api/insights"] }),
    ]);
  };

  const isLoading = scheduleQuery.isLoading || budgetQuery.isLoading || risksQuery.isLoading;
  const hasError = scheduleQuery.error || budgetQuery.error || risksQuery.error;

  // Format last updated time
  const getLastUpdated = () => {
    const times = [
      scheduleQuery.data?.lastUpdated,
      budgetQuery.data?.lastUpdated,
      risksQuery.data?.lastUpdated
    ].filter(Boolean) as string[];
    
    if (times.length === 0) return "Never";
    
    const mostRecent = new Date(Math.max(...times.map(t => new Date(t).getTime())));
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - mostRecent.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
    return `${Math.floor(diffMinutes / 1440)} days ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Enhanced Dashboard Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Project Overview</h2>
            <p className="text-sm text-gray-600 mt-1">
              Last updated {getLastUpdated()}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <TimeRangeSelector 
              currentRange={timeRange}
              onRangeChange={setTimeRange}
            />
            <ExportButton 
              onExport={(format) => {
                alert(`Exporting dashboard as ${format.toUpperCase()}...\nThis would generate a comprehensive report with all current data and visualizations.`);
              }}
            />
            <Button
              onClick={handleRefresh}
              variant="outline"
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        {/* Top-line KPI Cards */}
        <div className="mb-8">
          <KPICards 
            scheduleData={scheduleQuery.data}
            budgetData={budgetQuery.data}
            risksData={risksQuery.data}
            isLoading={isLoading}
          />
        </div>

        {/* Error State */}
        {hasError && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Unable to load dashboard data
                </h3>
                <p className="mt-1 text-sm text-red-700">
                  Some dashboard panels may not display current information. Try refreshing the page.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Layout - Enhanced Visual Hierarchy */}
        <div className="space-y-8">
          {/* Top Row - Schedule and Budget */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SchedulePanel 
              data={scheduleQuery.data} 
              isLoading={scheduleQuery.isLoading}
              error={scheduleQuery.error}
            />
            <BudgetPanel 
              data={budgetQuery.data} 
              isLoading={budgetQuery.isLoading}
              error={budgetQuery.error}
            />
          </div>

          {/* AI Insights - Enhanced Prominence */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-1 rounded-xl">
            <AIInsights 
              data={insightsQuery.data}
              isLoading={insightsQuery.isLoading}
              error={insightsQuery.error}
            />
          </div>

          {/* Risk Panel - Full Width */}
          <RiskPanel 
            data={risksQuery.data} 
            isLoading={risksQuery.isLoading}
            error={risksQuery.error}
          />
        </div>
      </main>
    </div>
  );
}
