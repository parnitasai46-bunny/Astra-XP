import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { simulations } from "@db/schema";
import { eq } from "drizzle-orm";

function calculateScenarioImpact(
  scenarioType: string,
  intensity: number,
  currentScores: Record<string, number>
): Record<string, number> {
  const factor = intensity / 100;
  const impacts: Record<string, Record<string, number>> = {
    "population_growth": {
      temperatureScore: -15 * factor,
      waterSecurityScore: -20 * factor,
      vegetationHealth: -10 * factor,
      airQuality: -18 * factor,
      climateRiskScore: 12 * factor,
    },
    "heatwave_increase": {
      temperatureScore: -25 * factor,
      waterSecurityScore: -15 * factor,
      vegetationHealth: -20 * factor,
      airQuality: -12 * factor,
      climateRiskScore: 20 * factor,
    },
    "urban_expansion": {
      temperatureScore: -10 * factor,
      waterSecurityScore: -12 * factor,
      vegetationHealth: -25 * factor,
      airQuality: -15 * factor,
      climateRiskScore: 10 * factor,
    },
    "water_scarcity": {
      temperatureScore: -5 * factor,
      waterSecurityScore: -30 * factor,
      vegetationHealth: -18 * factor,
      airQuality: -5 * factor,
      climateRiskScore: 15 * factor,
    },
    "deforestation": {
      temperatureScore: -8 * factor,
      waterSecurityScore: -10 * factor,
      vegetationHealth: -35 * factor,
      airQuality: -20 * factor,
      climateRiskScore: 12 * factor,
    },
  };

  const impact = impacts[scenarioType] || {};
  const result: Record<string, number> = {};
  
  for (const [key, value] of Object.entries(currentScores)) {
    result[key] = Math.max(0, Math.min(100, Math.round(value + (impact[key] || 0))));
  }
  
  return result;
}

function calculateInterventionImpact(
  interventions: string[],
  currentScores: Record<string, number>
): Record<string, number> {
  const interventionEffects: Record<string, Record<string, number>> = {
    "plant_trees": {
      temperatureScore: 8,
      waterSecurityScore: 3,
      vegetationHealth: 15,
      airQuality: 12,
      climateRiskScore: -8,
    },
    "rainwater_harvesting": {
      temperatureScore: 2,
      waterSecurityScore: 15,
      vegetationHealth: 5,
      airQuality: 2,
      climateRiskScore: -5,
    },
    "green_infrastructure": {
      temperatureScore: 10,
      waterSecurityScore: 8,
      vegetationHealth: 10,
      airQuality: 10,
      climateRiskScore: -10,
    },
    "renewable_energy": {
      temperatureScore: 12,
      waterSecurityScore: 5,
      vegetationHealth: 8,
      airQuality: 18,
      climateRiskScore: -15,
    },
    "water_conservation": {
      temperatureScore: 3,
      waterSecurityScore: 18,
      vegetationHealth: 5,
      airQuality: 5,
      climateRiskScore: -8,
    },
  };

  const result = { ...currentScores };
  
  for (const intervention of interventions) {
    const effects = interventionEffects[intervention];
    if (effects) {
      for (const [key, delta] of Object.entries(effects)) {
        result[key] = Math.max(0, Math.min(100, (result[key] ?? 50) + delta));
      }
    }
  }
  
  for (const key of Object.keys(result)) {
    result[key] = Math.round(result[key]);
  }
  
  return result;
}

export const simulationRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        sessionId: z.number(),
        scenarioType: z.string(),
        intensity: z.number(),
        beforeScores: z.record(z.string(), z.number()),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const afterScores = calculateScenarioImpact(
        input.scenarioType,
        input.intensity,
        input.beforeScores
      );

      const beforeRisk = input.beforeScores["climateRiskScore"] ?? 50;
      const afterRisk = afterScores["climateRiskScore"] ?? 50;
      const riskChanged = afterRisk > beforeRisk;
      
      const impactSummary = `Scenario "${input.scenarioType}" at ${input.intensity}% intensity shows significant changes across all environmental indicators. ${
        riskChanged
          ? "Climate risk has increased, requiring immediate attention."
          : "Climate risk shows improvement."
      }`;

      await db.insert(simulations).values({
        sessionId: input.sessionId,
        scenarioType: input.scenarioType,
        intensity: input.intensity,
        beforeScores: input.beforeScores as unknown as Record<string, unknown>,
        afterScores: afterScores as unknown as Record<string, unknown>,
        impactSummary,
      });

      return {
        afterScores,
        impactSummary,
      };
    }),

  createIntervention: publicQuery
    .input(
      z.object({
        sessionId: z.number(),
        interventions: z.array(z.string()),
        currentScores: z.record(z.string(), z.number()),
      })
    )
    .mutation(async ({ input }) => {
      const afterScores = calculateInterventionImpact(
        input.interventions,
        input.currentScores
      );

      const beforeSustainability = input.currentScores["sustainabilityScore"] ?? 50;
      const afterSustainability = afterScores["sustainabilityScore"] ?? 50;
      const sustainabilityImproved = afterSustainability > beforeSustainability;
      
      const impactSummary = `Combined interventions (${input.interventions.join(", ")}) show ${
        sustainabilityImproved
          ? "positive"
          : "mixed"
      } results across environmental indicators.`;

      return {
        afterScores,
        impactSummary,
        interventions: input.interventions,
      };
    }),

  getBySession: publicQuery
    .input(z.object({ sessionId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(simulations)
        .where(eq(simulations.sessionId, input.sessionId));
    }),
});
