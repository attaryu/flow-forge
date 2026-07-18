import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["app/**/*.spec.ts", "app/**/*.spec.tsx", "app/**/*.test.ts", "app/**/*.test.tsx"],
  },
});
