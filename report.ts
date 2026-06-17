import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { reports } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const reportRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        sessionId: z.number(),
        cityId: z.number(),
        currentConditions: z.string(),
        futureRisks: z.string(),
        interventionsTested: z.array(z.string()),
        bestOutcome: z.string(),
        sustainabilityScore: z.number(),
        aiRecommendations: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(reports).values({
        sessionId: input.sessionId,
        cityId: input.cityId,
        currentConditions: input.currentConditions,
        futureRisks: input.futureRisks,
        interventionsTested: input.interventionsTested,
        bestOutcome: input.bestOutcome,
        sustainabilityScore: input.sustainabilityScore,
        aiRecommendations: input.aiRecommendations,
      });
      return { id: Number(result[0].insertId) };
    }),

  getBySession: publicQuery
    .input(z.object({ sessionId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(reports)
        .where(eq(reports.sessionId, input.sessionId))
        .orderBy(desc(reports.createdAt));
      return result[0] || null;
    }),

  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(reports).orderBy(desc(reports.createdAt));
  }),
});
