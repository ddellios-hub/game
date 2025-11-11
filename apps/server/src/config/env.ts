import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  BACKEND_URL: z.string().url().default("http://localhost:4000"),
  SOCKET_URL: z.string().url().default("http://localhost:4000"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().positive().default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().positive().default(60),
  ADMIN_DEFAULT_EMAIL: z.string().email().default("admin@example.com"),
  ADMIN_DEFAULT_PASSWORD: z.string().min(8).default("admin1234"),
  PORT: z.coerce.number().int().min(1024).max(65_535).default(4000)
});

export const env = envSchema.parse(process.env);
