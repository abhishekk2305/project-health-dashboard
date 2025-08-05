import { apiRequest } from "@/lib/queryClient";

/**
 * API client for Project Health Dashboard
 * Provides typed methods for interacting with backend endpoints
 */

export interface ScheduleResponse {
  id: string;
  sprintNumber: number;
  plannedPoints: number;
  completedPoints: number;
  daysRemaining: number;
  completionPercentage: number;
  status: string;
  burndownData: {
    ideal: number[];
    actual: (number | null)[];
  };
  lastUpdated: string;
}

export interface BudgetResponse {
  id: string;
  totalBudget: number;
  spentAmount: number;
  remainingBudget: number;
  burnRate: number;
  projectedCompletion: number;
  status: string;
  monthlySpend: Record<string, number>;
  lastUpdated: string;
}

export interface RiskData {
  id: string;
  description: string;
  category: string;
  severity: number;
  impact: string;
  probability: string;
  status: string;
  createdAt: string;
}

export interface RisksResponse {
  risks: RiskData[];
  summary: {
    total: number;
    high: number;
    medium: number;
    low: number;
  };
  lastUpdated: string;
}

export interface InsightsResponse {
  id: string;
  recommendations: Array<{
    priority: string;
    title: string;
    description: string;
    category: string;
  }>;
  performanceMetrics: Record<string, {
    value: number;
    direction: 'up' | 'down';
    comparison: string;
  }>;
  actionItems: Array<{
    priority: string;
    title: string;
    dueDate: string;
    category: string;
  }>;
  generatedAt: string;
}

/**
 * Dashboard API methods
 */
export const dashboardApi = {
  /**
   * Fetch current schedule data including sprint progress and burndown chart
   */
  async getScheduleData(): Promise<ScheduleResponse> {
    const response = await apiRequest("GET", "/api/schedule");
    return response.json();
  },

  /**
   * Fetch current budget data including spend tracking and projections
   */
  async getBudgetData(): Promise<BudgetResponse> {
    const response = await apiRequest("GET", "/api/budget");
    return response.json();
  },

  /**
   * Fetch risk register data with optional filtering
   */
  async getRisksData(params?: { minSeverity?: number; limit?: number }): Promise<RisksResponse> {
    const queryParams = new URLSearchParams();
    if (params?.minSeverity) queryParams.set('minSeverity', params.minSeverity.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    
    const url = `/api/risks${queryParams.toString() ? `?${queryParams}` : ''}`;
    const response = await apiRequest("GET", url);
    return response.json();
  },

  /**
   * Fetch AI-generated project insights
   */
  async getInsights(): Promise<InsightsResponse> {
    const response = await apiRequest("GET", "/api/insights");
    return response.json();
  },

  /**
   * Generate new insights based on current project data
   */
  async generateInsights(projectData: {
    scheduleData?: any;
    budgetData?: any;
    riskData?: any;
  }): Promise<InsightsResponse> {
    const response = await apiRequest("POST", "/api/insights", projectData);
    return response.json();
  },

  /**
   * Create a new risk entry
   */
  async createRisk(riskData: Omit<RiskData, 'id' | 'createdAt'>): Promise<RiskData> {
    const response = await apiRequest("POST", "/api/risks", riskData);
    return response.json();
  },

  /**
   * Update an existing risk entry
   */
  async updateRisk(id: string, updateData: Partial<Omit<RiskData, 'id' | 'createdAt'>>): Promise<RiskData> {
    const response = await apiRequest("PUT", `/api/risks/${id}`, updateData);
    return response.json();
  },

  /**
   * Delete a risk entry
   */
  async deleteRisk(id: string): Promise<void> {
    await apiRequest("DELETE", `/api/risks/${id}`);
  },

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<{ status: string; timestamp: string; version: string }> {
    const response = await apiRequest("GET", "/api/health");
    return response.json();
  }
};
