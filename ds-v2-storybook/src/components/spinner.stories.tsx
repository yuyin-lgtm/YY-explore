import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Spinner } from "./spinner";

const meta = {
  title: "Components/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  args: { size: 20, tone: "accent", label: "Loading…" },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Accent: Story = {};
export const OnAccent: Story = {
  args: { tone: "on-accent" },
  render: (args) => (
    <div className="rounded-pill bg-accent p-3">
      <Spinner {...args} />
    </div>
  ),
};
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner size={16} />
      <Spinner size={20} />
      <Spinner size={24} />
    </div>
  ),
};

export const Interaction: Story = {
  play: async ({ canvasElement }) => {
    const status = within(canvasElement).getByRole("status");
    await expect(status).toHaveTextContent("Loading…");
  },
};
