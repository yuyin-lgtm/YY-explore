import type { Meta, StoryObj } from "@storybook/react-vite";
import { UserRound } from "lucide-react";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import { ExpandingSearch, type ExpandingSearchItem } from "./expanding-search";

const items: ExpandingSearchItem[] = [
  { id: "maya", title: "Maya Chen", meta: "@glowwithmaya", group: "Creators", icon: <UserRound />, keywords: ["beauty"] },
  { id: "leo", title: "Leo Park", meta: "@leoeats", group: "Creators", icon: <UserRound />, keywords: ["food"] },
  { id: "nina", title: "Nina Alvarez", meta: "@ninacooks", group: "Creators", icon: <UserRound /> },
];

const suggestions = items.slice(0, 2);

const meta = {
  title: "Components/Expanding search",
  component: ExpandingSearch,
  tags: ["autodocs"],
  args: { label: "Search creators", items, suggestions, onSelect: fn() },
  parameters: { layout: "padded" },
} satisfies Meta<typeof ExpandingSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Collapsed: Story = { args: { onSelect: fn() } };
export const AnchorStart: Story = { args: { anchor: "start" } };

export const Interaction: Story = {
  render: (args) => {
    const [picked, setPicked] = useState("None");
    return (
      <div className="flex w-[420px] flex-col items-end gap-3">
        <ExpandingSearch
          {...args}
          onSelect={(item) => {
            args.onSelect?.(item);
            setPicked(item.title);
          }}
        />
        <p>Selected: {picked}</p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Search creators" }));
    const field = await canvas.findByRole("combobox", { name: "Search creators" });
    await expect(canvas.getByRole("option", { name: /Maya Chen/ })).toBeInTheDocument();
    await userEvent.type(field, "zzz");
    await expect(canvas.getAllByText("No results").length).toBeGreaterThan(0);
    await userEvent.clear(field);
    await userEvent.type(field, "maya");
    await expect(canvas.getByRole("option", { name: /Maya Chen/ })).toBeInTheDocument();
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByText("Selected: Maya Chen")).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Search creators" })).toBeInTheDocument();
  },
};
