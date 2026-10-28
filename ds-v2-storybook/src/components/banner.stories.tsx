import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Banner, type BannerActions, type BannerLayout, type BannerMedia, type BannerTone } from "./banner";

const tones: BannerTone[] = ["info", "success", "warning", "error", "neutral", "brand"];
const actions: BannerActions[] = ["none", "link", "primary", "both"];
const media: BannerMedia[] = ["icon", "avatar", "thumbnail", "illustration"];
const layouts: BannerLayout[] = ["inline", "page", "announcement"];

const meta = {
  title: "Components/Banner",
  component: Banner,
  tags: ["autodocs"],
  args: {
    tone: "info",
    layout: "inline",
    media: "icon",
    actions: "link",
    title: "2 requests expire tomorrow",
    description: "Review them before the offer window closes.",
    actionLabel: "Review",
    secondaryActionLabel: "Later",
    onAction: fn(),
    onSecondaryAction: fn(),
    onDismiss: fn(),
  },
  argTypes: {
    tone: { control: "select", options: tones },
    layout: { control: "inline-radio", options: layouts },
    media: { control: "select", options: media },
    actions: { control: "select", options: actions },
  },
  decorators: [(Story) => <div className="w-[640px] max-w-full"><Story /></div>],
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      {tones.map((tone) => (
        <Banner key={tone} {...args} tone={tone} title={`${tone[0].toUpperCase()}${tone.slice(1)} banner`} />
      ))}
    </div>
  ),
};

export const Actions: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      {actions.map((action) => (
        <Banner key={action} {...args} actions={action} title={`Action · ${action}`} />
      ))}
    </div>
  ),
};

export const Media: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      {media.map((kind) => (
        <Banner key={kind} {...args} media={kind} mediaContent={kind === "avatar" ? "MC" : undefined} title={`Media · ${kind}`} />
      ))}
    </div>
  ),
};

export const Layouts: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      {layouts.map((layout) => (
        <Banner key={layout} {...args} layout={layout} title={`Layout · ${layout}`} actions="both" />
      ))}
    </div>
  ),
};

export const Interaction: Story = {
  args: { title: "Sync finished", tone: "success", actions: "primary", layout: "page" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("status")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Review" }));
    await expect(args.onAction).toHaveBeenCalled();
    await userEvent.click(canvas.getByRole("button", { name: "Dismiss Sync finished" }));
    await expect(canvas.queryByRole("status")).not.toBeInTheDocument();
    await expect(args.onDismiss).toHaveBeenCalled();
  },
};
