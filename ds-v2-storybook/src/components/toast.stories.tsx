import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { Button } from "./button";
import { Toast, ToastProvider, useToast, type ToastTone } from "./toast";

const meta = {
  title: "Components/Toast",
  component: Toast,
  tags: ["autodocs"],
  args: { title: "Request approved", description: "Maya Chen will get a message.", tone: "success" },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = { args: { tone: "neutral", title: "Draft saved", description: "Just now" } };
export const Success: Story = {};
export const Warning: Story = { args: { tone: "warning", title: "Offer expires tomorrow", description: "2 requests still need a review." } };
export const Error: Story = { args: { tone: "error", title: "Could not send", description: "Check the connection and try again." } };
export const WithProgress: Story = { args: { tone: "brand", title: "Importing creators", description: "120 of 300 rows", progress: 40 } };

function StackDemo() {
  const { push } = useToast();
  return (
    <Button
      variant="outline"
      onClick={() => {
        const tones: ToastTone[] = ["success", "info"];
        push({ title: "Request approved", description: "Maya Chen will get a message.", tone: tones[0], duration: 0 });
      }}
    >
      Show toast
    </Button>
  );
}

export const Interaction: Story = {
  render: () => (
    <ToastProvider>
      <StackDemo />
    </ToastProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Show toast" }));
    const body = within(document.body);
    await expect(await body.findByText("Request approved")).toBeInTheDocument();
    await userEvent.click(body.getByRole("button", { name: "Dismiss Request approved" }));
    await expect(body.queryByText("Request approved")).not.toBeInTheDocument();
  },
};

export const ProgressUpdates: Story = {
  render: () => {
    const [progress, setProgress] = useState(15);
    useEffect(() => {
      const id = window.setInterval(() => setProgress((value) => (value >= 100 ? 15 : value + 15)), 900);
      return () => window.clearInterval(id);
    }, []);
    return <Toast tone="brand" title="Importing creators" description="Keeping the row in place" progress={progress} />;
  },
};
