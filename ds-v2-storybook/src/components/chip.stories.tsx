import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import { Chip, ChipGroup } from "./chip";

const meta = {
  title: "Components/Chip",
  component: Chip,
  tags: ["autodocs"],
  args: { label: "GMV", value: ">$10k", onRemove: fn() },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { selected: true } };
export const Hoverable: Story = { args: { onClick: fn(), onRemove: undefined, children: "Beauty" } };
export const Disabled: Story = { args: { disabled: true } };

export const Group: Story = {
  render: () => {
    const [chips, setChips] = useState([
      { id: "gmv", label: "GMV", value: ">$10k", selected: true },
      { id: "shop", label: "Shop", value: "US" },
      { id: "cat", label: "Category", value: "Beauty" },
    ]);
    return <ChipGroup chips={chips} onRemove={(id) => setChips((list) => list.filter((chip) => chip.id !== id))} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const remove = canvas.getByRole("button", { name: "Remove filter: GMV: >$10k" });
    remove.focus();
    await userEvent.keyboard("{Backspace}");
    await expect(canvas.queryByText(">$10k")).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Remove filter: Shop: US" }));
    await expect(canvas.queryByText("US")).not.toBeInTheDocument();
  },
};
