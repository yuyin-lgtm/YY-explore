import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Skeleton } from "./skeleton";

const meta = {
  title: "Components/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  args: { preset: "card", label: "Loading content" },
  decorators: [(Story) => <div className="w-[360px]"><Story /></div>],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Card: Story = { args: { preset: "card" } };
export const List: Story = { args: { preset: "list" } };
export const Table: Story = { args: { preset: "table" } };
export const Form: Story = { args: { preset: "form" } };
export const Loaded: Story = {
  args: { loading: false },
  render: (args) => (
    <Skeleton {...args}>
      <p className="font-body">Content is ready.</p>
    </Skeleton>
  ),
};

export const Interaction: Story = {
  play: async ({ canvasElement }) => {
    const status = within(canvasElement).getByRole("status");
    await expect(status).toHaveAttribute("aria-busy", "true");
    await expect(status).toHaveTextContent("Loading content");
  },
};
