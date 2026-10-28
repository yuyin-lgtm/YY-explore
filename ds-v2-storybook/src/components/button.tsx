import { motion, useReducedMotion } from "motion/react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";
import { icon } from "../lib/icon";
import { motionTokens, reducedFade } from "../lib/motion";
import { Spinner } from "./spinner";

export type ButtonVariant = "primary" | "secondary" | "outline" | "brand-outline" | "ghost" | "destructive";
export type ButtonSize = "default" | "sm";

export type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"
> & {
  /** Primary is the accent fill. Secondary is white with a hairline. Brand outline washes accent-subtle on hover. */
  variant?: ButtonVariant;
  /** Default is 32px. Small is 28px. Nothing taller. */
  size?: ButtonSize;
  /** Square pill. Requires an accessible name. */
  iconOnly?: boolean;
  loading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};

const variants: Record<ButtonVariant, string> = {
  primary: "ds-btn-primary border-transparent bg-accent text-accent-foreground",
  secondary: "ds-btn-secondary border-border bg-background text-foreground hover:bg-hover active:bg-pressed",
  outline: "border-border-strong bg-transparent text-foreground hover:bg-hover active:bg-pressed",
  "brand-outline": "border-accent-border bg-background text-accent-text hover:bg-accent-subtle active:bg-pressed",
  ghost: "border-transparent bg-transparent text-foreground hover:bg-hover active:bg-pressed",
  destructive: "ds-btn-destructive border-transparent bg-danger text-accent-foreground",
};

const bordered: Record<ButtonVariant, boolean> = {
  primary: false,
  secondary: true,
  outline: true,
  "brand-outline": true,
  ghost: false,
  destructive: false,
};

const sizes: Record<ButtonSize, string> = {
  default: "h-control gap-2 px-3.5 font-body-strong",
  sm: "h-control-sm gap-1.5 px-3 font-caption-strong",
};

/**
 * Pill button. Heights are 32 (default) and 28 (small).
 * Press scales to 0.97 on a snappy spring; reduced motion keeps the color change only.
 */
export function Button({
  variant = "primary",
  size = "default",
  iconOnly = false,
  loading = false,
  disabled,
  leadingIcon,
  trailingIcon,
  children,
  className,
  type = "button",
  onClick,
  ...props
}: ButtonProps) {
  const reduce = useReducedMotion();
  const iconSize = size === "sm" ? 12 : 16;
  const inert = Boolean(disabled || loading);

  return (
    <motion.button
      type={type}
      className={cn(
        "ds-btn relative inline-flex shrink-0 items-center justify-center rounded-pill border whitespace-nowrap",
        "disabled:cursor-not-allowed disabled:border-disabled-border disabled:bg-disabled disabled:text-disabled-foreground",
        "aria-disabled:cursor-progress",
        variants[variant],
        sizes[size],
        iconOnly && (size === "sm" ? "w-[var(--size-control-sm)] px-0" : "w-control px-0"),
        className,
      )}
      data-focus-border={bordered[variant] ? "" : undefined}
      disabled={disabled}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      whileTap={reduce || inert ? undefined : { scale: iconOnly ? 0.96 : 0.97 }}
      transition={reduce ? reducedFade : motionTokens.spring.snappy}
      onClick={loading ? (event) => event.preventDefault() : onClick}
      {...props}
    >
      {loading ? (
        <Spinner decorative size={iconSize} tone={variant === "primary" || variant === "destructive" ? "on-accent" : "accent"} />
      ) : (
        icon(leadingIcon, iconSize)
      )}
      {iconOnly ? <span className="sr-only">{children}</span> : children}
      {!loading && icon(trailingIcon, iconSize)}
    </motion.button>
  );
}
