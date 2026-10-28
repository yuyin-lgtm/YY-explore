import { cn } from "../lib/cn";

export type SpinnerSize = 12 | 16 | 20 | 24;
export type SpinnerTone = "accent" | "on-accent";

export type SpinnerProps = {
  size?: SpinnerSize;
  tone?: SpinnerTone;
  /** Announced to assistive tech. The ring itself is decorative. */
  label?: string;
  /** Hide the status role when a parent already exposes the busy state. */
  decorative?: boolean;
  className?: string;
};

/** Reacher-only. UI Arc has no spinner. One turn is 0.8s linear; reduced motion pulses opacity. */
export function Spinner({ size = 16, tone = "accent", label = "Loading…", decorative = false, className }: SpinnerProps) {
  const ring = (
    <span
      aria-hidden
      className={cn(
        "ds-spinner inline-block rounded-pill border-2 border-current border-r-transparent",
        tone === "accent" ? "text-accent" : "text-accent-foreground",
      )}
      style={{ width: size, height: size }}
    />
  );
  if (decorative) return <span className={cn("inline-flex", className)}>{ring}</span>;
  return (
    <span role="status" className={cn("inline-flex", className)}>
      <span className="sr-only">{label}</span>
      {ring}
    </span>
  );
}
