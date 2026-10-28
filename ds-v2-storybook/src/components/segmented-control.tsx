import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useId, type KeyboardEvent } from "react";
import { cn } from "../lib/cn";
import { motionTokens, reducedFade } from "../lib/motion";

export type SegmentOption = { value: string; label: string; disabled?: boolean };

export type SegmentedControlProps = {
  /** Names the radiogroup. */
  label: string;
  options: SegmentOption[];
  value: string;
  onValueChange: (value: string) => void;
  /** Default track is 32px (thumb 28). Small track is 28px. */
  size?: "default" | "sm";
  disabled?: boolean;
  className?: string;
};

/** Replaces the old pill switcher. The thumb slides on the morph spring. */
export function SegmentedControl({
  label,
  options,
  value,
  onValueChange,
  size = "default",
  disabled,
  className,
}: SegmentedControlProps) {
  const id = useId();
  const reduce = useReducedMotion();

  const move = (event: KeyboardEvent, index: number) => {
    const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
    if (!direction && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const enabled = options.map((option, optionIndex) => ({ option, optionIndex })).filter((entry) => !entry.option.disabled);
    if (!enabled.length) return;
    if (event.key === "Home") {
      onValueChange(enabled[0].option.value);
      return;
    }
    if (event.key === "End") {
      onValueChange(enabled[enabled.length - 1].option.value);
      return;
    }
    const current = enabled.findIndex((entry) => entry.optionIndex === index);
    const next = enabled[(current + direction + enabled.length) % enabled.length];
    onValueChange(next.option.value);
  };

  return (
    <LayoutGroup id={id}>
      <div
        role="radiogroup"
        aria-label={label}
        aria-disabled={disabled || undefined}
        className={cn(
          "inline-flex items-center rounded-pill bg-muted-surface p-0.5",
          size === "sm" ? "h-control-sm" : "h-control",
          disabled && "opacity-60",
          className,
        )}
      >
        {options.map((option, index) => {
          const selected = option.value === value;
          const optionDisabled = Boolean(disabled || option.disabled);
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={optionDisabled}
              tabIndex={selected ? 0 : -1}
              onClick={() => onValueChange(option.value)}
              onKeyDown={(event) => move(event, index)}
              className={cn(
                "relative h-full rounded-pill px-3 transition-colors duration-fast ease-standard",
                size === "sm" ? "font-caption-strong" : "font-body-strong",
                selected ? "text-foreground" : "text-secondary",
                optionDisabled && "cursor-not-allowed",
              )}
            >
              {selected ? (
                <motion.span
                  layoutId={`${id}-thumb`}
                  className="absolute inset-0 rounded-pill bg-background shadow-resting"
                  transition={reduce ? reducedFade : motionTokens.spring.morph}
                />
              ) : null}
              <span className="relative z-[1]">{option.label}</span>
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
