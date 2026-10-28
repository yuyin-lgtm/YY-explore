import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarChart3, Megaphone, Users } from "lucide-react";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { Card, ClickableCard, MetricCard } from "./card";

const meta = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  args: {
    title: "Top creators this week",
    description: "Creators who drove the most GMV from sample requests.",
    variant: "default",
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Muted: Story = { args: { variant: "muted", title: "Notes", description: "Internal context for this campaign." } };
export const Outlined: Story = { args: { variant: "outlined" } };

export const Metric: Story = {
  render: () => (
    <div className="grid w-[720px] grid-cols-3 gap-4">
      <MetricCard label="GMV" value={128406} format={(value) => `$${Math.round(value).toLocaleString("en-US")}`} delta="+12.4%" caption="vs last week" tone="brand" />
      <MetricCard label="Approved" value={42} delta="+6" caption="vs last week" tone="success" />
      <MetricCard label="Reply rate" value={64} format={(value) => `${Math.round(value)}%`} delta="-2.1%" caption="vs last week" />
    </div>
  ),
};

export const MetricSelected: Story = {
  render: () => <MetricCard label="Pending" value={18} caption="waiting on you" selected interactive />,
};

export const Clickable: Story = {
  render: () => {
    const [selected, setSelected] = useState("creators");
    return (
      <div className="flex w-[360px] flex-col gap-2">
        <ClickableCard title="Creators" description="12 new this week" icon={<Users />} selected={selected === "creators"} onClick={() => setSelected("creators")} />
        <ClickableCard title="Campaigns" description="3 need a review" icon={<Megaphone />} selected={selected === "campaigns"} onClick={() => setSelected("campaigns")} />
        <ClickableCard title="Analytics" description="Updated 5 min ago" icon={<BarChart3 />} disabled />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campaigns = canvas.getByRole("button", { name: /Campaigns/ });
    await userEvent.click(campaigns);
    await expect(campaigns).toHaveAttribute("aria-pressed", "true");
    await expect(canvas.getByRole("button", { name: /Creators/ })).toHaveAttribute("aria-pressed", "false");
    await expect(canvas.getByRole("button", { name: /Analytics/ })).toBeDisabled();
    campaigns.focus();
    await userEvent.keyboard("{Enter}");
  },
};

export const ClickableLink: Story = {
  args: { title: "Open report" },
  render: () => <ClickableCard title="Weekly report" description="Opens in this tab" icon={<BarChart3 />} href="#report" />,
};
