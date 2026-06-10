import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, scenariosTable, simulationsTable } from "@workspace/db";
import { CompareScenariosBody } from "@workspace/api-zod";
import { generateSimulation } from "../lib/simulator";

const router: IRouter = Router();

router.post("/compare", async (req, res): Promise<void> => {
  const parsed = CompareScenariosBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { scenarioIdA, scenarioIdB } = parsed.data;

  const [scenarioA] = await db
    .select()
    .from(scenariosTable)
    .where(eq(scenariosTable.id, scenarioIdA));

  const [scenarioB] = await db
    .select()
    .from(scenariosTable)
    .where(eq(scenariosTable.id, scenarioIdB));

  if (!scenarioA || !scenarioB) {
    res.status(404).json({ error: "One or both scenarios not found" });
    return;
  }

  let [simA] = await db
    .select()
    .from(simulationsTable)
    .where(eq(simulationsTable.scenarioId, scenarioIdA))
    .orderBy(desc(simulationsTable.createdAt))
    .limit(1);

  let [simB] = await db
    .select()
    .from(simulationsTable)
    .where(eq(simulationsTable.scenarioId, scenarioIdB))
    .orderBy(desc(simulationsTable.createdAt))
    .limit(1);

  if (!simA) {
    const data = generateSimulation(scenarioA.prompt, scenarioA.category);
    const [newSim] = await db
      .insert(simulationsTable)
      .values({ scenarioId: scenarioA.id, ...data })
      .returning();
    simA = newSim;
  }

  if (!simB) {
    const data = generateSimulation(scenarioB.prompt, scenarioB.category);
    const [newSim] = await db
      .insert(simulationsTable)
      .values({ scenarioId: scenarioB.id, ...data })
      .returning();
    simB = newSim;
  }

  const scoreA = simA.probabilityScore;
  const scoreB = simB.probabilityScore;
  const winner = scoreA > scoreB ? scenarioA.prompt : scoreB > scoreA ? scenarioB.prompt : "Tie";
  const diff = Math.abs(scoreA - scoreB);
  const verdict =
    diff < 5
      ? "Both alternate realities are nearly equally plausible. Small differences in initial conditions would determine which timeline emerges."
      : diff < 20
      ? `The scenarios diverge meaningfully. Scenario A scores ${scoreA} vs Scenario B at ${scoreB} — a notable difference in civilizational viability.`
      : `A decisive split in probability. One alternate timeline is significantly more viable than the other, suggesting the scenarios have fundamentally different stabilization dynamics.`;

  const formatSim = (sim: typeof simA) => ({
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

  const formatScenario = (s: typeof scenarioA, hasSim: boolean) => ({
    id: s.id,
    prompt: s.prompt,
    category: s.category,
    simulationCount: s.simulationCount,
    hasSimulation: hasSim,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  });

  res.json({
    scenarioA: formatScenario(scenarioA, true),
    scenarioB: formatScenario(scenarioB, true),
    simulationA: formatSim(simA),
    simulationB: formatSim(simB),
    verdict,
    winner,
  });
});

export default router;
