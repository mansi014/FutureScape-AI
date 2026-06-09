import { pgTable, text, serial, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const scenariosTable = pgTable("scenarios", {
  id: serial("id").primaryKey(),
  prompt: text("prompt").notNull(),
  category: text("category").notNull(),
  simulationCount: integer("simulation_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertScenarioSchema = createInsertSchema(scenariosTable).omit({ id: true, simulationCount: true, createdAt: true, updatedAt: true });
export type InsertScenario = z.infer<typeof insertScenarioSchema>;
export type Scenario = typeof scenariosTable.$inferSelect;

export const simulationsTable = pgTable("simulations", {
  id: serial("id").primaryKey(),
  scenarioId: integer("scenario_id").notNull().references(() => scenariosTable.id, { onDelete: "cascade" }),
  summary: text("summary").notNull(),
  probabilityScore: integer("probability_score").notNull().default(50),
  timeline: jsonb("timeline").notNull().default([]),
  domainImpacts: jsonb("domain_impacts").notNull().default([]),
  newsHeadlines: jsonb("news_headlines").notNull().default([]),
  butterflyNodes: jsonb("butterfly_nodes").notNull().default([]),
  scores: jsonb("scores").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSimulationSchema = createInsertSchema(simulationsTable).omit({ id: true, createdAt: true });
export type InsertSimulation = z.infer<typeof insertSimulationSchema>;
export type Simulation = typeof simulationsTable.$inferSelect;
