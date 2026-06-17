import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { generateAIResponse, analyzeEnvironment, generateReport } from "../lib/gemini";
import { getDb } from "../queries/connection";
import { chatMessages } from "@db/schema";
import { eq } from "drizzle-orm";

export const aiRouter = createRouter({
  chat: publicQuery
    .input(
      z.object({
        message: z.string(),
        sessionId: z.number(),
        context: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      
      await db.insert(chatMessages).values({
        sessionId: input.sessionId,
        role: "user",
        content: input.message,
      });

      const response = await generateAIResponse(input.message, input.context);

      await db.insert(chatMessages).values({
        sessionId: input.sessionId,
        role: "assistant",
        content: response,
      });

      return { response };
    }),

  getHistory: publicQuery
    .input(z.object({ sessionId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.sessionId, input.sessionId))
        .orderBy(chatMessages.createdAt);
    }),

  analyze: publicQuery
    .input(
      z.object({
        cityName: z.string(),
        scores: z.record(z.string(), z.number()),
        sessionId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      
      const analysis = await analyzeEnvironment(input.cityName, input.scores);

      await db.insert(chatMessages).values({
        sessionId: input.sessionId,
        role: "assistant",
        content: analysis,
      });

      return { analysis };
    }),

  generateReport: publicQuery
    .input(
      z.object({
        cityName: z.string(),
        scores: z.record(z.string(), z.number()),
        sessionId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const report = await generateReport(
        input.cityName,
        input.scores,
      );

      return { report };
    }),
});
