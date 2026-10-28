import { Check, Lock } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { cn } from "../lib/cn";
import { Button } from "./button";

export type PaywallProps = {
  open?: boolean;
  title: string;
  description: string;
  features?: string[];
  actionLabel?: string;
  dismissLabel?: string;
  onUpgrade?: () => void;
  onDismiss?: () => void;
  className?: string;
};

/**
 * Reacher-only upgrade overlay. Soft floating card on a dimmed region.
 * There is no matching UI Arc Pro block; this is built from Dialog-like chrome and the pill button.
 */
export function Paywall({
  open = true,
  title,
  description,
  features = [],
  actionLabel = "Upgrade",
  dismissLabel = "Not now",
  onUpgrade,
  onDismiss,
  className,
}: PaywallProps) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;
    const previously = document.activeElement as HTMLElement | null;
    const items = () =>
      [...panel.querySelectorAll<HTMLElement>("button, [href], input, [tabindex]:not([tabindex='-1'])")].filter(
        (element) => !element.hasAttribute("disabled"),
      );
    panel.querySelector<HTMLElement>("[data-paywall-dismiss]")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onDismiss?.();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = items();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previously?.focus?.();
    };
  }, [open, onDismiss]);

  if (!open) return null;

  return (
    <div className={cn("absolute inset-0 z-20 flex items-center justify-center p-4", className)}>
      <div className="absolute inset-0 bg-[var(--overlay)] backdrop-blur-[2px]" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative w-full max-w-[400px] rounded-surface border border-border bg-raised p-[var(--dialog-padding)] shadow-floating"
      >
        <span className="grid size-10 place-items-center rounded-item bg-accent-subtle text-accent-text">
          <Lock size={16} strokeWidth={1.5} aria-hidden />
        </span>
        <h2 id={titleId} className="mt-3 font-heading text-foreground">
          {title}
        </h2>
        <p id={descriptionId} className="mt-1 font-subtitle">
          {description}
        </p>
        {features.length ? (
          <ul className="mt-4 flex flex-col gap-2">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 font-body text-foreground">
                <Check size={16} strokeWidth={1.5} aria-hidden className="mt-0.5 shrink-0 text-accent-text" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button data-paywall-dismiss variant="outline" onClick={onDismiss}>
            {dismissLabel}
          </Button>
          <Button variant="primary" onClick={onUpgrade}>
            {actionLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
