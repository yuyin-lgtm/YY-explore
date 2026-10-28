import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, ChevronDown, Search } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { motionTokens, reducedFade, reducedFadeOut } from "../lib/motion";
import { describedById, Field } from "./field";

export type ComboboxItem = {
  value: string;
  label: string;
  meta?: string;
  avatar?: ReactNode;
  keywords?: string[];
  disabled?: boolean;
};

export type ComboboxProps = {
  label: string;
  items: ComboboxItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Fired as the user types. Parent can replace `items` with server results. */
  onSearch?: (query: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
};

/** Creator-style picker: 32px trigger, 44px options with avatar, name, meta, and a check. */
export function Combobox({
  label,
  items,
  value,
  defaultValue = "",
  onValueChange,
  onSearch,
  placeholder = "Search creators",
  emptyMessage = "No matches",
  disabled,
  className,
  id,
}: ComboboxProps) {
  const generated = useId();
  const fieldId = id ?? generated;
  const listId = `${fieldId}-list`;
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [internal, setInternal] = useState(defaultValue);
  const [active, setActive] = useState(0);
  const current = value ?? internal;
  const selected = items.find((item) => item.value === current);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      const haystack = [item.label, item.meta, ...(item.keywords ?? [])].filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(q);
    });
  }, [items, query]);

  useEffect(() => {
    setActive(0);
  }, [query, open]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  const commit = (next: string) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
    setQuery("");
    setOpen(false);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      return;
    }
    if (!filtered.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => (index + 1) % filtered.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => (index - 1 + filtered.length) % filtered.length);
    } else if (event.key === "Home") {
      event.preventDefault();
      setActive(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActive(filtered.length - 1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const item = filtered[active];
      if (item && !item.disabled) commit(item.value);
    }
  };

  return (
    <Field label={label} htmlFor={fieldId} className={className}>
      <div ref={rootRef} className="relative">
        <div
          className={cn(
            "flex h-control items-center gap-2 rounded-control border bg-background px-3 transition-[border-color] duration-fast ease-standard",
            open ? "border-accent" : "border-border hover:border-border-strong",
            disabled && "border-disabled-border bg-disabled",
          )}
          data-focus-border=""
        >
          <Search size={16} strokeWidth={1.5} aria-hidden className="shrink-0 text-muted" />
          {open ? (
            <input
              ref={inputRef}
              id={fieldId}
              role="combobox"
              aria-expanded
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={filtered[active] ? `${listId}-${filtered[active].value}` : undefined}
              aria-describedby={describedById(fieldId)}
              value={query}
              disabled={disabled}
              placeholder={selected?.label ?? placeholder}
              onChange={(event) => {
                setQuery(event.target.value);
                onSearch?.(event.target.value);
              }}
              onKeyDown={onKeyDown}
              data-unframed=""
              className="h-full min-w-0 flex-1 bg-transparent font-body outline-none placeholder:text-muted"
            />
          ) : (
            <button
              id={fieldId}
              type="button"
              role="combobox"
              aria-expanded={false}
              aria-controls={listId}
              data-unframed=""
              disabled={disabled}
              onClick={() => setOpen(true)}
              className={cn("h-full min-w-0 flex-1 truncate text-left font-body", selected ? "text-foreground" : "text-muted")}
            >
              {selected?.label ?? placeholder}
            </button>
          )}
          <ChevronDown size={16} strokeWidth={1.5} aria-hidden className="shrink-0 text-secondary" />
        </div>
        <AnimatePresence>
          {open ? (
            <motion.div
              id={listId}
              role="listbox"
              aria-label={label}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0, transition: reducedFadeOut } : { opacity: 0, transition: { duration: motionTokens.duration.instant } }}
              transition={reduce ? reducedFade : motionTokens.spring.smooth}
              className="absolute z-30 mt-1 max-h-72 w-full overflow-auto rounded-panel border border-border bg-raised p-1.5 shadow-floating"
            >
              {filtered.length === 0 ? <div className="px-2 py-6 text-center font-caption">{emptyMessage}</div> : null}
              {filtered.map((item, index) => {
                const isSelected = item.value === current;
                const isActive = index === active;
                return (
                  <div
                    key={item.value}
                    id={`${listId}-${item.value}`}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={item.disabled || undefined}
                    onMouseEnter={() => setActive(index)}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => !item.disabled && commit(item.value)}
                    className={cn(
                      "flex h-11 cursor-pointer items-center gap-2 rounded-item px-2",
                      isActive && "bg-muted-surface",
                      item.disabled && "cursor-not-allowed opacity-50",
                    )}
                  >
                    <span className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-pill bg-accent-subtle font-caption-strong text-accent-text">
                      {item.avatar ?? item.label.slice(0, 1)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-body-strong">{item.label}</span>
                      {item.meta ? <span className="block truncate font-caption">{item.meta}</span> : null}
                    </span>
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
