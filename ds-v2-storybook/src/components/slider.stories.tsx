import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Slider, type SliderProps } from "./slider";

const meta = {
  title: "Components/Slider",
  component: Slider,
  tags: ["autodocs"],
  args: {
    label: "Followers",
    defaultValue: 40,
    min: 0,
    max: 100,
    showValue: true,
    onValueChange: fn(),
  },
  decorators: [(Story) => <div className="w-[320px]"><Story /></div>],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {};

export const Range: Story = {
  args: { label: "GMV range", defaultValue: [20, 80], format: (value) => `$${value}k` },
};

export const StepMarks: Story = {
  args: {
    label: "Sample cap",
    min: 0,
    max: 100,
    step: 10,
    defaultValue: 40,
    marks: [
      { value: 0, label: "0" },
      { value: 25, label: "25" },
      { value: 50, label: "50" },
      { value: 75, label: "75" },
      { value: 100, label: "100" },
    ],
  },
};

export const LabelAndValue: Story = {
  args: {
    label: "Followers",
    min: 0,
    max: 50000,
    step: 100,
    defaultValue: 12840,
    format: (value) => new Intl.NumberFormat("en-US").format(Math.round(value)),
    showValue: true,
  },
};

export const MinMax: Story = {
  args: {
    label: "Engagement",
    defaultValue: 35,
    showMinMax: true,
    format: (value) => `${value}%`,
  },
};

function Paired(props: SliderProps<number>) {
  const [value, setValue] = useState(props.defaultValue ?? 40);
  return (
    <Slider
      {...props}
      value={value}
      pairedInput
      showValue={false}
      onValueChange={(next) => {
        props.onValueChange?.(next);
        setValue(next);
      }}
    />
  );
}

export const PairedInput: Story = {
  args: { label: "Budget", defaultValue: 40, format: (value) => String(value), min: 0, max: 100 },
  render: (args) => (
    <Paired
      label={args.label}
      min={args.min}
      max={args.max}
      step={args.step}
      format={args.format}
      defaultValue={40}
      onValueChange={(next) => args.onValueChange?.(next)}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("spinbutton", { name: "Budget value" });
    await userEvent.clear(field);
    await userEvent.type(field, "55");
    await expect(canvas.getByRole("slider")).toHaveAttribute("aria-valuenow", "55");
    const row = canvas.getByTestId("slider-control");
    await expect(row.clientHeight).toBeLessThanOrEqual(32);
    await expect(canvas.getByTestId("slider-label-row").clientHeight).toBeLessThanOrEqual(32);
  },
};

export const Small: Story = {
  args: { size: "sm", label: "Radius", defaultValue: 14, min: 0, max: 34 },
  play: async ({ canvasElement }) => {
    const row = within(canvasElement).getByTestId("slider-control");
    await expect(row.clientHeight).toBeLessThanOrEqual(28);
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 30 },
  play: async ({ canvasElement }) => {
    const slider = within(canvasElement).getByRole("slider");
    await expect(slider).toHaveAttribute("aria-disabled", "true");
  },
};

export const InPopover: Story = {
  render: () => {
    const [value, setValue] = useState(40);
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Followers · {value}k+</Button>
        </PopoverTrigger>
        <PopoverContent>
          <Slider label="Minimum followers" value={value} onValueChange={setValue} format={(next) => `${next}k`} showMinMax />
        </PopoverContent>
      </Popover>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /Followers/ }));
    const slider = await within(document.body).findByRole("slider", { name: "Minimum followers" });
    await userEvent.tab();
    await expect(slider).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(slider).toHaveAttribute("aria-valuenow", "41");
    await expect(getComputedStyle(slider).outlineStyle).toBe("none");
    await expect(getComputedStyle(slider).boxShadow).toMatch(/53,\s*89,\s*233|53 89 233/);
  },
};

export const Interaction: Story = {
  render: (args) => {
    const [value, setValue] = useState(40);
    return (
      <Slider
        {...args}
        value={value}
        onValueChange={(next) => {
          if (typeof next !== "number") return;
          args.onValueChange?.(next);
          setValue(next);
        }}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const slider = canvas.getByRole("slider", { name: "Followers" });
    await expect(canvas.getByTestId("slider-control").clientHeight).toBeLessThanOrEqual(32);
    await userEvent.tab();
    await expect(slider).toHaveFocus();
    await expect(getComputedStyle(slider).outlineStyle).toBe("none");
    await expect(getComputedStyle(slider).boxShadow).toMatch(/53,\s*89,\s*233|53 89 233/);
    await userEvent.keyboard("{ArrowRight}");
    await expect(slider).toHaveAttribute("aria-valuenow", "41");
    await userEvent.keyboard("{Home}");
    await expect(slider).toHaveAttribute("aria-valuenow", "0");
    await userEvent.keyboard("{End}");
    await expect(slider).toHaveAttribute("aria-valuenow", "100");
    await userEvent.pointer([{ keys: "[MouseLeft>]", target: slider }]);
    await expect(canvas.getByRole("tooltip")).toHaveTextContent("100");
    await userEvent.pointer([{ keys: "[/MouseLeft]" }]);
  },
};
