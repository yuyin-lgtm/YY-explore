import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import { Combobox, type ComboboxItem } from "./combobox";

const items: ComboboxItem[] = [
  { value: "maya", label: "Maya Chen", meta: "@glowwithmaya · Beauty" },
  { value: "leo", label: "Leo Park", meta: "@leoeats · Food" },
  { value: "nina", label: "Nina Alvarez", meta: "@ninacooks · Food", keywords: ["kitchen"] },
  { value: "omar", label: "Omar Haddad", meta: "@omartests · Tech", disabled: true },
];

const meta = {
  title: "Components/Combobox",
  component: Combobox,
  tags: ["autodocs"],
  args: { label: "Creator", items, onValueChange: fn(), onSearch: fn(), placeholder: "Search creators" },
  decorators: [(Story) => <div className="w-[320px] pb-56"><Story /></div>],
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {};
export const Selected: Story = { args: { defaultValue: "maya" } };
export const Disabled: Story = { args: { disabled: true, defaultValue: "leo" } };

export const Interaction: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <Combobox
        {...args}
        value={value}
        onValueChange={(next) => {
          args.onValueChange?.(next);
          setValue(next);
        }}
        onSearch={args.onSearch}
      />
    );
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("combobox", { name: "Creator" }));
    const field = canvas.getByRole("combobox", { name: "Creator" });
    await userEvent.type(field, "nina");
    await expect(args.onSearch).toHaveBeenCalled();
    await userEvent.keyboard("{Enter}");
    await expect(args.onValueChange).toHaveBeenCalledWith("nina");
    await expect(canvas.getByRole("combobox", { name: "Creator" })).toHaveTextContent("Nina Alvarez");
    await userEvent.click(canvas.getByRole("combobox", { name: "Creator" }));
    await userEvent.type(canvas.getByRole("combobox"), "zzzz");
    await expect(canvas.getByText("No matches")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
  },
};
