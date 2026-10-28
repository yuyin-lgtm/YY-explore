import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-a11y", "@storybook/addon-docs", "@storybook/addon-vitest"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {},
  viteFinal: async (config) =>
    mergeConfig(config, {
      // Vitest serves the browser runner at the site root. Pages uses the repo subpath.
      base: process.env.VITEST ? "/" : "/YY-explore/",
      plugins: [tailwindcss()],
    }),
};

export default config;
