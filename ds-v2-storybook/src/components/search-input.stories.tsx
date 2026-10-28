import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import { SearchInput } from "./search-input";

function Demo(props: { shape?: "default" | "pill"; disabled?: boolean; onClear?: () => void }) {
  const [value, setValue] = useState(props.disabled ? "glow" : "");
  return (
    <div className="w-[320px]">
      <SearchInput label="Search creators" placeholder="Search creators" value={value} onValueChange={setValue} shape={props.shape} disabled={props.disabled} onClear={props.onClear} />
    </div>
  );
}

const meta = {
  title: "Components/Search input",
  component: SearchInput,
  tags: ["autodocs"],
  args: { label: "Search creators", value: "", onValueChange: fn(), placeholder: "Search creators" },
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <Demo /> };
export const Pill: Story = { render: () => <Demo shape="pill" /> };
export const Disabled: Story = { render: () => <Demo disabled /> };
export const WithValue: Story = {
  args: { value: "maya", onValueChange: fn() },
  render: (args) => (
    <div className="w-[320px]">
      <SearchInput {...args} />
    </div>
  ),
};

export const Interaction: Story = {
  render: () => <Demo onClear={fn()} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("searchbox", { name: "Search creators" });
    await userEvent.type(field, "maya");
    await expect(field).toHaveValue("maya");
    await userEvent.click(canvas.getByRole("button", { name: "Clear search" }));
    await expect(field).toHaveValue("");
    await userEvent.type(field, "leo");
    await userEvent.keyboard("{Escape}");
    await expect(field).toHaveValue("");
  },
};
