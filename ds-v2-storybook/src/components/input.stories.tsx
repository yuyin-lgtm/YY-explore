import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { Input } from "./input";

const meta = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  args: { label: "Creator name", placeholder: "Maya Chen", hint: "Shown on the request." },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    return <Input {...args} value={value} onChange={(event) => setValue(event.target.value)} />;
  },
};
export const Small: Story = { args: { size: "sm", label: "SKU" } };
export const Error: Story = { args: { error: "Enter a creator name.", hint: undefined, defaultValue: "" } };
export const Disabled: Story = { args: { disabled: true, defaultValue: "Read only", hint: undefined } };
export const WithValue: Story = { args: { defaultValue: "Maya Chen" } };

export const Interaction: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <div className="w-[280px]">
        <Input {...args} hint={undefined} error={value.length > 0 && value.length < 2 ? "Too short" : undefined} value={value} onChange={(event) => setValue(event.target.value)} />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByLabelText("Creator name");
    await userEvent.click(field);
    await userEvent.type(field, "M");
    await expect(canvas.getByText("Too short")).toBeInTheDocument();
    await userEvent.type(field, "aya");
    await expect(canvas.queryByText("Too short")).not.toBeInTheDocument();
    await expect(field).toHaveValue("Maya");
  },
};
