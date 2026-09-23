import * as React from "react";
import { motion } from "motion/react";
import {
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  Popover as AriaPopover,
  Separator as AriaSeparator,
  type ListBoxItemProps as AriaListBoxItemProps,
  type ListBoxProps as AriaListBoxProps,
  type PopoverProps as AriaPopoverProps,
  type SeparatorProps as AriaSeparatorProps,
} from "react-aria-components";
import { cva, type VariantProps } from "class-variance-authority";
import { Check } from "@untitledui/icons";

import { cn } from "@/lib/utils";
import { popoverVariants, useMotionPreference } from "@/lib/motion";
import { Avatar, type AvatarProps } from "@/components/data-display/avatar";

/**
 * Dropdown parts for a select: the floating panel (`SelectContent`), its
 * options (`SelectItem`), and a divider (`SelectSeparator`). Figma:
 * `Select Content (Popper)` and `Select Item` (Size: xs 32 / sm 36 / md 40 ×
 * State: Default / Hover / Selected, plus an xs `Divider` state →
 * `SelectSeparator`). Built on React Aria's `Popover` + `ListBox` so they
 * drop straight into a React Aria `Select` (which supplies the trigger ref
 * and selection state) — Figma has no trigger/field design yet, so none is
 * shipped here; compose `<Select>` + a trigger `Button` + `<SelectValue>`
 * around these when one exists.
 */

/** Matches `Button`/`Badge`'s icon-prop contract: an unrendered icon component (auto-sized/colored) or a pre-rendered element. */
type IconProp = React.FC<{ className?: string }> | React.ReactNode;

function renderIcon(icon: IconProp) {
  if (typeof icon === "function") {
    const Icon = icon as React.FC<{ className?: string }>;
    return <Icon className="size-4 shrink-0 text-icon-foreground" />;
  }
  return icon;
}

interface SelectContentProps<T extends object>
  extends Omit<AriaPopoverProps, "children" | "className">,
    Pick<AriaListBoxProps<T>, "items" | "children" | "renderEmptyState"> {
  /** Classes for the panel surface (e.g. `w-(--trigger-width)` to match a trigger). Defaults to Figma's 216px width. */
  className?: string;
}

/**
 * The floating options panel. Figma: `Select Content (Popper)` — white
 * `background/default`, `border/neutral/border`, `radius/popover`
 * (`rounded-select-content`, 12px), `shadow/popover`, 8px inset (7px padding
 * + the 1px border, since Figma strokes inside), 2px gap
 * between items, 216px wide. Enters with the shared `popoverVariants` (fade +
 * soft scale + a small move away from the trigger, CLAUDE.md "Menus and
 * Dropdowns"), with the movement direction taken from React Aria's
 * `placement` render prop; opacity-only under reduced motion. React Aria
 * unmounts the popover as soon as it closes (no CSS exit animation to wait
 * on), so there's no exit animation — same as `SidebarTooltip`.
 */
function SelectContent<T extends object>({
  className,
  items,
  children,
  renderEmptyState,
  ...props
}: SelectContentProps<T>) {
  return (
    <AriaPopover data-slot="select-content" {...props}>
      {({ placement }) => (
        <PopoverSurface placement={placement} className={className}>
          <AriaListBox
            data-slot="select-listbox"
            items={items}
            renderEmptyState={renderEmptyState}
            className="flex max-h-80 flex-col gap-0.5 overflow-y-auto outline-none"
          >
            {children}
          </AriaListBox>
        </PopoverSurface>
      )}
    </AriaPopover>
  );
}

/**
 * The animated panel surface shared by `SelectContent` and `MenuContent`
 * (Figma: `Select Content (Popper)`). Render inside a React Aria `Popover`'s
 * render function, passing its resolved `placement` so the entrance moves
 * away from the trigger. Not exported from the package — it's the one place
 * the panel's look and motion are defined for every dropdown-style overlay.
 */
function PopoverSurface({
  placement,
  className,
  children,
}: {
  placement: string | null;
  className?: string;
  children: React.ReactNode;
}) {
  const { prefersReducedMotion } = useMotionPreference();
  const side = placement === "top" ? "top" : "bottom";

  return (
    <motion.div
      custom={side}
      variants={popoverVariants}
      initial={prefersReducedMotion ? { opacity: 0 } : "initial"}
      animate="animate"
      style={{ transformOrigin: side === "top" ? "bottom" : "top" }}
      className={cn(
        // `p-[7px]` = Figma's 8px padding minus the 1px border (Figma strokes inside the frame), so items sit 8px in and are 200px wide.
        "w-[216px] overflow-hidden rounded-select-content border border-border bg-background p-[7px] shadow-popover",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

/**
 * Per-size item geometry. Figma `Select Item` `Size`: xs · 32, sm · 36
 * (default), md · 40. xs/sm use the `sm -medium` text style (14/22), md
 * `base -medium` (16/24). Avatar is 20px at xs, 24px at sm/md.
 */
const selectItemVariants = cva(
  [
    "group flex w-full items-center gap-3 rounded-select-item px-3 py-2 font-medium text-foreground outline-none",
    // Figma `State`: Hover → `state/hover` (`bg-hover`); keyboard focus reads the same as hover.
    // Selected → `state/active` (`bg-item-active`) + a trailing `tone-brand` check; it wins over hover.
    "not-data-[selected]:data-[hovered]:bg-hover not-data-[selected]:data-[focused]:bg-hover",
    "data-[selected]:bg-item-active",
    "data-[focus-visible]:outline-2 data-[focus-visible]:-outline-offset-2 data-[focus-visible]:outline-ring",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "h-8 text-sm [&_[data-slot=avatar]]:size-5",
        sm: "h-9 text-sm [&_[data-slot=avatar]]:size-6",
        md: "h-10 text-base [&_[data-slot=avatar]]:size-6",
      },
    },
    defaultVariants: { size: "sm" },
  },
);

interface SelectItemProps
  extends Omit<AriaListBoxItemProps, "children" | "className">,
    VariantProps<typeof selectItemVariants> {
  /** The option's label (Figma's `value`). */
  children: React.ReactNode;
  /** Secondary text after the label (Figma's `supporting-text`, `foreground/subtle`), truncated when space runs out. */
  supportingText?: string;
  /** Leading 16px icon (Figma's `showIcon`, default `user-circle`). Pass an icon component (auto-sized/colored) or a pre-rendered element. */
  icon?: IconProp;
  /** Leading avatar (Figma's `showAvatar`) — any `Avatar` props; sized per item size (20px xs, 24px sm/md). */
  avatar?: Pick<AvatarProps, "src" | "alt" | "initials">;
  className?: string;
}

/** One option in a `SelectContent` panel — label, optional icon/avatar and supporting text, and a check when selected. Figma: `Select Item`. */
function SelectItem({
  size = "sm",
  children,
  supportingText,
  icon,
  avatar,
  className,
  textValue,
  ...props
}: SelectItemProps) {
  return (
    <AriaListBoxItem
      data-slot="select-item"
      data-size={size}
      textValue={textValue ?? (typeof children === "string" ? children : undefined)}
      className={cn(selectItemVariants({ size }), className)}
      {...props}
    >
      {({ isSelected }) => (
        <>
          {avatar && <Avatar {...avatar} className="shrink-0" />}
          {icon && renderIcon(icon)}
          <span className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden whitespace-nowrap">
            <span className="shrink-0">{children}</span>
            {supportingText && (
              <span className="min-w-0 flex-1 truncate font-normal text-foreground-subtle">
                {supportingText}
              </span>
            )}
          </span>
          {isSelected && <Check aria-hidden className="size-4 shrink-0 text-tone-brand" />}
        </>
      )}
    </AriaListBoxItem>
  );
}

/** A divider between groups of options. Figma: `Select Item` `State=Divider` — a 1px `border/neutral/border` rule centered in a 16px row. */
function SelectSeparator({ className, ...props }: Omit<AriaSeparatorProps, "className"> & { className?: string }) {
  return (
    <AriaSeparator
      data-slot="select-separator"
      className={cn("my-[7.5px] h-px w-full shrink-0 border-none bg-border", className)}
      {...props}
    />
  );
}

export {
  PopoverSurface,
  SelectContent,
  SelectItem,
  SelectSeparator,
  selectItemVariants,
  type SelectContentProps,
  type SelectItemProps,
};
