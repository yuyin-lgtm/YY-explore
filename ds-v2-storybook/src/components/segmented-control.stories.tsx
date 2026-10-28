import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import { SegmentedControl } from "./segmented-control";

const options = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "all", label: "All" },
];

const meta = {
  title: "Components/Segmented control",
  component: SegmentedControl,
  tags: ["autodocs"],
  args: { label: "Request status", options, value: "pending", onValueChange: fn() },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <SegmentedControl {...args} value={value} onValueChange={setValue} />;
  },
};
export const Small: Story = {
  args: { size: "sm", value: "approved" },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <SegmentedControl {...args} value={value} onValueChange={setValue} />;
  },
};
export const Disabled: Story = { args: { disabled: true } };

export const Interaction: Story = {
  render: (args) => {
    const [value, setValue] = useState("pending");
    return (
      <SegmentedControl
        {...args}
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
    const group = canvas.getByRole("radiogroup", { name: "Request status" });
    await userEvent.click(canvas.getByRole("radio", { name: "Approved" }));
    await expect(args.onValueChange).toHaveBeenCalledWith("approved");
    group.focus();
    canvas.getByRole("radio", { name: "Approved" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("radio", { name: "All" })).toBeChecked();
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("radio", { name: "Pending" })).toBeChecked();
  },
};
