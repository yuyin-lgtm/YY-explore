import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import { Button, type ButtonProps } from "./button";

export type DialogAction = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
};

export type DialogProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Trigger rendered as a child. Omit when the dialog is controlled from outside. */
  trigger?: ReactNode;
  title: string;
  description?: string;
  /** Default is 560. Small is 400. */
  size?: "default" | "sm";
  /** Changes only the primary button tone. The chrome stays the same. */
  destructive?: boolean;
  primaryAction?: DialogAction;
  secondaryAction?: DialogAction;
  children?: ReactNode;
  className?: string;
};

/**
 * One dialog. Title, short description, close button, and right-aligned 32px pill actions.
 * Padding is 24 (16 on mobile). No header bar and no divider.
 */
export function Dialog({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  title,
  description,
  size = "default",
  destructive = false,
  primaryAction,
  secondaryAction,
  children,
  className,
}: DialogProps) {
  const width = size === "sm" ? "var(--size-dialog-sm)" : "var(--size-dialog)";
  return (
    <DialogPrimitive.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger ? <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger> : null}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="ds-overlay fixed inset-0 z-50 bg-[var(--overlay)]" />
        <DialogPrimitive.Content
          {...(description ? {} : { "aria-describedby": undefined })}
          onOpenAutoFocus={(event) => {
            const root = event.currentTarget as HTMLElement;
            const secondary = root.querySelector<HTMLElement>("[data-dialog-secondary]");
            const close = root.querySelector<HTMLElement>("[data-dialog-close]");
            const target = secondary ?? close;
            if (target) {
              event.preventDefault();
              target.focus();
            }
          }}
          className={cn(
            "ds-dialog fixed top-1/2 left-1/2 z-50 max-h-[min(640px,calc(100dvh-32px))] -translate-x-1/2 -translate-y-1/2 overflow-auto",
            "rounded-panel border border-border bg-raised text-foreground shadow-floating outline-none",
            className,
          )}
          style={{ width: `min(calc(100vw - 32px), ${width})`, padding: "var(--dialog-padding)" }}
        >
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <DialogPrimitive.Title className="font-heading text-foreground">{title}</DialogPrimitive.Title>
              {description ? (
                <DialogPrimitive.Description className="mt-1 font-subtitle">{description}</DialogPrimitive.Description>
              ) : null}
            </div>
            <DialogPrimitive.Close
              data-dialog-close
              aria-label="Close"
              className="grid h-control w-control shrink-0 place-items-center rounded-pill text-secondary transition-colors duration-fast ease-standard hover:bg-hover hover:text-foreground"
            >
              <X size={16} strokeWidth={1.5} aria-hidden />
            </DialogPrimitive.Close>
          </div>
          {children ? <div className="mt-4">{children}</div> : null}
          {primaryAction || secondaryAction ? (
            <div className="mt-6 flex items-center justify-end gap-2">
              {secondaryAction ? (
                <Button
                  data-dialog-secondary
                  variant="outline"
                  disabled={secondaryAction.disabled}
                  onClick={secondaryAction.onClick}
                >
                  {secondaryAction.label}
                </Button>
              ) : null}
              {primaryAction ? (
                <Button
                  variant={destructive ? "destructive" : "primary"}
                  disabled={primaryAction.disabled}
                  onClick={primaryAction.onClick}
                >
                  {primaryAction.label}
                </Button>
              ) : null}
            </div>
          ) : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export type { ButtonProps };
