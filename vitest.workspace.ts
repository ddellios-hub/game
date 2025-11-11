import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  "packages/ui/vitest.config.ts",
  "packages/game-core/vitest.config.ts",
  "apps/server/vitest.config.ts"
]);
