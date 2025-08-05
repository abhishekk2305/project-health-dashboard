import { useState } from "react";
import { TrendingUp, DollarSign, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SprintProgressModal, BudgetDetailsModal } from "./DrillDownModals";

interface KPICardsProps {
  scheduleData?: any;
  budgetData?: any;
  risksData?: any;
  isLoading: boolean;
}

/**
 * Top-line KPI cards displaying headline metrics
 * Shows Sprint Progress, Budget Burn, and High-Severity Risks at a glance
 */
export function KPICards({ scheduleData, budgetData, risksData, isLoading }: KPICardsProps) {
  const [sprintModalOpen, setSprintModalOpen] = useState(false);
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const sprintProgress = scheduleData?.completionPercentage || 0;
  const budgetBurn = budgetData?.burnRate || 0;
  const highRisks = risksData?.summary?.high || 0;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sprint Progress KPI - Clickable */}
        <Card 
          className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-blue-500 cursor-pointer hover:shadow-lg" 
          onClick={() => setSprintModalOpen(true)}
          role="button"
          tabIndex={0}
          aria-label="View detailed sprint progress information"
          onKeyDown={(e) => e.key === 'Enter' && setSprintModalOpen(true)}
        >
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Sprint Progress</p>
              <p className="text-2xl font-bold text-gray-900">{sprintProgress}%</p>
              <p className="text-xs text-gray-500">
                {scheduleData?.completedPoints || 0} of {scheduleData?.plannedPoints || 0} points
              </p>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              sprintProgress >= 70 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {scheduleData?.status || 'Unknown'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Burn KPI - Clickable */}
      <Card 
        className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-yellow-500 cursor-pointer hover:shadow-lg"
        onClick={() => setBudgetModalOpen(true)}
        role="button"
        tabIndex={0}
        aria-label="View detailed budget analysis and spending trends"
        onKeyDown={(e) => e.key === 'Enter' && setBudgetModalOpen(true)}
      >
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <DollarSign className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Budget Burn</p>
              <p className="text-2xl font-bold text-gray-900">{budgetBurn}%</p>
              <p className="text-xs text-gray-500">
                ${(budgetData?.spentAmount || 0).toLocaleString()} spent
              </p>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              budgetBurn <= 70 ? 'bg-green-100 text-green-800' : 
              budgetBurn <= 80 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }`}>
              {budgetData?.status || 'Unknown'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* High-Severity Risks KPI */}
      <Card className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-red-500">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">High-Severity Risks</p>
              <p className="text-2xl font-bold text-gray-900">{highRisks}</p>
              <p className="text-xs text-gray-500">
                {risksData?.summary?.total || 0} total risks
              </p>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              highRisks === 0 ? 'bg-green-100 text-green-800' : 
              highRisks <= 2 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }`}>
              {highRisks === 0 ? 'Low Risk' : highRisks <= 2 ? 'Medium Risk' : 'High Risk'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

      {/* Drill-down Modals */}
      <SprintProgressModal 
        isOpen={sprintModalOpen}
        onClose={() => setSprintModalOpen(false)}
        scheduleData={scheduleData}
      />
      <BudgetDetailsModal 
        isOpen={budgetModalOpen}
        onClose={() => setBudgetModalOpen(false)}
        budgetData={budgetData}
      />
    </>
  );
}