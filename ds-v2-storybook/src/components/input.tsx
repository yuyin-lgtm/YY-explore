import { useId, type InputHTMLAttributes } from "react";
import { cn } from "../lib/cn";
import { controlClass, describedById, Field } from "./field";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label?: string;
  hint?: string;
  error?: string;
  /** Default is 32px. Small is 28px. */
  size?: "default" | "sm";
};

/** Single-line text field. Label sits 4px above; hint or error sits 4px below. */
export function Input({ label, hint, error, size = "default", id, className, disabled, ...props }: InputProps) {
  const generated = useId();
  const fieldId = id ?? generated;
  return (
    <Field label={label} htmlFor={fieldId} hint={hint} error={error}>
      <input
        id={fieldId}
        data-focus-border=""
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedById(fieldId, error, hint)}
        className={cn(controlClass, size === "sm" && "h-control-sm font-caption-strong", className)}
        {...props}
      />
    </Field>
  );
}
