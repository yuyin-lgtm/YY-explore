import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus, Trash2 } from "lucide-react";
import { expect, fn, userEvent, within } from "storybook/test";
import { Button } from "./button";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Save",
    variant: "primary",
    size: "default",
    disabled: false,
    loading: false,
    iconOnly: false,
    onClick: fn(),
  },
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "outline", "brand-outline", "ghost", "destructive"] },
    size: { control: "inline-radio", options: ["default", "sm"] },
    leadingIcon: { control: false },
    trailingIcon: { control: false },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: "secondary", children: "Cancel" } };
export const Outline: Story = { args: { variant: "outline", children: "Filter" } };
export const BrandOutline: Story = { args: { variant: "brand-outline", children: "Share" } };
export const Ghost: Story = { args: { variant: "ghost", children: "Learn more" } };
export const Destructive: Story = { args: { variant: "destructive", children: "Delete", leadingIcon: <Trash2 /> } };
export const Small: Story = { args: { size: "sm", children: "Edit" } };
export const WithIcon: Story = { args: { leadingIcon: <Plus />, children: "New request" } };
export const IconOnly: Story = { args: { iconOnly: true, "aria-label": "Add", children: "Add", leadingIcon: <Plus /> } };
export const Loading: Story = { args: { loading: true, children: "Saving" } };
export const Disabled: Story = { args: { disabled: true, children: "Unavailable" } };

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {(["primary", "secondary", "outline", "brand-outline", "ghost", "destructive"] as const).map((variant) => (
        <div key={variant} className="flex flex-col items-start gap-2">
          <Button {...args} variant={variant} onClick={args.onClick}>
            {variant}
          </Button>
          <Button {...args} variant={variant} size="sm" onClick={args.onClick}>
            {variant}
          </Button>
        </div>
      ))}
    </div>
  ),
};

export const Interaction: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args}>Save</Button>
      <Button variant="outline" disabled onClick={args.onClick}>
        Disabled
      </Button>
      <Button variant="secondary" loading>
        Saving
      </Button>
      <Button iconOnly aria-label="Add" leadingIcon={<Plus />} onClick={args.onClick} />
    </div>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const save = canvas.getByRole("button", { name: "Save" });
    await userEvent.tab();
    await expect(save).toHaveFocus();
    await expect(getComputedStyle(save).outlineStyle).toBe("none");
    await userEvent.keyboard("{Enter}");
    await expect(args.onClick).toHaveBeenCalled();
    await userEvent.click(canvas.getByRole("button", { name: "Disabled" }));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    const saving = canvas.getByRole("button", { name: "Saving" });
    await expect(saving).toHaveAttribute("aria-busy", "true");
    await userEvent.click(saving);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    await userEvent.click(canvas.getByRole("button", { name: "Add" }));
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};
