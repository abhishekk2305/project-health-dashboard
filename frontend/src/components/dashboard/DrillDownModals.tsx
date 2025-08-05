import { useState } from "react";
import { X, TrendingUp, Calendar, DollarSign, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface DrillDownModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

/**
 * Generic drill-down modal for detailed views
 */
function DrillDownModal({ isOpen, onClose, title, children }: DrillDownModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close detailed view"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Sprint Progress drill-down modal
 */
export function SprintProgressModal({ isOpen, onClose, scheduleData }: {
  isOpen: boolean;
  onClose: () => void;
  scheduleData?: any;
}) {
  const burndownData = scheduleData?.burndownData || [];
  
  return (
    <DrillDownModal isOpen={isOpen} onClose={onClose} title="Sprint 12 Progress Details">
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {scheduleData?.completionPercentage || 0}%
                </div>
                <div className="text-sm text-gray-600">Completion Rate</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {scheduleData?.completedPoints || 0}
                </div>
                <div className="text-sm text-gray-600">Points Completed</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {scheduleData?.daysRemaining || 0}
                </div>
                <div className="text-sm text-gray-600">Days Remaining</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Burndown Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sprint Burndown Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={burndownData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="remaining" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    name="Remaining Points"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="ideal" 
                    stroke="#64748b" 
                    strokeDasharray="5 5"
                    name="Ideal Burndown"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Team Velocity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Team Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current Velocity</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  32 points/sprint (+15% above baseline)
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Sprint Goal</span>
                <span className="text-sm font-medium">
                  Complete user authentication and dashboard features
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DrillDownModal>
  );
}

/**
 * Budget details drill-down modal
 */
export function BudgetDetailsModal({ isOpen, onClose, budgetData }: {
  isOpen: boolean;
  onClose: () => void;
  budgetData?: any;
}) {
  const monthlyData = budgetData?.monthlySpend ? 
    Object.entries(budgetData.monthlySpend).map(([month, amount]) => ({
      month,
      amount: amount as number,
      budget: 20833 // ~125k/6 months
    })) : [];

  return (
    <DrillDownModal isOpen={isOpen} onClose={onClose} title="Budget Analysis & Trends">
      <div className="space-y-6">
        {/* Budget Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">
                  ${(budgetData?.totalBudget || 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Budget</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">
                  ${(budgetData?.spentAmount || 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Spent to Date</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-xl font-bold text-orange-600">
                  ${((budgetData?.totalBudget || 0) - (budgetData?.spentAmount || 0)).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Remaining</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-xl font-bold text-red-600">
                  ${(budgetData?.projectedCompletion || 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Projected Total</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Spend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Spend vs Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="budget" fill="#e5e7eb" name="Monthly Budget" />
                  <Bar dataKey="amount" fill="#3b82f6" name="Actual Spend" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Expense Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { category: "Development Team", amount: 72000, percentage: 74 },
                { category: "Infrastructure", amount: 8500, percentage: 9 },
                { category: "Third-party Services", amount: 12000, percentage: 12 },
                { category: "Testing & QA", amount: 5000, percentage: 5 }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">${item.amount.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DrillDownModal>
  );
}