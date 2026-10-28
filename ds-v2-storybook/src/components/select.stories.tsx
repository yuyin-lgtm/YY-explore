import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import { Select, TIMEFRAME_PRESETS } from "./select";

const options = [
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "archived", label: "Archived", disabled: true },
];

const meta = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
  args: { label: "Status", options, onValueChange: fn(), placeholder: "Choose a status" },
  decorators: [(Story) => <div className="w-[280px] pb-40"><Story /></div>],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {};
export const Small: Story = { args: { size: "sm", defaultValue: "pending" } };
export const Error: Story = { args: { error: "Pick a status." } };
export const Disabled: Story = { args: { disabled: true, defaultValue: "approved" } };

export const Timeframe: Story = {
  args: { label: "Timeframe", options: TIMEFRAME_PRESETS, defaultValue: "30d" },
};

export const Interaction: Story = {
  render: (args) => {
    const [value, setValue] = useState("30d");
    return (
      <Select
        {...args}
        label="Timeframe"
        options={TIMEFRAME_PRESETS}
        value={value}
        onValueChange={(next) => {
          args.onValueChange?.(next);
          setValue(next);
        }}
      />
    );
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("combobox", { name: "Timeframe" }));
    await userEvent.click(await canvas.findByRole("option", { name: "Last 7 days" }));
    await expect(args.onValueChange).toHaveBeenCalledWith("7d");
    await expect(canvas.getByRole("combobox", { name: "Timeframe" })).toHaveTextContent("Last 7 days");
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByRole("combobox")).toHaveTextContent("Last 90 days");
  },
};
