import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const scheduleData = pgTable("schedule_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sprintNumber: integer("sprint_number").notNull(),
  plannedPoints: integer("planned_points").notNull(),
  completedPoints: integer("completed_points").notNull(),
  daysRemaining: integer("days_remaining").notNull(),
  burndownData: jsonb("burndown_data").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const budgetData = pgTable("budget_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  totalBudget: real("total_budget").notNull(),
  spentAmount: real("spent_amount").notNull(),
  burnRate: real("burn_rate").notNull(),
  projectedCompletion: real("projected_completion").notNull(),
  monthlySpend: jsonb("monthly_spend").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const riskData = pgTable("risk_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  description: text("description").notNull(),
  category: text("category").notNull(),
  severity: integer("severity").notNull(), // 1-5 scale
  impact: text("impact").notNull(),
  probability: text("probability").notNull(),
  status: text("status").notNull().default("open"),
  owner: text("owner"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projectInsights = pgTable("project_insights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  recommendations: jsonb("recommendations").notNull(),
  performanceMetrics: jsonb("performance_metrics").notNull(),
  actionItems: jsonb("action_items").notNull(),
  lastGenerated: timestamp("last_generated").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertScheduleSchema = createInsertSchema(scheduleData).omit({
  id: true,
  createdAt: true,
});

export const insertBudgetSchema = createInsertSchema(budgetData).omit({
  id: true,
  createdAt: true,
});

export const insertRiskSchema = createInsertSchema(riskData).omit({
  id: true,
  createdAt: true,
});

export const insertInsightsSchema = createInsertSchema(projectInsights).omit({
  id: true,
  lastGenerated: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type ScheduleData = typeof scheduleData.$inferSelect;
export type BudgetData = typeof budgetData.$inferSelect;
export type RiskData = typeof riskData.$inferSelect;
export type ProjectInsights = typeof projectInsights.$inferSelect;
export type InsertScheduleData = z.infer<typeof insertScheduleSchema>;
export type InsertBudgetData = z.infer<typeof insertBudgetSchema>;
export type InsertRiskData = z.infer<typeof insertRiskSchema>;
export type InsertProjectInsights = z.infer<typeof insertInsightsSchema>;
