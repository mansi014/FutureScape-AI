import { Router, type IRouter } from "express";
import { desc, sql, count, avg } from "drizzle-orm";
import { db, scenariosTable, simulationsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/stats/dashboard", async (_req, res): Promise<void> => {
  const [scenarioStats] = await db
    .select({ total: count() })
    .from(scenariosTable);

  const [simStats] = await db
    .select({
      total: count(),
      avgScore: avg(simulationsTable.probabilityScore),
    })
    .from(simulationsTable);

  const [topCat] = await db
    .select({
      category: scenariosTable.category,
      cnt: count(),
    })
    .from(scenariosTable)
    .groupBy(scenariosTable.category)
    .orderBy(desc(count()))
    .limit(1);

  const [todayStats] = await db
    .select({ cnt: count() })
    .from(scenariosTable)
    .where(sql`${scenariosTable.createdAt} >= current_date`);

  res.json({
    totalScenarios: Number(scenarioStats?.total ?? 0),
    totalSimulations: Number(simStats?.total ?? 0),
    avgProbabilityScore: Math.round(Number(simStats?.avgScore ?? 50)),
    topCategory: topCat?.category ?? "Technology",
    scenariosToday: Number(todayStats?.cnt ?? 0),
  });
});

router.get("/stats/recent", async (_req, res): Promise<void> => {
  const recent = await db
    .select({
      id: scenariosTable.id,
      prompt: scenariosTable.prompt,
      category: scenariosTable.category,
      createdAt: scenariosTable.createdAt,
      probabilityScore: simulationsTable.probabilityScore,
    })
    .from(scenariosTable)
    .leftJoin(simulationsTable, sql`${simulationsTable.scenarioId} = ${scenariosTable.id}`)
    .orderBy(desc(scenariosTable.createdAt))
    .limit(10);

  res.json(
    recent.map((r) => ({
      id: r.id,
      prompt: r.prompt,
      category: r.category,
      probabilityScore: r.probabilityScore ?? null,
      createdAt: r.createdAt.toISOString(),
    }))
  );
});

router.get("/stats/popular", async (_req, res): Promise<void> => {
  const popular = await db
    .select({
      category: scenariosTable.category,
      cnt: count(),
      avgScore: avg(simulationsTable.probabilityScore),
    })
    .from(scenariosTable)
    .leftJoin(simulationsTable, sql`${simulationsTable.scenarioId} = ${scenariosTable.id}`)
    .groupBy(scenariosTable.category)
    .orderBy(desc(count()))
    .limit(10);

  res.json(
    popular.map((p) => ({
      category: p.category,
      count: Number(p.cnt),
      avgScore: Math.round(Number(p.avgScore ?? 50)),
    }))
  );
});

export default router;
