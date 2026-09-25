import * as React from "react";
import {
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  MenuTrigger as AriaMenuTrigger,
  Popover as AriaPopover,
  type MenuItemProps as AriaMenuItemProps,
  type MenuProps as AriaMenuProps,
  type PopoverProps as AriaPopoverProps,
} from "react-aria-components";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { PopoverSurface, SelectSeparator, selectItemVariants } from "@/components/forms/select";

/**
 * Action-menu parts — the dropdown opened by an overflow (`···`) or similar
 * trigger, e.g. an application row's View Details / Share / Withdraw
 * (`product-specs/applications-card.md` §4.1). Visually identical to the
 * Select dropdown (Figma: `Select Content (Popper)` + `Select Item`, reused
 * via `PopoverSurface`/`selectItemVariants`) but built on React Aria's `Menu`
 * rather than `ListBox`, so assistive tech announces actions, not options to
 * choose. Wrap a React Aria `Button` trigger and `MenuContent` in
 * `MenuTrigger`.
 */

/** Matches `Button`/`SelectItem`'s icon-prop contract. Icons inherit the item's text color, so a destructive item's icon turns red with its label. */
type IconProp = React.FC<{ className?: string }> | React.ReactNode;

interface MenuContentProps<T extends object>
  extends Omit<AriaPopoverProps, "children" | "className">,
    Pick<AriaMenuProps<T>, "items" | "children" | "onAction"> {
  /** Classes for the panel surface. Defaults to Figma's 216px width. */
  className?: string;
}

/** The floating actions panel — same surface and entrance motion as `SelectContent`. */
function MenuContent<T extends object>({
  className,
  items,
  children,
  onAction,
  ...props
}: MenuContentProps<T>) {
  return (
    <AriaPopover data-slot="menu-content" {...props}>
      {({ placement }) => (
        <PopoverSurface placement={placement} className={className}>
          <AriaMenu
            data-slot="menu"
            items={items}
            onAction={onAction}
            className="flex max-h-80 flex-col gap-0.5 overflow-y-auto outline-none"
          >
            {children}
          </AriaMenu>
        </PopoverSurface>
      )}
    </AriaPopover>
  );
}

/**
 * Adds a `tone` axis on top of the Select item geometry/states. `destructive` (e.g. Withdraw) colors the label and icon `tone-destructive`
 * and swaps the hover/keyboard-focus fill from `hover` to `destructive-subtle`. Same `not-data-[selected]:` prefix as
 * `selectItemVariants`' hover so the selectors match in specificity and `cn()` replaces the base fill rather than stacking under it.
 */
const menuItemVariants = cva("", {
  variants: {
    tone: {
      default: "",
      destructive:
        "text-tone-destructive not-data-[selected]:data-[hovered]:bg-destructive-subtle not-data-[selected]:data-[focused]:bg-destructive-subtle",
    },
  },
  defaultVariants: { tone: "default" },
});

interface MenuItemProps
  extends Omit<AriaMenuItemProps, "children" | "className">,
    VariantProps<typeof selectItemVariants>,
    VariantProps<typeof menuItemVariants> {
  /** The action's label. */
  children: React.ReactNode;
  /** Leading 16px icon. Pass an icon component (auto-sized, inherits the item's color) or a pre-rendered element. */
  icon?: IconProp;
  className?: string;
}

/** One action in a `MenuContent` panel — optional leading icon + label, with a `destructive` tone for irreversible actions. */
function MenuItem({ size = "sm", tone = "default", children, icon, className, textValue, ...props }: MenuItemProps) {
  const Icon = typeof icon === "function" ? (icon as React.FC<{ className?: string }>) : null;

  return (
    <AriaMenuItem
      data-slot="menu-item"
      data-size={size}
      data-tone={tone}
      textValue={textValue ?? (typeof children === "string" ? children : undefined)}
      className={cn(selectItemVariants({ size }), menuItemVariants({ tone }), className)}
      {...props}
    >
      {Icon ? <Icon className="size-4 shrink-0" /> : (icon as React.ReactNode)}
      <span className="min-w-0 flex-1 truncate">{children}</span>
    </AriaMenuItem>
  );
}

/**
 * How many items a menu's children hold: every element except separators, looking inside fragments and skipping
 * `false`/`null` from conditional items. Row cards use it to hide a `···` actions menu with only one item
 * (DESIGN.md "Hide a `···` menu with only one item").
 */
function countMenuItems(children: React.ReactNode): number {
  let count = 0;
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    if (child.type === React.Fragment) {
      count += countMenuItems((child.props as { children?: React.ReactNode }).children);
    } else if (child.type !== SelectSeparator) {
      count += 1;
    }
  });
  return count;
}

export {
  AriaMenuTrigger as MenuTrigger,
  MenuContent,
  MenuItem,
  SelectSeparator as MenuSeparator,
  menuItemVariants,
  countMenuItems,
  type MenuContentProps,
  type MenuItemProps,
};
