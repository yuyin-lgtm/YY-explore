import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        // Storybook is published under /YY-explore/. The test runner serves its
        // own origin, so the Vite base must stay at the root or the browser never connects.
        base: "/",
        plugins: [storybookTest({ configDir: path.join(dirname, ".storybook") })],
        test: {
          name: "storybook",
          fileParallelism: false,
          maxWorkers: 1,
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: "chromium" }],
            connectTimeout: 120_000,
          },
          testTimeout: 30_000,
        },
      },
    ],
  },
});
