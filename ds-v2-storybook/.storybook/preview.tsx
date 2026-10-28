import type { Preview } from "@storybook/react-vite";
import "../src/styles/globals.css";

if (typeof document !== "undefined") {
  document.documentElement.dataset.accent = "reacher";
  document.documentElement.lang = "en";
}

const preview: Preview = {
  parameters: {
    layout: "centered",
    options: {
      storySort: {
        order: ["Foundations", "Components", "Examples"],
      },
    },
    viewport: {
      options: {
        phone: { name: "Phone", styles: { width: "390px", height: "844px" }, type: "mobile" },
        tablet: { name: "Tablet", styles: { width: "834px", height: "1112px" }, type: "tablet" },
        desktop: { name: "Desktop", styles: { width: "1280px", height: "900px" }, type: "desktop" },
      },
    },
    a11y: {
      test: "error",
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
