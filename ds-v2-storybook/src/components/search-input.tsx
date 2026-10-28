import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Search, X } from "lucide-react";
import { useId, type InputHTMLAttributes } from "react";
import { cn } from "../lib/cn";
import { motionTokens, reducedFade } from "../lib/motion";

export type SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "size" | "type"> & {
  /** Accessible name. Also used by the clear button. */
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  /** Default uses radius-control (14). Pill is fully rounded. */
  shape?: "default" | "pill";
  onClear?: () => void;
};

/**
 * 32px search field. Clear appears once there is a value.
 * Escape clears. Border moves from hairline to strong on hover and to accent on focus.
 */
export function SearchInput({
  label,
  value,
  onValueChange,
  shape = "default",
  onClear,
  disabled,
  placeholder = "Search",
  className,
  id,
  ...props
}: SearchInputProps) {
  const generated = useId();
  const fieldId = id ?? generated;
  const reduce = useReducedMotion();
  const clear = () => {
    onValueChange("");
    onClear?.();
  };

  return (
    <div
      className={cn(
        "flex h-control w-full items-center gap-2 border border-border bg-background px-3 text-foreground",
        "transition-[border-color,background-color] duration-fast ease-standard",
        "hover:border-border-strong",
        "has-[input:disabled]:cursor-not-allowed has-[input:disabled]:border-disabled-border has-[input:disabled]:bg-disabled",
        shape === "pill" ? "rounded-pill" : "rounded-control",
        className,
      )}
      data-focus-border=""
    >
      <Search size={16} strokeWidth={1.5} aria-hidden className="shrink-0 text-muted" />
      <input
        {...props}
        id={fieldId}
        type="search"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        aria-label={label}
        onChange={(event) => onValueChange(event.target.value)}
        onKeyDown={(event) => {
          props.onKeyDown?.(event);
          if (event.key === "Escape" && value) {
            event.preventDefault();
            event.stopPropagation();
            clear();
          }
        }}
        data-unframed=""
        className="h-full min-w-0 flex-1 bg-transparent font-body text-foreground outline-none placeholder:text-muted disabled:text-disabled-foreground [&::-webkit-search-cancel-button]:hidden"
      />
      <AnimatePresence initial={false}>
        {value && !disabled ? (
          <motion.button
            key="clear"
            type="button"
            aria-label="Clear search"
            initial={reduce ? { opacity: 0 } : { opacity: 0, filter: "blur(2px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={reduce ? { opacity: 0, transition: { duration: 0.1 } } : { opacity: 0, transition: { duration: motionTokens.duration.instant } }}
            transition={reduce ? reducedFade : motionTokens.spring.snappy}
            onClick={clear}
            className="grid size-6 shrink-0 place-items-center rounded-pill text-secondary hover:bg-hover hover:text-foreground"
          >
            <X size={14} strokeWidth={1.5} aria-hidden />
          </motion.button>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
