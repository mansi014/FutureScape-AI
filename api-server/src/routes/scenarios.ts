import { Router, type IRouter } from "express";
import { eq, desc, sql } from "drizzle-orm";
import { db, scenariosTable, simulationsTable } from "@workspace/db";
import {
  ListScenariosQueryParams,
  CreateScenarioBody,
  GetScenarioParams,
  DeleteScenarioParams,
  RunSimulationParams,
  GetSimulationParams,
} from "@workspace/api-zod";
import { generateSimulation } from "../lib/simulator";

const router: IRouter = Router();

router.get("/scenarios", async (req, res): Promise<void> => {
  const query = ListScenariosQueryParams.safeParse(req.query);
  const limit = query.success ? (query.data.limit ?? 20) : 20;
  const offset = query.success ? (query.data.offset ?? 0) : 0;

  const scenarios = await db
    .select()
    .from(scenariosTable)
    .orderBy(desc(scenariosTable.createdAt))
    .limit(limit)
    .offset(offset);

  const latestSims = await db
    .select({ scenarioId: simulationsTable.scenarioId })
    .from(simulationsTable);

  const hasSimSet = new Set(latestSims.map((s) => s.scenarioId));

  const result = scenarios.map((s) => ({
    id: s.id,
    prompt: s.prompt,
    category: s.category,
    simulationCount: s.simulationCount,
    hasSimulation: hasSimSet.has(s.id),
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  }));

  res.json(result);
});

router.post("/scenarios", async (req, res): Promise<void> => {
  const parsed = CreateScenarioBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [scenario] = await db
    .insert(scenariosTable)
    .values({ prompt: parsed.data.prompt, category: parsed.data.category })
    .returning();

  res.status(201).json({
    id: scenario.id,
    prompt: scenario.prompt,
    category: scenario.category,
    simulationCount: scenario.simulationCount,
    hasSimulation: false,
    createdAt: scenario.createdAt.toISOString(),
    updatedAt: scenario.updatedAt.toISOString(),
  });
});

router.get("/scenarios/:id", async (req, res): Promise<void> => {
  const params = GetScenarioParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [scenario] = await db
    .select()
    .from(scenariosTable)
    .where(eq(scenariosTable.id, params.data.id));

  if (!scenario) {
    res.status(404).json({ error: "Scenario not found" });
    return;
  }

  const [sim] = await db
    .select({ id: simulationsTable.id })
    .from(simulationsTable)
    .where(eq(simulationsTable.scenarioId, params.data.id))
    .limit(1);

  res.json({
    id: scenario.id,
    prompt: scenario.prompt,
    category: scenario.category,
    simulationCount: scenario.simulationCount,
    hasSimulation: !!sim,
    createdAt: scenario.createdAt.toISOString(),
    updatedAt: scenario.updatedAt.toISOString(),
  });
});

router.delete("/scenarios/:id", async (req, res): Promise<void> => {
  const params = DeleteScenarioParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(scenariosTable)
    .where(eq(scenariosTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Scenario not found" });
    return;
  }

  res.sendStatus(204);
});

router.post("/scenarios/:id/simulate", async (req, res): Promise<void> => {
  const params = RunSimulationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [scenario] = await db
    .select()
    .from(scenariosTable)
    .where(eq(scenariosTable.id, params.data.id));

  if (!scenario) {
    res.status(404).json({ error: "Scenario not found" });
    return;
  }

  const simData = generateSimulation(scenario.prompt, scenario.category);

  await db
    .delete(simulationsTable)
    .where(eq(simulationsTable.scenarioId, scenario.id));

  const [sim] = await db
    .insert(simulationsTable)
    .values({
      scenarioId: scenario.id,
      summary: simData.summary,
      probabilityScore: simData.probabilityScore,
      timeline: simData.timeline,
      domainImpacts: simData.domainImpacts,
      newsHeadlines: simData.newsHeadlines,
      butterflyNodes: simData.butterflyNodes,
      scores: simData.scores,
    })
    .returning();

  await db
    .update(scenariosTable)
    .set({ simulationCount: sql`${scenariosTable.simulationCount} + 1` })
    .where(eq(scenariosTable.id, scenario.id));

  res.json({
    id: sim.id,
    scenarioId: sim.scenarioId,
    summary: sim.summary,
    probabilityScore: sim.probabilityScore,
    timeline: sim.timeline,
    domainImpacts: sim.domainImpacts,
    newsHeadlines: sim.newsHeadlines,
    butterflyNodes: sim.butterflyNodes,
    scores: sim.scores,
    createdAt: sim.createdAt.toISOString(),
  });
});

router.get("/scenarios/:id/simulation", async (req, res): Promise<void> => {
  const params = GetSimulationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [scenario] = await db
    .select()
    .from(scenariosTable)
    .where(eq(scenariosTable.id, params.data.id));

  if (!scenario) {
    res.status(404).json({ error: "Scenario not found" });
    return;
  }

  const [sim] = await db
    .select()
    .from(simulationsTable)
    .where(eq(simulationsTable.scenarioId, params.data.id))
    .orderBy(desc(simulationsTable.createdAt))
    .limit(1);

  if (!sim) {
    res.status(404).json({ error: "No simulation found for this scenario" });
    return;
  }

  res.json({
    id: sim.id,
    scenarioId: sim.scenarioId,
    summary: sim.summary,
    probabilityScore: sim.probabilityScore,
    timeline: sim.timeline,
    domainImpacts: sim.domainImpacts,
    newsHeadlines: sim.newsHeadlines,
    butterflyNodes: sim.butterflyNodes,
    scores: sim.scores,
    createdAt: sim.createdAt.toISOString(),
  });
});

export default router;
