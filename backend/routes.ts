import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertScheduleSchema, 
  insertBudgetSchema, 
  insertRiskSchema, 
  insertInsightsSchema 
} from "@shared/schema";

/**
 * Register all API routes for the Project Health Dashboard
 * @param app Express application instance
 * @returns HTTP server instance
 */
export async function registerRoutes(app: Express): Promise<Server> {
  
  /**
   * GET /api/schedule
   * Retrieves the latest schedule data including sprint progress and burndown information
   */
  app.get("/api/schedule", async (req, res) => {
    try {
      const scheduleData = await storage.getLatestScheduleData();
      
      if (!scheduleData) {
        return res.status(404).json({ 
          message: "No schedule data found",
          error: "SCHEDULE_NOT_FOUND" 
        });
      }

      // Calculate completion percentage and status
      const completionPercentage = Math.round((scheduleData.completedPoints / scheduleData.plannedPoints) * 100);
      const isOnTrack = completionPercentage >= 70; // Business rule: 70% completion is considered on track
      
      const response = {
        ...scheduleData,
        completionPercentage,
        status: isOnTrack ? "On Track" : "Behind Schedule",
        lastUpdated: scheduleData.createdAt
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to retrieve schedule data", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  /**
   * GET /api/budget
   * Retrieves the latest budget data including spend tracking and burn rate
   */
  app.get("/api/budget", async (req, res) => {
    try {
      const budgetData = await storage.getLatestBudgetData();
      
      if (!budgetData) {
        return res.status(404).json({ 
          message: "No budget data found",
          error: "BUDGET_NOT_FOUND" 
        });
      }

      // Calculate budget status based on burn rate
      let status = "On Track";
      if (budgetData.burnRate > 80) {
        status = "Over Budget";
      } else if (budgetData.burnRate > 70) {
        status = "At Risk";
      }

      const remainingBudget = budgetData.totalBudget - budgetData.spentAmount;
      
      const response = {
        ...budgetData,
        remainingBudget,
        status,
        lastUpdated: budgetData.createdAt
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to retrieve budget data", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  /**
   * GET /api/risks
   * Retrieves all risk data, optionally filtered by minimum severity
   */
  app.get("/api/risks", async (req, res) => {
    try {
      const { minSeverity, limit } = req.query;
      
      let risks;
      if (minSeverity && !isNaN(Number(minSeverity))) {
        risks = await storage.getRisksBySeverity(Number(minSeverity));
      } else {
        risks = await storage.getAllRisks();
      }

      // Apply limit if specified
      if (limit && !isNaN(Number(limit))) {
        risks = risks.slice(0, Number(limit));
      }

      // Calculate risk summary statistics
      const riskStats = {
        total: risks.length,
        high: risks.filter(r => r.severity >= 4).length,
        medium: risks.filter(r => r.severity === 3).length,
        low: risks.filter(r => r.severity <= 2).length
      };

      const response = {
        risks,
        summary: riskStats,
        lastUpdated: new Date()
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to retrieve risk data", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  /**
   * POST /api/insights
   * Generates or retrieves AI-powered project insights based on current project data
   * Accepts project data payload and returns recommendations
   */
  app.post("/api/insights", async (req, res) => {
    try {
      const { scheduleData, budgetData, riskData } = req.body;

      // Get current insights or generate new ones
      let insights = await storage.getLatestInsights();
      
      // Simple rule-based insight generation (simulating AI recommendations)
      if (!insights || shouldRegenerateInsights(insights)) {
        const generatedInsights = await generateProjectInsights(scheduleData, budgetData, riskData);
        insights = await storage.createInsights(generatedInsights);
      }

      res.json({
        ...insights,
        generatedAt: insights.lastGenerated
      });
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to generate project insights", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  /**
   * GET /api/insights
   * Retrieves the latest project insights without regeneration
   */
  app.get("/api/insights", async (req, res) => {
    try {
      const insights = await storage.getLatestInsights();
      
      if (!insights) {
        return res.status(404).json({ 
          message: "No insights available. Generate insights by posting project data to /api/insights",
          error: "INSIGHTS_NOT_FOUND" 
        });
      }

      res.json({
        ...insights,
        generatedAt: insights.lastGenerated
      });
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to retrieve project insights", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  /**
   * POST /api/risks
   * Creates a new risk entry
   */
  app.post("/api/risks", async (req, res) => {
    try {
      const validatedData = insertRiskSchema.parse(req.body);
      const newRisk = await storage.createRisk(validatedData);
      
      res.status(201).json(newRisk);
    } catch (error) {
      res.status(400).json({ 
        message: "Failed to create risk", 
        error: error instanceof Error ? error.message : "Invalid risk data" 
      });
    }
  });

  /**
   * PUT /api/risks/:id
   * Updates an existing risk entry
   */
  app.put("/api/risks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const updatedRisk = await storage.updateRisk(id, updateData);
      
      if (!updatedRisk) {
        return res.status(404).json({ 
          message: "Risk not found",
          error: "RISK_NOT_FOUND" 
        });
      }

      res.json(updatedRisk);
    } catch (error) {
      res.status(400).json({ 
        message: "Failed to update risk", 
        error: error instanceof Error ? error.message : "Invalid update data" 
      });
    }
  });

  /**
   * DELETE /api/risks/:id
   * Deletes a risk entry
   */
  app.delete("/api/risks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteRisk(id);
      
      if (!deleted) {
        return res.status(404).json({ 
          message: "Risk not found",
          error: "RISK_NOT_FOUND" 
        });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to delete risk", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  /**
   * Health check endpoint
   */
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      version: "1.0.0"
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}

/**
 * Determines if insights should be regenerated based on age and data changes
 * @param insights Current insights object
 * @returns boolean indicating if regeneration is needed
 */
function shouldRegenerateInsights(insights: any): boolean {
  const maxAge = 10 * 60 * 1000; // 10 minutes in milliseconds
  const age = Date.now() - new Date(insights.lastGenerated).getTime();
  return age > maxAge;
}

/**
 * Generates project insights based on schedule, budget, and risk data
 * This simulates AI-powered analysis with rule-based recommendations
 * @param scheduleData Current schedule information
 * @param budgetData Current budget information  
 * @param riskData Current risk information
 * @returns Generated insights object
 */
async function generateProjectInsights(scheduleData: any, budgetData: any, riskData: any): Promise<any> {
  const recommendations = [];
  const actionItems = [];

  // Analyze schedule health
  if (scheduleData?.completionPercentage < 70) {
    recommendations.push({
      priority: "high",
      title: "Schedule recovery needed",
      description: "Current progress is behind schedule. Consider resource reallocation or scope adjustment.",
      category: "schedule_optimization"
    });
    
    actionItems.push({
      priority: "high",
      title: "Conduct schedule recovery planning session",
      dueDate: "3 days",
      category: "schedule"
    });
  } else if (scheduleData?.completionPercentage > 85) {
    recommendations.push({
      priority: "low",
      title: "Schedule acceleration opportunity",
      description: "Team is ahead of schedule. Consider pulling forward features from next sprint.",
      category: "schedule_optimization"
    });
  }

  // Analyze budget health
  if (budgetData?.burnRate > 80) {
    recommendations.push({
      priority: "high",
      title: "Critical: Budget overrun risk",
      description: "Current spend rate will exceed budget. Immediate cost control measures needed.",
      category: "budget_optimization"
    });
    
    actionItems.push({
      priority: "high",
      title: "Emergency budget review meeting",
      dueDate: "1 day",
      category: "budget"
    });
  } else if (budgetData?.burnRate > 70) {
    recommendations.push({
      priority: "medium",
      title: "Budget optimization opportunity",
      description: "Monitor spend rate closely. Consider optimizing resource allocation.",
      category: "budget_optimization"
    });
  }

  // Analyze risk data
  const highRisks = riskData?.filter((risk: any) => risk.severity >= 4) || [];
  if (highRisks.length > 2) {
    recommendations.push({
      priority: "high",
      title: "Urgent: Address high-severity risks",
      description: `${highRisks.length} high-severity risks identified. Implement mitigation strategies immediately.`,
      category: "risk_mitigation"
    });
    
    actionItems.push({
      priority: "high",
      title: "Risk mitigation strategy review",
      dueDate: "2 days",
      category: "risk"
    });
  }

  // Generate performance metrics
  const performanceMetrics = {
    teamVelocityTrend: { 
      value: scheduleData?.completionPercentage > 75 ? 15 : -5, 
      direction: scheduleData?.completionPercentage > 75 ? "up" : "down",
      comparison: "Compared to 3-sprint average" 
    },
    riskMitigationRate: { 
      value: highRisks.length > 2 ? -8 : 12, 
      direction: highRisks.length > 2 ? "down" : "up",
      comparison: `${highRisks.length} high-priority risks ${highRisks.length > 2 ? 'remain open' : 'successfully mitigated'}` 
    },
    codeQualityScore: { 
      value: 92, 
      direction: "up",
      comparison: "Based on test coverage and code reviews" 
    }
  };

  return {
    recommendations,
    performanceMetrics,
    actionItems
  };
}
