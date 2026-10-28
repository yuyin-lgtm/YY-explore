import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import { motionTokens, reducedFade, reducedFadeOut } from "../lib/motion";

export type ChipProps = {
  /** Key half of a filter chip, such as "GMV". Omit for a plain chip. */
  label?: string;
  /** Value half, such as ">$10k". */
  value?: string;
  selected?: boolean;
  disabled?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
};

/** 24px filter chip. Backspace on the remove button clears it. */
export function Chip({ label, value, selected, disabled, onRemove, onClick, className, children }: ChipProps) {
  const name = [label, value].filter(Boolean).join(": ") || "filter";
  const body = (
    <>
      {label ? <span className="text-secondary">{label}</span> : null}
      {label && value ? <span aria-hidden className="text-muted">·</span> : null}
      {value ? <span>{value}</span> : null}
      {children}
    </>
  );

  return (
    <span
      className={cn(
        "inline-flex h-[var(--size-badge)] max-w-full items-center gap-1 rounded-item border px-2 font-caption-strong",
        selected ? "border-accent-border bg-accent-subtle text-accent-text" : "border-border bg-background text-foreground",
        "hover:border-border-strong",
        disabled && "pointer-events-none border-disabled-border bg-disabled text-disabled-foreground",
        className,
      )}
    >
      {onClick ? (
        <button type="button" disabled={disabled} onClick={onClick} className="inline-flex min-w-0 items-center gap-1">
          {body}
        </button>
      ) : (
        <span className="inline-flex min-w-0 items-center gap-1">{body}</span>
      )}
      {onRemove ? (
        <button
          type="button"
          aria-label={`Remove filter: ${name}`}
          disabled={disabled}
          onClick={onRemove}
          onKeyDown={(event) => {
            if (event.key === "Backspace" || event.key === "Delete") {
              event.preventDefault();
              onRemove();
            }
          }}
          className="grid size-5 place-items-center rounded-pill text-secondary hover:bg-hover hover:text-foreground"
        >
          <X size={12} strokeWidth={1.5} aria-hidden />
        </button>
      ) : null}
    </span>
  );
}

export function ChipGroup({
  chips,
  onRemove,
  className,
}: {
  chips: { id: string; label?: string; value?: string; selected?: boolean }[];
  onRemove: (id: string) => void;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <AnimatePresence initial={false}>
        {chips.map((chip) => (
          <motion.span
            key={chip.id}
            layout
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 0, transition: reducedFadeOut } : { opacity: 0, transition: { duration: motionTokens.duration.instant } }}
            transition={reduce ? reducedFade : motionTokens.spring.smooth}
          >
            <Chip label={chip.label} value={chip.value} selected={chip.selected} onRemove={() => onRemove(chip.id)} />
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
