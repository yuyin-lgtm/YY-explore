import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import { icon } from "../lib/icon";
import { Button } from "./button";

export type MenuItem = {
  label: string;
  onSelect?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  icon?: ReactNode;
  /** Draws a hairline above this row. */
  separatorBefore?: boolean;
};

export type MenuProps = {
  /** Accessible name of the trigger. */
  label: string;
  items: MenuItem[];
  align?: "start" | "end" | "center";
  trigger?: ReactNode;
  className?: string;
};

/** Dropdown menu. Rows are 32px with an 8px radius; the panel uses the floating shadow. */
export function Menu({ label, items, align = "start", trigger, className }: MenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        {trigger ?? (
          <Button variant="outline" trailingIcon={<ChevronDown />}>
            {label}
          </Button>
        )}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align={align}
          sideOffset={8}
          className={cn("ds-layer z-40 min-w-[220px] rounded-panel border border-border bg-raised p-1.5 shadow-floating", className)}
        >
          {items.map((item) => (
            <div key={item.label}>
              {item.separatorBefore ? <DropdownMenu.Separator className="my-1 h-px bg-border" /> : null}
              <DropdownMenu.Item
                disabled={item.disabled}
                onSelect={() => item.onSelect?.()}
                className={cn(
                  "flex h-control cursor-pointer items-center gap-2 rounded-menu px-2 font-body outline-none",
                  "data-[highlighted]:bg-muted-surface",
                  "data-[disabled]:cursor-not-allowed data-[disabled]:text-disabled-foreground",
                  item.destructive ? "text-danger data-[highlighted]:bg-error-subtle" : "text-foreground",
                )}
              >
                {icon(item.icon, 16)}
                <span className="truncate">{item.label}</span>
              </DropdownMenu.Item>
            </div>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
