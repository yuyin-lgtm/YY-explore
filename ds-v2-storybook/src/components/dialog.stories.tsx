import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { Button } from "./button";
import { Dialog } from "./dialog";
import { Input } from "./input";

const meta = {
  title: "Components/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    title: "Review request",
    description: "Maya Chen asked for a sample of the serum.",
    size: "default",
    destructive: false,
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Confirm: Story = {
  args: {
    size: "sm",
    title: "Discard unsaved changes?",
    description: "The note you started will be lost.",
    secondaryAction: { label: "Keep editing" },
    primaryAction: { label: "Discard" },
    trigger: <Button variant="outline">Discard draft</Button>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Discard draft" }));
    const dialog = await within(document.body).findByRole("dialog", { name: "Discard unsaved changes?" });
    const keep = within(dialog).getByRole("button", { name: "Keep editing" });
    await expect(keep).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await expect(within(document.body).queryByRole("dialog")).not.toBeInTheDocument();
  },
};

export const Form: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("Maya Chen");
    const [saved, setSaved] = useState("");
    return (
      <div>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Edit creator
        </Button>
        <Dialog
          {...args}
          open={open}
          onOpenChange={setOpen}
          title="Edit creator"
          description="Update the name shown on the request."
          secondaryAction={{ label: "Cancel", onClick: () => setOpen(false) }}
          primaryAction={{
            label: "Save",
            onClick: () => {
              setSaved(name);
              setOpen(false);
            },
          }}
        >
          <Input label="Name" value={name} onChange={(event) => setName(event.target.value)} />
        </Dialog>
        {saved ? <p className="mt-3">Saved: {saved}</p> : null}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Edit creator" }));
    const dialog = await within(document.body).findByRole("dialog", { name: "Edit creator" });
    const name = within(dialog).getByLabelText("Name");
    await userEvent.clear(name);
    await userEvent.type(name, "Maya C.");
    await userEvent.click(within(dialog).getByRole("button", { name: "Save" }));
    await expect(canvas.getByText("Saved: Maya C.")).toBeInTheDocument();
  },
};

export const Destructive: Story = {
  args: {
    size: "sm",
    destructive: true,
    title: "Delete this creator?",
    description: "Their sample requests will be removed. This cannot be undone.",
    secondaryAction: { label: "Cancel" },
    primaryAction: { label: "Delete" },
    trigger: <Button variant="destructive">Delete creator</Button>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Delete creator" }));
    const dialog = await within(document.body).findByRole("dialog", { name: "Delete this creator?" });
    const remove = within(dialog).getByRole("button", { name: "Delete" });
    await expect(remove.className).toContain("bg-danger");
    await userEvent.click(within(dialog).getByRole("button", { name: "Close" }));
    await expect(within(document.body).queryByRole("dialog")).not.toBeInTheDocument();
  },
};

export const States: Story = {
  args: {
    size: "default",
    destructive: false,
    title: "Share report",
    description: "Anyone with the link can view it.",
    secondaryAction: { label: "Cancel" },
    primaryAction: { label: "Copy link" },
    trigger: <Button variant="secondary">Open dialog</Button>,
  },
};
