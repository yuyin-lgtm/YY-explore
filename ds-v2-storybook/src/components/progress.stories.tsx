import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Progress } from "./progress";

const meta = {
  title: "Components/Progress bar",
  component: Progress,
  tags: ["autodocs"],
  args: { label: "Import", value: 42, showValue: true },
  decorators: [(Story) => <div className="w-[320px]"><Story /></div>],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Partial: Story = {};
export const Empty: Story = { args: { value: 0, label: "Upload" } };
export const Complete: Story = { args: { value: 100, label: "Sync" } };
export const HiddenValue: Story = { args: { showValue: false, label: "Processing" } };

export const Interaction: Story = {
  play: async ({ canvasElement }) => {
    const bar = within(canvasElement).getByRole("progressbar", { name: "Import" });
    await expect(bar).toHaveAttribute("aria-valuenow", "42");
    await expect(bar).toHaveAttribute("aria-valuemax", "100");
  },
};
