import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Slider } from "./slider";

const meta = {
  title: "Components/Popover",
  component: PopoverContent,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof PopoverContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Filters</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p className="font-heading">Creator filters</p>
        <p className="mt-1 font-caption">GMV, shop, and category live here.</p>
      </PopoverContent>
    </Popover>
  ),
};

export const WithSlider: Story = {
  render: () => {
    const [value, setValue] = useState(25);
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary">Engagement · {value}%</Button>
        </PopoverTrigger>
        <PopoverContent>
          <Slider label="Minimum engagement" value={value} onValueChange={setValue} format={(next) => `${next}%`} />
        </PopoverContent>
      </Popover>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /Engagement/ }));
    const body = within(document.body);
    await expect(await body.findByText("Minimum engagement")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await expect(body.queryByText("Minimum engagement")).not.toBeInTheDocument();
  },
};
