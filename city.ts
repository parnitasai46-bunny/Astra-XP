import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { cities } from "@db/schema";
import { eq, like, or } from "drizzle-orm";

// Seed cities data
const seedCities = [
  { name: "New York", country: "United States", lat: 40.7128, lng: -74.006, population: 8336817, region: "North America", climateZone: "Humid subtropical" },
  { name: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278, population: 8982000, region: "Europe", climateZone: "Temperate oceanic" },
  { name: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503, population: 13960000, region: "Asia", climateZone: "Humid subtropical" },
  { name: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198, population: 5685807, region: "Asia", climateZone: "Tropical rainforest" },
  { name: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093, population: 5312163, region: "Oceania", climateZone: "Humid subtropical" },
  { name: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708, population: 3331420, region: "Middle East", climateZone: "Hot desert" },
  { name: "São Paulo", country: "Brazil", lat: -23.5505, lng: -46.6333, population: 12325232, region: "South America", climateZone: "Humid subtropical" },
  { name: "Cairo", country: "Egypt", lat: 30.0444, lng: 31.2357, population: 9842355, region: "Africa", climateZone: "Hot desert" },
  { name: "Mumbai", country: "India", lat: 19.076, lng: 72.8777, population: 20411274, region: "Asia", climateZone: "Tropical wet and dry" },
  { name: "Lagos", country: "Nigeria", lat: 6.5244, lng: 3.3792, population: 14862000, region: "Africa", climateZone: "Tropical savanna" },
  { name: "Paris", country: "France", lat: 48.8566, lng: 2.3522, population: 2161000, region: "Europe", climateZone: "Temperate oceanic" },
  { name: "Berlin", country: "Germany", lat: 52.52, lng: 13.405, population: 3644826, region: "Europe", climateZone: "Temperate oceanic" },
  { name: "Toronto", country: "Canada", lat: 43.6532, lng: -79.3832, population: 2731571, region: "North America", climateZone: "Humid continental" },
  { name: "Mexico City", country: "Mexico", lat: 19.4326, lng: -99.1332, population: 9209944, region: "North America", climateZone: "Subtropical highland" },
  { name: "Shanghai", country: "China", lat: 31.2304, lng: 121.4737, population: 26317104, region: "Asia", climateZone: "Humid subtropical" },
  { name: "Moscow", country: "Russia", lat: 55.7558, lng: 37.6173, population: 12537954, region: "Europe", climateZone: "Humid continental" },
  { name: "Buenos Aires", country: "Argentina", lat: -34.6037, lng: -58.3816, population: 3075646, region: "South America", climateZone: "Humid subtropical" },
  { name: "Jakarta", country: "Indonesia", lat: -6.2088, lng: 106.8456, population: 10562088, region: "Asia", climateZone: "Tropical rainforest" },
  { name: "Nairobi", country: "Kenya", lat: -1.2921, lng: 36.8219, population: 4397073, region: "Africa", climateZone: "Subtropical highland" },
  { name: "Cape Town", country: "South Africa", lat: -33.9249, lng: 18.4241, population: 4618000, region: "Africa", climateZone: "Mediterranean" },
];

export const cityRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    const existing = await db.select().from(cities);
    if (existing.length === 0) {
      await db.insert(cities).values(seedCities);
      return db.select().from(cities);
    }
    return existing;
  }),

  search: publicQuery
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(cities)
        .where(
          or(
            like(cities.name, `%${input.query}%`),
            like(cities.country, `%${input.query}%`)
          )
        );
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(cities)
        .where(eq(cities.id, input.id));
      return result[0] || null;
    }),

  popular: publicQuery.query(async () => {
    const db = getDb();
    const all = await db.select().from(cities);
    return all.slice(0, 8);
  }),
});
