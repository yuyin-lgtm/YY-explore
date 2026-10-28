import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, type ReactNode } from "react";
import { expect, userEvent, within } from "storybook/test";
import { SampleRequests } from "./sample-requests";

function Frame({ mode, children }: { mode: "desktop" | "phone"; children: ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.dataset.viewport;
    root.dataset.viewport = mode;
    return () => {
      if (previous) root.dataset.viewport = previous;
      else delete root.dataset.viewport;
    };
  }, [mode]);
  return <>{children}</>;
}

const meta = {
  title: "Examples/Sample requests",
  component: SampleRequests,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SampleRequests>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  args: { frame: "desktop" },
  globals: { viewport: { value: "desktop", isRotated: false } },
  render: (args) => (
    <Frame mode="desktop">
      <SampleRequests {...args} />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("searchbox", { name: "Search creators" }), "Maya");
    await expect(canvas.getByRole("row", { name: /Maya Chen/ })).toBeInTheDocument();
    await expect(canvas.queryByRole("row", { name: /Leo Park/ })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Review" }));
    const dialog = await within(document.body).findByRole("dialog", { name: /Review Maya Chen/ });
    await userEvent.keyboard("{Escape}");
    await expect(dialog).not.toBeInTheDocument();
  },
};

export const Mobile: Story = {
  args: { frame: "phone" },
  globals: { viewport: { value: "phone", isRotated: false } },
  render: (args) => (
    <Frame mode="phone">
      <div className="mx-auto max-w-[390px] border-x border-border">
        <SampleRequests {...args} />
      </div>
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Sample requests" })).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Dismiss 2 requests expire tomorrow" })).toBeInTheDocument();
    await userEvent.click(canvas.getAllByRole("button", { name: "Review" })[0]);
    await expect(await within(document.body).findByRole("dialog")).toBeInTheDocument();
    await userEvent.click(within(document.body).getByRole("button", { name: "Close" }));
  },
};
