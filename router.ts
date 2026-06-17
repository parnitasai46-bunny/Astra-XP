import { createRouter, publicQuery } from "./middleware";
import { cityRouter } from "./routers/city";
import { sessionRouter } from "./routers/session";
import { simulationRouter } from "./routers/simulation";
import { aiRouter } from "./routers/ai";
import { reportRouter } from "./routers/report";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  city: cityRouter,
  session: sessionRouter,
  simulation: simulationRouter,
  ai: aiRouter,
  report: reportRouter,
});

export type AppRouter = typeof appRouter;
