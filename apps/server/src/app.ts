import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { json } from "body-parser";
import { env } from "./config/env";
import authRouter from "./modules/auth/router";
import lobbyRouter from "./modules/lobby/router";
import worldsRouter from "./modules/worlds/router";
import chatRouter from "./modules/chat/router";
import moderationRouter from "./modules/moderation/router";

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(
    cors({
      origin: [/localhost:\d+$/],
      credentials: true
    })
  );
  app.use(json({ limit: "1mb" }));
  app.use(
    rateLimit({
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      max: env.RATE_LIMIT_MAX,
      standardHeaders: true,
      legacyHeaders: false
    })
  );

  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  app.use("/api/auth", authRouter);
  app.use("/api/rooms", lobbyRouter);
  app.use("/api/worlds", worldsRouter);
  app.use("/api/chat", chatRouter);
  app.use("/api/reports", moderationRouter);

  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  });

  return app;
}
