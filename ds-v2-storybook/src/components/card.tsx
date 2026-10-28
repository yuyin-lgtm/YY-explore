import { animate, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { icon } from "../lib/icon";
import { motionTokens, reducedFade } from "../lib/motion";

export type CardProps = {
  title?: string;
  description?: string;
  variant?: "default" | "muted" | "outlined";
  children?: ReactNode;
  className?: string;
};

/** Panel radius 26, padding 16, hairline border, resting shadow. */
export function Card({ title, description, variant = "default", children, className }: CardProps) {
  return (
    <section
      className={cn(
        "rounded-panel border p-[var(--card-padding)]",
        variant === "muted" && "border-border-subtle bg-muted-surface",
        variant === "outlined" && "border-border bg-raised shadow-none",
        variant === "default" && "border-border bg-raised shadow-resting",
        className,
      )}
    >
      {title ? <h3 className="font-heading text-foreground">{title}</h3> : null}
      {description ? <p className={cn("font-body text-secondary", title && "mt-1")}>{description}</p> : null}
      {children ? <div className={cn((title || description) && "mt-3")}>{children}</div> : null}
    </section>
  );
}

function useCount(value: number) {
  const reduce = useReducedMotion();
  const from = useRef(value);
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      from.current = value;
      return;
    }
    const controls = animate(from.current, value, {
      ...motionTokens.spring.smooth,
      onUpdate: (next) => setDisplay(next),
    });
    from.current = value;
    return () => controls.stop();
  }, [reduce, value]);
  return display;
}

export type MetricCardProps = {
  label: string;
  value: number;
  format?: (value: number) => string;
  /** Includes the sign, such as "+12.4%". Color is not the only cue. */
  delta?: string;
  caption?: string;
  tone?: "default" | "brand" | "success";
  selected?: boolean;
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
};

/** Metric tile. Radius 34. The headline uses the number style and counts on the smooth spring. */
export function MetricCard({
  label,
  value,
  format,
  delta,
  caption,
  tone = "default",
  selected,
  interactive,
  onClick,
  className,
}: MetricCardProps) {
  const display = useCount(value);
  const text = format ? format(display) : new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(display);
  const positive = delta?.trim().startsWith("+");
  const negative = delta?.trim().startsWith("-");
  const classes = cn(
    "w-full rounded-surface border p-[var(--card-padding)] text-left shadow-resting",
    tone === "brand" && "border-accent-border bg-accent-subtle",
    tone === "success" && "border-success-border bg-success-subtle",
    tone === "default" && "border-border bg-raised",
    selected && "border-accent bg-accent-subtle ring-2 ring-accent",
    interactive && "transition-[transform,box-shadow,background-color] duration-fast ease-standard hover:-translate-y-px hover:shadow-raised",
    className,
  );
  const body = (
    <>
      <p className="font-label">{label}</p>
      <p className="mt-2 font-number text-foreground">{text}</p>
      {delta || caption ? (
        <p className="mt-2 flex flex-wrap items-center gap-1.5">
          {delta ? (
            <span
              className={cn(
                "inline-flex h-5 items-center rounded-pill px-2 font-caption-strong",
                positive && "bg-success-subtle text-success",
                negative && "bg-error-subtle text-error",
                !positive && !negative && "bg-muted-surface text-secondary",
              )}
            >
              {delta}
            </span>
          ) : null}
          {caption ? <span className="font-caption">{caption}</span> : null}
        </p>
      ) : null}
    </>
  );
  if (interactive || onClick) {
    return (
      <button type="button" onClick={onClick} aria-pressed={selected} className={classes}>
        {body}
      </button>
    );
  }
  return <article className={classes}>{body}</article>;
}

export type ClickableCardProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  href?: string;
  className?: string;
};

/** Clickable row card. Selected state is a 2px accent border on the subtle fill. */
export function ClickableCard({ title, description, icon: glyph, selected, disabled, onClick, href, className }: ClickableCardProps) {
  const reduce = useReducedMotion();
  const classNames = cn(
    "flex w-full items-center gap-3 rounded-panel border p-[var(--card-padding)] text-left shadow-resting",
    "transition-[background-color,border-color,box-shadow,transform] duration-fast ease-standard",
    selected ? "border-accent bg-accent-subtle" : "border-border bg-raised hover:border-border-strong hover:shadow-raised",
    disabled && "pointer-events-none border-disabled-border bg-disabled text-disabled-foreground",
    className,
  );
  const content = (
    <>
      {glyph ? (
        <span className="grid size-9 shrink-0 place-items-center rounded-item bg-accent-subtle text-accent-text">{icon(glyph, 16)}</span>
      ) : null}
      <span className="min-w-0">
        <span className="block truncate font-heading text-foreground">{title}</span>
        {description ? <span className="mt-0.5 block font-body text-secondary">{description}</span> : null}
      </span>
    </>
  );
  const motionProps = {
    whileTap: reduce || disabled ? undefined : { scale: 0.99 },
    transition: reduce ? reducedFade : motionTokens.spring.snappy,
  };
  if (href && !disabled) {
    return (
      <motion.a href={href} aria-pressed={selected} className={classNames} {...motionProps}>
        {content}
      </motion.a>
    );
  }
  return (
    <motion.button type="button" disabled={disabled} aria-pressed={selected} onClick={onClick} className={classNames} {...motionProps}>
      {content}
    </motion.button>
  );
}
