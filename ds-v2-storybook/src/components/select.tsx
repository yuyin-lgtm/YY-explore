import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "../lib/cn";
import { motionTokens, reducedFade, reducedFadeOut } from "../lib/motion";
import { controlClass, describedById, Field } from "./field";

export type SelectOption = { value: string; label: string; disabled?: boolean };

export const TIMEFRAME_PRESETS: SelectOption[] = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "month", label: "This month" },
  { value: "year", label: "This year" },
  { value: "custom", label: "Custom range" },
];

export type SelectProps = {
  label: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  size?: "default" | "sm";
  className?: string;
  id?: string;
};

/** 32px trigger. List uses panel radius; the active row is a muted surface. */
export function Select({
  label,
  options,
  value,
  defaultValue = "",
  onValueChange,
  placeholder = "Select",
  hint,
  error,
  disabled,
  size = "default",
  className,
  id,
}: SelectProps) {
  const generated = useId();
  const fieldId = id ?? generated;
  const listId = `${fieldId}-list`;
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(defaultValue);
  const [active, setActive] = useState(0);
  const current = value ?? internal;
  const selected = options.find((option) => option.value === current);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  const commit = (next: string) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
    setOpen(false);
  };

  const enabled = options.filter((option) => !option.disabled);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (!open && (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      setOpen(true);
      setActive(Math.max(0, options.findIndex((option) => option.value === current)));
      return;
    }
    if (!open) return;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => (index + 1) % options.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => (index - 1 + options.length) % options.length);
    } else if (event.key === "Home") {
      event.preventDefault();
      setActive(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActive(options.length - 1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const option = options[active];
      if (option && !option.disabled) commit(option.value);
    }
  };

  return (
    <Field label={label} htmlFor={fieldId} hint={hint} error={error} className={className}>
      <div ref={rootRef} className="relative">
        <button
          id={fieldId}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedById(fieldId, error, hint)}
          data-focus-border=""
          disabled={disabled}
          onClick={() => setOpen((next) => !next)}
          onKeyDown={onKeyDown}
          className={cn(controlClass, "flex items-center justify-between gap-2 text-left", size === "sm" && "h-control-sm", !selected && "text-muted")}
        >
          <span className="truncate">{selected?.label ?? placeholder}</span>
          <ChevronDown size={16} strokeWidth={1.5} aria-hidden className={cn("shrink-0 text-secondary transition-transform duration-fast", open && "rotate-180")} />
        </button>
        <AnimatePresence>
          {open ? (
            <motion.div
              id={listId}
              role="listbox"
              aria-label={label}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0, transition: reducedFadeOut } : { opacity: 0, transition: { duration: motionTokens.duration.instant } }}
              transition={reduce ? reducedFade : { ...motionTokens.spring.smooth, opacity: { duration: motionTokens.duration.fast, ease: motionTokens.ease.enter } }}
              className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-panel border border-border bg-raised p-1.5 shadow-floating"
            >
              {enabled.length === 0 ? <div className="px-2 py-3 font-caption">No options</div> : null}
              {options.map((option, index) => {
                const isSelected = option.value === current;
                const isActive = index === active;
                return (
                  <div
                    key={option.value}
                    id={`${listId}-${option.value}`}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={option.disabled || undefined}
                    onMouseEnter={() => setActive(index)}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => !option.disabled && commit(option.value)}
                    className={cn(
                      "flex h-10 cursor-pointer items-center justify-between gap-2 rounded-item px-2 font-body",
                      isActive && "bg-muted-surface",
                      option.disabled && "cursor-not-allowed text-disabled-foreground",
                    )}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected ? <Check size={16} strokeWidth={1.5} aria-hidden className="text-accent-text" /> : null}
                  </div>
                );
              })}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </Field>
  );
}
