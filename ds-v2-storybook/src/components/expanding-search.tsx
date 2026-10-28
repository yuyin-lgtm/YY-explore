import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Search, X } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { icon } from "../lib/icon";
import { motionTokens, reducedFade, reducedFadeOut } from "../lib/motion";

export type ExpandingSearchItem = {
  id: string;
  title: string;
  meta?: string;
  group?: string;
  icon?: ReactNode;
  keywords?: string[];
};

export type ExpandingSearchProps = {
  /** Names the button, the field, and the results. */
  label: string;
  items: ExpandingSearchItem[];
  suggestions?: ExpandingSearchItem[];
  suggestionsLabel?: string;
  placeholder?: string;
  onSelect?: (item: ExpandingSearchItem) => void;
  onExpandedChange?: (expanded: boolean) => void;
  expandedWidth?: number;
  maxResults?: number;
  /** The edge the collapsed button sits on. The field grows away from it. */
  anchor?: "start" | "end";
  emptyHint?: string;
  className?: string;
};

function matches(item: ExpandingSearchItem, query: string) {
  const haystack = [item.title, item.meta, item.group, ...(item.keywords ?? [])].filter(Boolean).join(" ").toLowerCase();
  return haystack.includes(query);
}

function Highlight({ text, query }: { text: string; query: string }) {
  const index = query ? text.toLowerCase().indexOf(query.toLowerCase()) : -1;
  if (index < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <mark className="rounded-[4px] bg-pressed text-foreground">{text.slice(index, index + query.length)}</mark>
      {text.slice(index + query.length)}
    </>
  );
}

/**
 * Collapsed 32px pill that grows into a field and a results panel.
 * Client-side filter: pass server results in as `items` for creator search.
 */
export function ExpandingSearch({
  label,
  items,
  suggestions = [],
  suggestionsLabel = "Recent",
  placeholder = "Search",
  onSelect,
  onExpandedChange,
  expandedWidth = 360,
  maxResults = 6,
  anchor = "end",
  emptyHint = "Try a shorter word.",
  className,
}: ExpandingSearchProps) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const setOpen = (next: boolean) => {
    setExpanded(next);
    onExpandedChange?.(next);
    if (!next) setQuery("");
  };

  const trimmed = query.trim();
  const mode = trimmed ? "results" : "suggestions";
  const visible = useMemo(() => {
    const source = trimmed ? items.filter((item) => matches(item, trimmed.toLowerCase())) : suggestions;
    return source.slice(0, maxResults);
  }, [items, suggestions, trimmed, maxResults]);
  const empty = trimmed.length > 0 && visible.length === 0;

  useEffect(() => {
    setActive(0);
  }, [trimmed, expanded]);

  useEffect(() => {
    if (!expanded) return;
    inputRef.current?.focus();
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [expanded]);

  const choose = (item: ExpandingSearchItem) => {
    onSelect?.(item);
    setOpen(false);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      return;
    }
    if (!visible.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => (index + 1) % visible.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => (index - 1 + visible.length) % visible.length);
    } else if (event.key === "Home") {
      event.preventDefault();
      setActive(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActive(visible.length - 1);
    } else if (event.key === "Enter" && visible[active]) {
      event.preventDefault();
      choose(visible[active]);
    }
  };

  const groups = visible.reduce<{ name: string; items: ExpandingSearchItem[] }[]>((list, item) => {
    const name = item.group ?? (mode === "suggestions" ? suggestionsLabel : "Results");
    const found = list.find((group) => group.name === name);
    if (found) found.items.push(item);
    else list.push({ name, items: [item] });
    return list;
  }, []);

  return (
    <div ref={rootRef} className={cn("relative", anchor === "end" ? "flex justify-end" : "flex justify-start", className)}>
      <motion.div
        className="relative"
        initial={false}
        animate={{ width: expanded ? expandedWidth : 32 }}
        transition={reduce ? reducedFade : expanded ? motionTokens.spring.morph : motionTokens.spring.smooth}
      >
        {expanded ? (
          <div data-focus-border="" className="flex h-control items-center gap-2 rounded-pill border border-accent bg-background px-3 [--ds-shadow:var(--shadow-resting)] shadow-[var(--ds-shadow)]">
            <Search size={16} strokeWidth={1.5} aria-hidden className="shrink-0 text-muted" />
            <input
              ref={inputRef}
              role="combobox"
              aria-label={label}
              aria-expanded
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={visible[active] ? `${listId}-${visible[active].id}` : undefined}
              value={query}
              placeholder={placeholder}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={onKeyDown}
              data-unframed=""
              className="h-full min-w-0 flex-1 bg-transparent font-body outline-none placeholder:text-muted"
            />
            <button type="button" aria-label="Close search" onClick={() => setOpen(false)} className="grid size-6 place-items-center rounded-pill text-secondary hover:bg-hover">
              <X size={14} strokeWidth={1.5} aria-hidden />
            </button>
          </div>
        ) : (
          <button
            type="button"
            aria-label={label}
            aria-expanded={false}
            aria-controls={listId}
            onClick={() => setOpen(true)}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setOpen(true);
              }
            }}
            data-focus-border=""
            className="grid h-control w-control place-items-center rounded-pill border border-border bg-background text-foreground [--ds-shadow:var(--shadow-resting)] shadow-[var(--ds-shadow)] transition-[background-color,border-color,box-shadow] duration-fast ease-standard hover:border-border-strong hover:bg-hover"
          >
            <Search size={16} strokeWidth={1.5} aria-hidden />
          </button>
        )}

        <AnimatePresence>
          {expanded ? (
            <motion.div
              id={listId}
              role="listbox"
              aria-label={label}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0, transition: reducedFadeOut } : { opacity: 0, transition: { duration: motionTokens.duration.instant, ease: motionTokens.ease.standard } }}
              transition={reduce ? reducedFade : { duration: motionTokens.duration.fast, ease: motionTokens.ease.enter }}
              className="absolute z-30 mt-2 w-full overflow-hidden rounded-panel border border-border bg-raised p-1.5 shadow-floating"
            >
              {empty ? (
                <div className="px-3 py-6 text-center">
                  <p className="font-body-strong">No results</p>
                  <p className="mt-1 font-caption">{emptyHint}</p>
                </div>
              ) : (
                groups.map((group) => (
                  <div key={group.name} role="group" aria-label={group.name} className="mb-1 last:mb-0">
                    <p className="px-2 py-1.5 font-label">{group.name}</p>
                    {group.items.map((item) => {
                      const index = visible.indexOf(item);
                      const selected = index === active;
                      return (
                        <div
                          key={item.id}
                          id={`${listId}-${item.id}`}
                          role="option"
                          aria-selected={selected}
                          onMouseEnter={() => setActive(index)}
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => choose(item)}
                          className={cn(
                            "flex h-12 cursor-pointer items-center gap-2 rounded-item px-2",
                            selected ? "bg-muted-surface" : "bg-transparent",
                          )}
                        >
                          {item.icon ? <span className="grid size-8 place-items-center text-secondary">{icon(item.icon, 16)}</span> : null}
                          <span className="min-w-0">
                            <span className="block truncate font-body-strong">
                              <Highlight text={item.title} query={trimmed} />
                            </span>
                            {item.meta ? <span className="block truncate font-caption">{item.meta}</span> : null}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
              <div className="sr-only" aria-live="polite">
                {empty ? "No results" : `${visible.length} ${visible.length === 1 ? "result" : "results"}`}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
