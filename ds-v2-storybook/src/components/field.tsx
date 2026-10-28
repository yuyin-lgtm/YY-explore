import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export function Field({
  label,
  htmlFor,
  hint,
  error,
  className,
  children,
}: {
  label?: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  const describedBy = error ? `${htmlFor}-error` : hint ? `${htmlFor}-hint` : undefined;
  return (
    <div className={cn("flex w-full flex-col gap-1", className)}>
      {label ? (
        <label htmlFor={htmlFor} className="font-body-strong text-foreground">
          {label}
        </label>
      ) : null}
      {children}
      {error ? (
        <p id={describedBy} className="font-caption text-error!">
          {error}
        </p>
      ) : hint ? (
        <p id={describedBy} className="font-caption">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function describedById(id: string, error?: string, hint?: string) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

export const controlClass = cn(
  "h-control w-full rounded-control border border-border bg-background px-3 font-body text-foreground",
  "placeholder:text-muted",
  "transition-[border-color,background-color,box-shadow] duration-fast ease-standard",
  "hover:border-border-strong",
  "outline-none",
  "disabled:cursor-not-allowed disabled:border-disabled-border disabled:bg-disabled disabled:text-disabled-foreground",
  "aria-invalid:border-error",
);
