import { addons } from "storybook/manager-api";
import { create } from "storybook/theming/create";

addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: "Reacher DS v2",
    brandUrl: "https://yuyin-lgtm.github.io/YY-explore/",
    colorPrimary: "#3559E9",
    colorSecondary: "#3559E9",
    appBg: "#F8F8F8",
    appContentBg: "#FFFFFF",
    appBorderColor: "#E9E9E9",
    appBorderRadius: 14,
    fontBase: "Inter, ui-sans-serif, system-ui, sans-serif",
    textColor: "#0B0B0B",
    barTextColor: "#585858",
    barSelectedColor: "#3559E9",
  }),
});
