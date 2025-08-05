import { 
  type User, 
  type InsertUser, 
  type ScheduleData, 
  type BudgetData, 
  type RiskData, 
  type ProjectInsights,
  type InsertScheduleData,
  type InsertBudgetData,
  type InsertRiskData,
  type InsertProjectInsights
} from "@shared/schema";
import { randomUUID } from "crypto";

/**
 * Storage interface for Project Health Dashboard data operations
 */
export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Schedule management
  getLatestScheduleData(): Promise<ScheduleData | undefined>;
  createScheduleData(data: InsertScheduleData): Promise<ScheduleData>;
  updateScheduleData(id: string, data: Partial<InsertScheduleData>): Promise<ScheduleData | undefined>;
  
  // Budget management
  getLatestBudgetData(): Promise<BudgetData | undefined>;
  createBudgetData(data: InsertBudgetData): Promise<BudgetData>;
  updateBudgetData(id: string, data: Partial<InsertBudgetData>): Promise<BudgetData | undefined>;
  
  // Risk management
  getAllRisks(): Promise<RiskData[]>;
  getRisksBySeverity(minSeverity: number): Promise<RiskData[]>;
  createRisk(data: InsertRiskData): Promise<RiskData>;
  updateRisk(id: string, data: Partial<InsertRiskData>): Promise<RiskData | undefined>;
  deleteRisk(id: string): Promise<boolean>;
  
  // Insights management
  getLatestInsights(): Promise<ProjectInsights | undefined>;
  createInsights(data: InsertProjectInsights): Promise<ProjectInsights>;
}

/**
 * In-memory storage implementation for development and testing
 */
export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private scheduleData: Map<string, ScheduleData>;
  private budgetData: Map<string, BudgetData>;
  private riskData: Map<string, RiskData>;
  private insights: Map<string, ProjectInsights>;

  constructor() {
    this.users = new Map();
    this.scheduleData = new Map();
    this.budgetData = new Map();
    this.riskData = new Map();
    this.insights = new Map();
    
    // Initialize with sample data for development
    this.initializeSampleData();
  }

  /**
   * Initialize storage with realistic project data
   */
  private async initializeSampleData(): Promise<void> {
    // Create sample schedule data
    const scheduleId = randomUUID();
    const sampleSchedule: ScheduleData = {
      id: scheduleId,
      sprintNumber: 12,
      plannedPoints: 89,
      completedPoints: 65,
      daysRemaining: 4,
      burndownData: {
        ideal: [89, 80, 71, 62, 53, 44, 35, 26, 17, 8, 0],
        actual: [89, 82, 76, 68, 59, 52, 41, 32, 24, 15, null]
      },
      createdAt: new Date(),
    };
    this.scheduleData.set(scheduleId, sampleSchedule);

    // Create sample budget data
    const budgetId = randomUUID();
    const sampleBudget: BudgetData = {
      id: budgetId,
      totalBudget: 125000,
      spentAmount: 97500,
      burnRate: 78,
      projectedCompletion: 128750,
      monthlySpend: {
        Jan: 8500,
        Feb: 12000,
        Mar: 15000,
        Apr: 18000,
        May: 22000,
        Jun: 22000
      },
      createdAt: new Date(),
    };
    this.budgetData.set(budgetId, sampleBudget);

    // Create sample risk data
    const risks = [
      {
        id: randomUUID(),
        description: "API Dependencies",
        category: "Technical",
        severity: 4,
        impact: "Third-party service availability could block critical features",
        probability: "High",
        status: "open",
        owner: "Sarah Chen",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        description: "Resource Allocation",
        category: "Resource",
        severity: 4,
        impact: "Developer availability constraints affecting delivery timeline",
        probability: "Medium",
        status: "mitigated",
        owner: "Mike Rodriguez",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        description: "Scope Creep",
        category: "Business",
        severity: 4,
        impact: "Unplanned feature requests increasing project complexity",
        probability: "High",
        status: "open",
        owner: "Jenny Liu",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        description: "Performance Issues",
        category: "Technical",
        severity: 3,
        impact: "Database query optimization needed for scalability",
        probability: "Medium",
        status: "in_progress",
        owner: "Alex Kumar",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        description: "Security Compliance",
        category: "Compliance",
        severity: 2,
        impact: "GDPR and SOC2 requirements need implementation",
        probability: "Low",
        status: "open",
        owner: "David Park",
        createdAt: new Date(),
      },
    ];

    risks.forEach(risk => {
      this.riskData.set(risk.id, risk);
    });

    // Create sample insights
    const insightsId = randomUUID();
    const sampleInsights: ProjectInsights = {
      id: insightsId,
      recommendations: [
        {
          priority: "High",
          title: "Critical API Dependency Risk",
          description: "3rd party service outages could delay Sprint 12 completion by 5-7 days. Implement circuit breakers and retry logic.",
          impact: "Potential $15K cost overrun if delayed",
          category: "risk_mitigation"
        },
        {
          priority: "Medium", 
          title: "Budget Variance Alert",
          description: "Current burn rate shows 103% of planned spend. Reallocate 2 junior dev hours to optimize costs.",
          impact: "Save $3.8K over remaining project timeline",
          category: "budget_optimization"
        },
        {
          priority: "Low",
          title: "Velocity Optimization Opportunity", 
          description: "Team delivering 15% above baseline. Consider advancing 2-3 features from Sprint 13 backlog.",
          impact: "Accelerate delivery by 1-2 weeks",
          category: "schedule_optimization"
        }
      ],
      performanceMetrics: {
        teamVelocityTrend: { value: 15, direction: "up", comparison: "15% above 3-sprint baseline (32 story points vs 28 avg)" },
        riskMitigationRate: { value: -12, direction: "down", comparison: "Only 2 of 5 high-severity risks closed this month" },
        codeQualityScore: { value: 87, direction: "up", comparison: "Up 5 points: 94% test coverage, 0 critical bugs" },
        budgetEfficiency: { value: 97, direction: "down", comparison: "3% over planned burn rate, trending toward overrun" }
      },
      actionItems: [
        {
          priority: "high",
          title: "Schedule architecture review for API fallback strategy",
          dueDate: "2 days",
          category: "technical"
        },
        {
          priority: "medium",
          title: "Review and optimize resource allocation plan",
          dueDate: "1 week",
          category: "resource"
        },
        {
          priority: "opportunity",
          title: "Evaluate Sprint 13 features for early delivery",
          dueDate: "Consider",
          category: "schedule"
        }
      ],
      lastGenerated: new Date(),
    };
    this.insights.set(insightsId, sampleInsights);
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Schedule methods
  async getLatestScheduleData(): Promise<ScheduleData | undefined> {
    const allSchedules = Array.from(this.scheduleData.values());
    return allSchedules.sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    )[0];
  }

  async createScheduleData(data: InsertScheduleData): Promise<ScheduleData> {
    const id = randomUUID();
    const scheduleData: ScheduleData = { 
      ...data, 
      id, 
      createdAt: new Date() 
    };
    this.scheduleData.set(id, scheduleData);
    return scheduleData;
  }

  async updateScheduleData(id: string, data: Partial<InsertScheduleData>): Promise<ScheduleData | undefined> {
    const existing = this.scheduleData.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...data };
    this.scheduleData.set(id, updated);
    return updated;
  }

  // Budget methods
  async getLatestBudgetData(): Promise<BudgetData | undefined> {
    const allBudgets = Array.from(this.budgetData.values());
    return allBudgets.sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    )[0];
  }

  async createBudgetData(data: InsertBudgetData): Promise<BudgetData> {
    const id = randomUUID();
    const budgetData: BudgetData = { 
      ...data, 
      id, 
      createdAt: new Date() 
    };
    this.budgetData.set(id, budgetData);
    return budgetData;
  }

  async updateBudgetData(id: string, data: Partial<InsertBudgetData>): Promise<BudgetData | undefined> {
    const existing = this.budgetData.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...data };
    this.budgetData.set(id, updated);
    return updated;
  }

  // Risk methods
  async getAllRisks(): Promise<RiskData[]> {
    return Array.from(this.riskData.values()).sort((a, b) => b.severity - a.severity);
  }

  async getRisksBySeverity(minSeverity: number): Promise<RiskData[]> {
    return Array.from(this.riskData.values())
      .filter(risk => risk.severity >= minSeverity)
      .sort((a, b) => b.severity - a.severity);
  }

  async createRisk(data: InsertRiskData): Promise<RiskData> {
    const id = randomUUID();
    const risk: RiskData = { 
      ...data, 
      id, 
      status: data.status || "open",
      createdAt: new Date() 
    };
    this.riskData.set(id, risk);
    return risk;
  }

  async updateRisk(id: string, data: Partial<InsertRiskData>): Promise<RiskData | undefined> {
    const existing = this.riskData.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...data };
    this.riskData.set(id, updated);
    return updated;
  }

  async deleteRisk(id: string): Promise<boolean> {
    return this.riskData.delete(id);
  }

  // Insights methods
  async getLatestInsights(): Promise<ProjectInsights | undefined> {
    const allInsights = Array.from(this.insights.values());
    return allInsights.sort((a, b) => 
      new Date(b.lastGenerated!).getTime() - new Date(a.lastGenerated!).getTime()
    )[0];
  }

  async createInsights(data: InsertProjectInsights): Promise<ProjectInsights> {
    const id = randomUUID();
    const insights: ProjectInsights = { 
      ...data, 
      id, 
      lastGenerated: new Date() 
    };
    this.insights.set(id, insights);
    return insights;
  }
}

export const storage = new MemStorage();
