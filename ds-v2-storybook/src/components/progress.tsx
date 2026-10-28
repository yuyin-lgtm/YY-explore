import { motion, useReducedMotion } from "motion/react";
import { cn } from "../lib/cn";
import { motionTokens, reducedFade } from "../lib/motion";

export type ProgressProps = {
  /** Current value. */
  value?: number;
  max?: number;
  label: string;
  showValue?: boolean;
  className?: string;
};

/** 6px pill track. The fill eases on the smooth spring. */
export function Progress({ value = 0, max = 100, label, showValue = false, className }: ProgressProps) {
  const reduce = useReducedMotion();
  const safeMax = max <= 0 ? 1 : max;
  const current = Math.min(safeMax, Math.max(0, value));
  const ratio = current / safeMax;
  return (
    <div className={cn("w-full", className)}>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="font-caption">{label}</span>
        {showValue ? <span className="font-caption-strong text-foreground tabular-nums">{Math.round(ratio * 100)}%</span> : null}
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={current}
        className="h-1.5 overflow-hidden rounded-pill bg-border"
      >
        <motion.div
          className="h-full rounded-pill bg-accent"
          initial={false}
          animate={{ width: `${ratio * 100}%` }}
          transition={reduce ? reducedFade : motionTokens.spring.smooth}
        />
      </div>
    </div>
  );
}
