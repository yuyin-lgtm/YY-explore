import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";

type IconProps = { size?: number; strokeWidth?: number; "aria-hidden"?: boolean };

/** Lucide icons at stroke 1.5. Default 16px, small controls use 12px. */
export function icon(node: ReactNode, size = 16) {
  if (!isValidElement(node)) return node;
  return cloneElement(node as ReactElement<IconProps>, {
    size,
    strokeWidth: 1.5,
    "aria-hidden": true,
  });
}
