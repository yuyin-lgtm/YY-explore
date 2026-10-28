import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import { Button } from "./button";
import { MetricCard } from "./card";
import { Paywall } from "./paywall";

const features = ["Creator emails", "CSV export", "Shared team seats"];

const meta = {
  title: "Components/Paywall",
  component: Paywall,
  tags: ["autodocs"],
  args: {
    title: "Upgrade to see creator emails",
    description: "Emails, exports, and shared seats are on the paid plan.",
    features,
    onUpgrade: fn(),
    onDismiss: fn(),
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof Paywall>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overlay: Story = {
  render: (args) => (
    <div className="relative h-[460px] w-[720px] max-w-full overflow-hidden rounded-panel border border-border">
      <div className="grid grid-cols-2 gap-3 p-4">
        <MetricCard label="GMV" value={128406} format={(value) => `$${Math.round(value).toLocaleString("en-US")}`} />
        <MetricCard label="Creators" value={86} />
      </div>
      <Paywall {...args} />
    </div>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const dialog = canvas.getByRole("dialog", { name: "Upgrade to see creator emails" });
    await expect(within(dialog).getByRole("button", { name: "Not now" })).toHaveFocus();
    await userEvent.click(within(dialog).getByRole("button", { name: "Upgrade" }));
    await expect(args.onUpgrade).toHaveBeenCalled();
    await userEvent.keyboard("{Escape}");
    await expect(args.onDismiss).toHaveBeenCalled();
  },
};

export const RegionLock: Story = {
  render: (args) => {
    const [open, setOpen] = useState(true);
    return (
      <div className="relative h-[420px] w-[480px] max-w-full overflow-hidden rounded-panel border border-border bg-muted-surface">
        <div className="p-4 font-body text-secondary">Creator contact details</div>
        <Paywall
          {...args}
          open={open}
          onDismiss={() => {
            args.onDismiss?.();
            setOpen(false);
          }}
        />
      </div>
    );
  },
};

export const ToolbarGuard: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div className="relative h-[420px] w-[520px] max-w-full">
        <Button variant="outline" onClick={() => setOpen(true)}>
          Export emails
        </Button>
        {open ? (
          <Paywall
            {...args}
            onUpgrade={() => {
              args.onUpgrade?.();
              setOpen(false);
            }}
            onDismiss={() => setOpen(false)}
          />
        ) : null}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Export emails" }));
    const dialog = await canvas.findByRole("dialog");
    await userEvent.click(within(dialog).getByRole("button", { name: "Not now" }));
    await expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
  },
};
