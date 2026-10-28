import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export type SkeletonPreset = "card" | "list" | "table" | "form";

export type SkeletonProps = {
  preset?: SkeletonPreset;
  /** Announced while the placeholder is visible. */
  label?: string;
  loading?: boolean;
  children?: ReactNode;
  className?: string;
};

function Bone({ className }: { className?: string }) {
  return <div aria-hidden className={cn("ds-bone rounded-control", className)} />;
}

/** Muted bones inside a panel. The container is busy until real content replaces it. */
export function Skeleton({ preset = "card", label = "Loading content", loading = true, children, className }: SkeletonProps) {
  if (!loading) return <>{children}</>;
  return (
    <div role="status" aria-busy="true" aria-live="polite" className={cn("rounded-panel border border-border bg-raised p-[var(--card-padding)]", className)}>
      <span className="sr-only">{label}</span>
      <div aria-hidden>
        {preset === "card" ? (
          <div className="flex flex-col gap-3">
            <Bone className="h-4 w-1/3" />
            <Bone className="h-8 w-1/2" />
            <Bone className="h-3 w-full" />
            <Bone className="h-3 w-4/5" />
          </div>
        ) : null}
        {preset === "list" ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="flex items-center gap-3">
                <Bone className="size-8 rounded-pill" />
                <div className="flex flex-1 flex-col gap-2">
                  <Bone className="h-3 w-1/2" />
                  <Bone className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : null}
        {preset === "table" ? (
          <div className="flex flex-col gap-2">
            <Bone className="h-8 w-full" />
            {Array.from({ length: 4 }, (_, index) => (
              <Bone key={index} className="h-10 w-full" />
            ))}
          </div>
        ) : null}
        {preset === "form" ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="flex flex-col gap-2">
                <Bone className="h-3 w-24" />
                <Bone className="h-control w-full" />
              </div>
            ))}
            <Bone className="h-control w-28 rounded-pill" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
