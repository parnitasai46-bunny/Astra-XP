import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { sessions } from "@db/schema";
import { eq } from "drizzle-orm";

export const sessionRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        cityId: z.number(),
        temperatureScore: z.number().optional(),
        waterSecurityScore: z.number().optional(),
        vegetationHealth: z.number().optional(),
        airQuality: z.number().optional(),
        climateRiskScore: z.number().optional(),
        sustainabilityScore: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const scores = {
        temperatureScore: input.temperatureScore ?? Math.round(40 + Math.random() * 40),
        waterSecurityScore: input.waterSecurityScore ?? Math.round(35 + Math.random() * 45),
        vegetationHealth: input.vegetationHealth ?? Math.round(30 + Math.random() * 50),
        airQuality: input.airQuality ?? Math.round(45 + Math.random() * 40),
        climateRiskScore: input.climateRiskScore ?? Math.round(30 + Math.random() * 50),
        sustainabilityScore: input.sustainabilityScore ?? Math.round(35 + Math.random() * 40),
      };
      const result = await db.insert(sessions).values({
        cityId: input.cityId,
        ...scores,
        status: "active",
      });
      return { id: Number(result[0].insertId), ...scores };
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(sessions)
        .where(eq(sessions.id, input.id));
      return result[0] || null;
    }),

  updateScores: publicQuery
    .input(
      z.object({
        id: z.number(),
        scores: z.record(z.string(), z.number()),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const updateData: Record<string, unknown> = { ...input.scores, updatedAt: new Date() };
      await db
        .update(sessions)
        .set(updateData)
        .where(eq(sessions.id, input.id));
      return { success: true };
    }),

  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(sessions);
  }),
});
