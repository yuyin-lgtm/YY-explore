import { CircleCheck, CircleX, Info, Megaphone, TriangleAlert, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { Button } from "./button";

export type BannerTone = "info" | "success" | "warning" | "error" | "neutral" | "brand";
export type BannerActions = "none" | "link" | "primary" | "both";
export type BannerMedia = "icon" | "avatar" | "thumbnail" | "illustration";
export type BannerLayout = "inline" | "page" | "announcement";

export type BannerProps = {
  tone?: BannerTone;
  layout?: BannerLayout;
  media?: BannerMedia;
  actions?: BannerActions;
  title: string;
  description?: string;
  actionLabel?: string;
  secondaryActionLabel?: string;
  onAction?: () => void;
  onSecondaryAction?: () => void;
  onDismiss?: () => void;
  /** Avatar or thumbnail content. Icons and the illustration are drawn by the banner. */
  mediaContent?: ReactNode;
  className?: string;
};

const toneChip: Record<BannerTone, string> = {
  info: "bg-info-subtle text-info",
  success: "bg-success-subtle text-success",
  warning: "bg-warning-subtle text-warning",
  error: "bg-error-subtle text-error",
  neutral: "bg-muted-surface text-secondary",
  brand: "bg-accent-subtle text-accent-text",
};

const toneBorder: Record<BannerTone, string> = {
  info: "border-info-border",
  success: "border-success-border",
  warning: "border-warning-border",
  error: "border-error-border",
  neutral: "border-border",
  brand: "border-accent-border",
};

const toneIcon = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  error: CircleX,
  neutral: Megaphone,
  brand: Megaphone,
};

/**
 * Quiet banner: white surface, hairline border, tinted icon chip.
 * Every banner has a close button. No saturated fill and no thick stripe.
 */
export function Banner({
  tone = "info",
  layout = "inline",
  media = "icon",
  actions = "none",
  title,
  description,
  actionLabel = "View",
  secondaryActionLabel = "Dismiss",
  onAction,
  onSecondaryAction,
  onDismiss,
  mediaContent,
  className,
}: BannerProps) {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;
  const Icon = toneIcon[tone];
  const dismiss = () => {
    setHidden(true);
    onDismiss?.();
  };
  const role = tone === "warning" || tone === "error" ? "alert" : "status";

  const mediaNode =
    media === "avatar" ? (
      <span className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-pill bg-accent-subtle font-caption-strong text-accent-text">
        {mediaContent ?? "A"}
      </span>
    ) : media === "thumbnail" ? (
      <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-item bg-muted-surface text-secondary">{mediaContent ?? <Icon size={16} strokeWidth={1.5} aria-hidden />}</span>
    ) : media === "illustration" ? (
      <span className={cn("grid size-14 shrink-0 place-items-center rounded-panel", toneChip[tone])} aria-hidden>
        {mediaContent ?? <Icon size={22} strokeWidth={1.5} />}
      </span>
    ) : (
      <span className={cn("grid size-7 shrink-0 place-items-center rounded-item", toneChip[tone])} aria-hidden>
        <Icon size={16} strokeWidth={1.5} />
      </span>
    );

  const actionRow = actions === "none" ? null : (
    <div className={cn("flex shrink-0 items-center gap-2", layout === "inline" && "mt-2")}>
      {actions === "link" ? (
        <button type="button" onClick={onAction} className="font-body-strong text-accent-text underline-offset-2 hover:underline">
          {actionLabel}
        </button>
      ) : null}
      {actions === "both" ? (
        <Button size="sm" variant="outline" onClick={onSecondaryAction}>
          {secondaryActionLabel}
        </Button>
      ) : null}
      {actions === "primary" || actions === "both" ? (
        <Button size="sm" variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );

  return (
    <div
      role={role}
      className={cn(
        "border bg-raised shadow-resting",
        toneBorder[tone],
        layout === "announcement" ? "flex items-center gap-3 rounded-panel px-4 py-2.5" : "flex items-start gap-3 rounded-control px-3 py-2.5",
        layout === "page" && "w-full",
        className,
      )}
    >
      {mediaNode}
      <div className={cn("min-w-0 flex-1", layout !== "inline" && "flex flex-wrap items-center justify-between gap-3")}>
        <div className="min-w-0">
          <p className="font-body-strong text-foreground">{title}</p>
          {description ? <p className="mt-0.5 font-caption">{description}</p> : null}
        </div>
        {layout === "inline" ? actionRow : null}
        {layout !== "inline" ? actionRow : null}
      </div>
      <button
        type="button"
        aria-label={`Dismiss ${title}`}
        onClick={dismiss}
        className="grid size-6 shrink-0 place-items-center rounded-pill text-secondary hover:bg-hover hover:text-foreground"
      >
        <X size={14} strokeWidth={1.5} aria-hidden />
      </button>
    </div>
  );
}
