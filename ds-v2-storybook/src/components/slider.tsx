import { motion, useReducedMotion } from "motion/react";
import { useId, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent, type RefObject } from "react";
import { cn } from "../lib/cn";
import { motionTokens } from "../lib/motion";

export type SliderMark = { value: number; label?: string };
export type SliderValue = number | [number, number];
export type SliderSize = "default" | "sm";

export type SliderProps<T extends SliderValue = number> = {
  label: string;
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
  min?: number;
  max?: number;
  step?: number;
  largeStep?: number;
  marks?: (number | SliderMark)[];
  format?: (value: number) => string;
  /** Tabular value on the label row. */
  showValue?: boolean;
  /** End captions under the track. */
  showMinMax?: boolean;
  /** Number field (two for a range) kept on the 32px control row. */
  pairedInput?: boolean;
  /** Default row is 32px. Small is 28px. */
  size?: SliderSize;
  disabled?: boolean;
  className?: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function snap(value: number, min: number, max: number, step: number) {
  const steps = Math.round((value - min) / step);
  const digits = step.toString().includes(".") ? step.toString().split(".")[1].length : 0;
  return clamp(Number((min + steps * step).toFixed(digits)), min, max);
}

function percent(value: number, min: number, max: number) {
  if (max === min) return 0;
  return ((value - min) / (max - min)) * 100;
}

/**
 * UI Arc slider, Reacher accent.
 * Track is 4px. Thumb is 16px white with a hairline and a resting shadow.
 * The label row and the control row are never taller than 32px (28px small).
 * The thumb springs on the snappy token unless it is being dragged or motion is reduced.
 */
export function Slider<T extends SliderValue = number>({
  label,
  value,
  defaultValue,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  largeStep,
  marks,
  format = (next) => String(next),
  showValue = true,
  showMinMax = false,
  pairedInput = false,
  size = "default",
  disabled,
  className,
}: SliderProps<T>) {
  const labelId = useId();
  const reduce = useReducedMotion();
  const initial = (value ?? defaultValue ?? (min as T)) as T;
  const [internal, setInternal] = useState<T>(initial);
  const [dragging, setDragging] = useState<number | null>(null);
  const current = (value ?? internal) as T;
  const values = (Array.isArray(current) ? current : [current]) as number[];
  const page = largeStep ?? Math.max(step, (max - min) / 10);
  const row = size === "sm" ? "h-control-sm" : "h-control";
  const transition = reduce || dragging !== null ? { duration: 0 } : motionTokens.spring.snappy;

  const commit = (next: number[]) => {
    const resolved = (Array.isArray(current) ? ([next[0], next[1]] as T) : (next[0] as T));
    if (value === undefined) setInternal(resolved);
    onValueChange?.(resolved);
  };

  const valueFromClient = (clientX: number, track: HTMLDivElement | null) => {
    const rect = track?.getBoundingClientRect();
    if (!rect || rect.width === 0) return min;
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
    return snap(min + ratio * (max - min), min, max, step);
  };

  const setThumb = (index: number, next: number) => {
    const copy = [...values];
    copy[index] = snap(next, min, max, step);
    if (copy.length === 2) {
      if (index === 0) copy[0] = Math.min(copy[0], copy[1]);
      if (index === 1) copy[1] = Math.max(copy[1], copy[0]);
    }
    commit(copy);
  };

  const normalizedMarks = (marks ?? []).map((mark) => (typeof mark === "number" ? { value: mark } : mark));
  const labelledMarks = normalizedMarks.filter((mark) => mark.label);
  const readout = values.length === 2 ? `${format(values[0])} – ${format(values[1])}` : format(values[0]);

  return (
    <div className={cn("w-full min-w-[220px]", className)} data-disabled={disabled || undefined}>
      <div className={cn("flex items-center justify-between gap-3", row)} data-testid="slider-label-row">
        <span id={labelId} className="truncate font-body-strong text-foreground">
          {label}
        </span>
        {showValue && !pairedInput ? <span className="font-body-strong text-foreground tabular-nums">{readout}</span> : null}
      </div>

      <div className={cn("flex items-center gap-3", row)} data-testid="slider-control">
        <Track
          labelId={labelId}
          label={label}
          values={values}
          min={min}
          max={max}
          step={step}
          page={page}
          disabled={disabled}
          format={format}
          marks={normalizedMarks}
          dragging={dragging}
          transition={transition}
          onDragStart={setDragging}
          onDragEnd={() => setDragging(null)}
          onThumb={setThumb}
          valueFromClient={valueFromClient}
        />
        {pairedInput
          ? values.map((thumb, index) => (
              <input
                key={index}
                type="number"
                inputMode="decimal"
                aria-label={values.length === 2 ? `${label} ${index === 0 ? "start" : "end"}` : `${label} value`}
                min={min}
                max={max}
                step={step}
                disabled={disabled}
                value={thumb}
                onChange={(event) => {
                  const next = event.target.valueAsNumber;
                  if (Number.isNaN(next)) return;
                  setThumb(index, next);
                }}
                data-focus-border=""
                className={cn(
                  "w-[4.5rem] shrink-0 rounded-control border border-border bg-background px-2 text-right font-body text-foreground tabular-nums outline-none",
                  "transition-[border-color,box-shadow] duration-fast ease-standard hover:border-border-strong",
                  "disabled:border-disabled-border disabled:bg-disabled disabled:text-disabled-foreground",
                  row,
                )}
              />
            ))
          : null}
      </div>

      {showMinMax ? (
        <div className="flex h-4 items-center justify-between font-caption tabular-nums">
          <span>{format(min)}</span>
          <span>{format(max)}</span>
        </div>
      ) : null}

      {labelledMarks.length ? (
        <div className="relative mt-1 h-4">
          {labelledMarks.map((mark) => (
            <button
              key={mark.value}
              type="button"
              tabIndex={-1}
              disabled={disabled}
              onClick={() => {
                if (values.length === 1) setThumb(0, mark.value);
                else setThumb(Math.abs(mark.value - values[0]) <= Math.abs(mark.value - values[1]) ? 0 : 1, mark.value);
              }}
              className="absolute top-0 -translate-x-1/2 font-caption tabular-nums hover:text-foreground"
              style={{ left: `${percent(mark.value, min, max)}%` }}
            >
              {mark.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Track({
  labelId,
  label,
  values,
  min,
  max,
  step,
  page,
  disabled,
  format,
  marks,
  dragging,
  transition,
  onDragStart,
  onDragEnd,
  onThumb,
  valueFromClient,
}: {
  labelId: string;
  label: string;
  values: number[];
  min: number;
  max: number;
  step: number;
  page: number;
  disabled?: boolean;
  format: (value: number) => string;
  marks: SliderMark[];
  dragging: number | null;
  transition: { duration: number } | typeof motionTokens.spring.snappy;
  onDragStart: (index: number) => void;
  onDragEnd: () => void;
  onThumb: (index: number, value: number) => void;
  valueFromClient: (clientX: number, track: HTMLDivElement | null) => number;
}) {
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const start = values[0];
  const end = values[values.length - 1];

  const pickIndex = (next: number) => {
    if (values.length === 1) return 0;
    return Math.abs(next - values[0]) <= Math.abs(next - values[1]) ? 0 : 1;
  };

  return (
    <div
      ref={setNode}
      className={cn("relative h-full min-w-0 flex-1 touch-pan-y", disabled ? "cursor-not-allowed" : "cursor-pointer")}
      onPointerDown={(event) => {
        if (disabled || event.target !== event.currentTarget && (event.target as HTMLElement).dataset.thumb === "true") return;
        if ((event.target as HTMLElement).closest("[data-thumb]")) return;
        const next = valueFromClient(event.clientX, node);
        const index = pickIndex(next);
        onDragStart(index);
        onThumb(index, next);
        const move = (pointer: PointerEvent) => onThumb(index, valueFromClient(pointer.clientX, node));
        const up = () => {
          onDragEnd();
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", up);
        };
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
      }}
    >
      <div className={cn("absolute top-1/2 right-2 left-2 h-1 -translate-y-1/2 rounded-pill", disabled ? "bg-disabled-border" : "bg-track")} />
      <motion.div
        className={cn("absolute top-1/2 h-1 -translate-y-1/2 rounded-pill", disabled ? "bg-disabled-foreground" : "bg-accent")}
        initial={false}
        animate={{
          left: `calc(8px + (100% - 16px) * ${percent(start, min, max) / 100})`,
          width: `calc((100% - 16px) * ${(percent(end, min, max) - percent(start, min, max)) / 100})`,
        }}
        transition={transition}
      />
      {marks.map((mark) => (
        <span
          key={mark.value}
          aria-hidden
          className="absolute top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-pill bg-border-strong"
          style={{ left: `calc(8px + (100% - 16px) * ${percent(mark.value, min, max) / 100})` }}
        />
      ))}
      {values.map((thumb, index) => (
        <Thumb
          key={index}
          labelId={labelId}
          label={label}
          index={index}
          value={thumb}
          min={min}
          max={max}
          disabled={disabled}
          text={format(thumb)}
          name={values.length === 2 ? `${label} ${index === 0 ? "start" : "end"}` : label}
          showTooltip={dragging === index}
          left={`calc(8px + (100% - 16px) * ${percent(thumb, min, max) / 100})`}
          transition={transition}
          onKeyDown={(event) => {
            let delta = 0;
            if (event.key === "ArrowRight" || event.key === "ArrowUp") delta = event.shiftKey ? page : step;
            else if (event.key === "ArrowLeft" || event.key === "ArrowDown") delta = -(event.shiftKey ? page : step);
            else if (event.key === "PageUp") delta = page;
            else if (event.key === "PageDown") delta = -page;
            else if (event.key === "Home") {
              event.preventDefault();
              onThumb(index, min);
              return;
            } else if (event.key === "End") {
              event.preventDefault();
              onThumb(index, max);
              return;
            } else return;
            event.preventDefault();
            onThumb(index, thumb + delta);
          }}
          onPointerDown={(event) => {
            if (disabled) return;
            event.stopPropagation();
            onDragStart(index);
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
            onThumb(index, valueFromClient(event.clientX, node));
          }}
          onPointerUp={() => onDragEnd()}
        />
      ))}
    </div>
  );
}

function Thumb({
  labelId,
  label,
  index,
  value,
  min,
  max,
  disabled,
  text,
  name,
  showTooltip,
  left,
  transition,
  onKeyDown,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: {
  labelId: string;
  label: string;
  index: number;
  value: number;
  min: number;
  max: number;
  disabled?: boolean;
  text: string;
  name: string;
  showTooltip: boolean;
  left: string;
  transition: { duration: number } | typeof motionTokens.spring.snappy;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerUp: () => void;
}) {
  return (
    <motion.div
      role="slider"
      tabIndex={disabled ? -1 : 0}
      data-thumb="true"
      aria-labelledby={labelId}
      aria-label={name}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={text}
      aria-disabled={disabled || undefined}
      aria-orientation="horizontal"
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      initial={false}
      animate={{ left }}
      transition={transition}
      data-focus-border=""
      className={cn(
        "absolute top-1/2 z-[1] size-4 -translate-x-1/2 -translate-y-1/2 rounded-pill border bg-background",
        "[--ds-shadow:var(--shadow-resting)] shadow-[var(--ds-shadow)]",
        "hover:[--ds-shadow:var(--shadow-resting),0_0_0_6px_var(--accent-subtle)]",
        disabled ? "cursor-not-allowed border-disabled-border bg-disabled" : "cursor-grab border-border active:cursor-grabbing",
      )}
      style={{ zIndex: index + 1 }}
    >
      {showTooltip ? (
        <span
          role="tooltip"
          className="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 rounded-item bg-foreground px-2 py-0.5 font-caption-strong whitespace-nowrap text-background tabular-nums shadow-raised"
        >
          {text}
        </span>
      ) : null}
      <span className="sr-only">
        {label} {text}
      </span>
    </motion.div>
  );
}

export type TrackRef = RefObject<HTMLDivElement | null>;
