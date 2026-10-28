import type { Meta, StoryObj } from "@storybook/react-vite";
import { Copy, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import { Menu } from "./menu";

const meta = {
  title: "Components/Menu",
  component: Menu,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    label: "Actions",
    items: [
      { label: "Edit", icon: <Pencil />, onSelect: fn() },
      { label: "Duplicate", icon: <Copy />, onSelect: fn() },
      { label: "Archive", disabled: true },
      { label: "Delete", icon: <Trash2 />, destructive: true, separatorBefore: true, onSelect: fn() },
    ],
  },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {};
export const AlignEnd: Story = { args: { align: "end" } };

export const Interaction: Story = {
  render: (args) => {
    const [last, setLast] = useState("None");
    return (
      <div className="pb-40">
        <Menu
          {...args}
          items={args.items.map((item) => ({
            ...item,
            onSelect: () => {
              item.onSelect?.();
              setLast(item.label);
            },
          }))}
        />
        <p className="mt-3">Last action: {last}</p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Actions" }));
    const body = within(document.body);
    const edit = await body.findByRole("menuitem", { name: "Edit" });
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.click(edit);
    await expect(canvas.getByText("Last action: Edit")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Actions" }));
    await userEvent.click(await body.findByRole("menuitem", { name: "Delete" }));
    await expect(canvas.getByText("Last action: Delete")).toBeInTheDocument();
  },
};
