import * as React from "react";
import {
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  MenuSection as AriaMenuSection,
  MenuTrigger as AriaMenuTrigger,
  Popover as AriaPopover,
  type Key,
  type MenuItemProps as AriaMenuItemProps,
  type MenuTriggerProps as AriaMenuTriggerProps,
  type PopoverProps as AriaPopoverProps,
} from "react-aria-components";

import { cn } from "@/lib/utils";
import { accountMenuVariants } from "@/lib/motion";
import { Avatar, type AvatarProps } from "@/components/data-display/avatar";
import { PopoverSurface } from "@/components/forms/select";
import { Typography } from "@/components/typography";

/**
 * Figma `Select Content Account Menu (Popper)` — the menu that opens from the
 * sidebar's `AccountTrigger`: a centered profile header (56px avatar, name,
 * email), the account actions (`AccountMenuItem`), and a Terms / Privacy
 * footer. Built like `MenuContent` (React Aria `MenuTrigger` + `Popover` +
 * `Menu`, inside the shared `PopoverSurface` for the same surface as every
 * dropdown, but with its own `accountMenuVariants` entrance: a fade plus a
 * 12px slide up out of the trigger), with the account geometry layered on
 * via `className`: 280px wide, `radius/popover` (16px), `card` fill, 16px sides
 * and bottom, 24px top, 12px between the three blocks.
 *
 * The footer links are `Menu` items with `href` (in a labeled section), not
 * plain links beside the menu: React Aria closes a menu on Tab, so links
 * outside the `Menu` would be unreachable from the keyboard. Arrow keys reach
 * them after the last action.
 */

interface AccountMenuProps
  extends Omit<AriaPopoverProps, "children" | "className" | "triggerRef" | "trigger" | "isOpen" | "onOpenChange">,
    Pick<AriaMenuTriggerProps, "isOpen" | "defaultOpen" | "onOpenChange"> {
  /** The pressable that opens the menu — usually `AccountTrigger`. Must be a React Aria `Button` (or forward its press/ref). */
  trigger: React.ReactElement;
  /** User's display name, shown under the avatar. */
  name: string;
  /** User's email or secondary line. */
  email: string;
  /** Same shape as `Avatar`'s props (`src`/`initials`/background `className`). Rendered at `xl` (56px), no status dot, per Figma. */
  avatar: Omit<AvatarProps, "size" | "showStatusDot">;
  /** The actions, as `AccountMenuItem`s. */
  children: React.ReactNode;
  /** Called with the pressed item's `id`, for items without their own `onAction`. */
  onAction?: (key: Key) => void;
  /** Footer "Terms of use" destination. The link is omitted when unset. */
  termsHref?: string;
  /** Footer "Privacy policy" destination. The link is omitted when unset. */
  privacyHref?: string;
  /** Classes for the panel surface. */
  className?: string;
}

/**
 * Opens over its trigger: left edges aligned (`top start`), and the panel's
 * bottom edge on the avatar's bottom edge. `AccountTrigger` is 40px tall
 * with its 36px avatar centered, so the avatar ends 2px above the trigger's
 * bottom — a -38px offset pulls the panel from "above the trigger" down to
 * there.
 */
const ACCOUNT_TRIGGER_OFFSET = -38;

/**
 * Whether a pointer button is held right now, tracked at the document level.
 * React Aria opens a menu on mouse *press-down* and treats a release over an
 * item as choosing it (press–drag–release, like native menus). Because this
 * menu opens over its own trigger, an ordinary click's release lands on an
 * item — the menu flashed open and closed at once, or ran that item's action.
 */
function usePointerHeldRef() {
  const heldRef = React.useRef(false);
  React.useEffect(() => {
    const down = () => (heldRef.current = true);
    const up = () => (heldRef.current = false);
    document.addEventListener("pointerdown", down, true);
    document.addEventListener("pointerup", up, true);
    document.addEventListener("pointercancel", up, true);
    return () => {
      document.removeEventListener("pointerdown", down, true);
      document.removeEventListener("pointerup", up, true);
      document.removeEventListener("pointercancel", up, true);
    };
  }, []);
  return heldRef;
}

/**
 * The panel ignores the pointer until the press that opened it is released,
 * so that release falls through instead of choosing an item. Opened by
 * keyboard or touch (no button held), it's interactive immediately.
 */
function useArmedAfterOpeningPress(pointerHeldRef: React.RefObject<boolean>) {
  const [armed, setArmed] = React.useState(() => !pointerHeldRef.current);
  React.useEffect(() => {
    if (armed) return;
    const arm = () => setArmed(true);
    document.addEventListener("pointerup", arm, { once: true, capture: true });
    document.addEventListener("pointercancel", arm, { once: true, capture: true });
    return () => {
      document.removeEventListener("pointerup", arm, true);
      document.removeEventListener("pointercancel", arm, true);
    };
  }, [armed]);
  return armed;
}

/** The popover panel's contents, mounted each time the menu opens so the "armed" state starts fresh. */
function AccountMenuSurface({
  placement,
  pointerHeldRef,
  className,
  children,
}: {
  placement: string | null;
  pointerHeldRef: React.RefObject<boolean>;
  className?: string;
  children: React.ReactNode;
}) {
  const armed = useArmedAfterOpeningPress(pointerHeldRef);
  return (
    <PopoverSurface
      placement={placement}
      variants={accountMenuVariants}
      className={cn(
        "flex w-[280px] flex-col items-center gap-3 rounded-popover bg-card p-4 pt-6",
        !armed && "pointer-events-none",
        className,
      )}
    >
      {children}
    </PopoverSurface>
  );
}

/** The sidebar account menu: profile header, account actions, and Terms / Privacy links. Figma: `Select Content Account Menu (Popper)`. */
function AccountMenu({
  trigger,
  name,
  email,
  avatar,
  children,
  onAction,
  termsHref,
  privacyHref,
  placement = "top start",
  offset = ACCOUNT_TRIGGER_OFFSET,
  isOpen,
  defaultOpen,
  onOpenChange,
  className,
  ...props
}: AccountMenuProps) {
  const pointerHeldRef = usePointerHeldRef();
  const legalLinks = [
    termsHref && { id: "terms", label: "Terms of use", href: termsHref },
    privacyHref && { id: "privacy", label: "Privacy policy", href: privacyHref },
  ].filter(Boolean) as { id: string; label: string; href: string }[];

  return (
    <AriaMenuTrigger isOpen={isOpen} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger}
      <AriaPopover data-slot="account-menu" placement={placement} offset={offset} {...props}>
        {({ placement: resolvedPlacement }) => (
          <AccountMenuSurface placement={resolvedPlacement} pointerHeldRef={pointerHeldRef} className={className}>
            <div data-slot="account-menu-header" className="flex flex-col items-center gap-2 text-center">
              <Avatar {...avatar} size="xl" showStatusDot={false} />
              <div className="flex flex-col items-center">
                <Typography size="lg" weight="semibold">
                  {name}
                </Typography>
                <Typography size="xs" className="text-foreground-muted">
                  {email}
                </Typography>
              </div>
            </div>

            <AriaMenu
              data-slot="account-menu-list"
              aria-label={`Account menu for ${name}`}
              onAction={onAction}
              className="flex w-full flex-col items-center gap-3 outline-none"
            >
              <AriaMenuSection aria-label="Account" className="flex w-full flex-col">
                {children}
              </AriaMenuSection>
              {legalLinks.length > 0 && (
                <AriaMenuSection aria-label="Legal" className="flex items-center justify-center">
                  {legalLinks.map(({ id, label, href }) => (
                    <AriaMenuItem
                      key={id}
                      id={id}
                      href={href}
                      className={cn(
                        "text-xs text-foreground-muted outline-none",
                        "data-[hovered]:underline data-[focused]:underline",
                        "data-[focus-visible]:rounded-xs data-[focus-visible]:outline-2 data-[focus-visible]:outline-ring",
                        // Figma separates the two links with "  ·  "; the dot sits outside the link's own text and underline.
                        "not-first:before:inline-block not-first:before:px-2 not-first:before:content-['·']",
                      )}
                    >
                      {label}
                    </AriaMenuItem>
                  ))}
                </AriaMenuSection>
              )}
            </AriaMenu>
          </AccountMenuSurface>
        )}
      </AriaPopover>
    </AriaMenuTrigger>
  );
}

/** Same icon-prop contract as `MenuItem`/`Button`: a component (auto-sized to 18px, inherits the item color) or a pre-rendered element. */
type IconProp = React.FC<{ className?: string }> | React.ReactNode;

interface AccountMenuItemProps extends Omit<AriaMenuItemProps, "children" | "className"> {
  /** The action's label. */
  children: React.ReactNode;
  /** Leading 18px icon (Figma: `showIcon`). */
  icon?: IconProp;
  /** Trailing muted value, e.g. the current language "English". Omit to hide it (Figma: `showSuffix`, off by default). */
  suffix?: React.ReactNode;
  className?: string;
}

/**
 * One action in an `AccountMenu`. Figma `Select Item Account Menu`
 * (Property 1: Default / Hover): 8px padding, 12px icon–label gap, 12px
 * radius, `sm` regular label, 18px icon, optional `xs` `foreground/subtle`
 * suffix, hidden unless passed (Figma: `showSuffix`, off by default). Hover →
 * `state/hover` (`bg-hover`); keyboard focus reads the same.
 */
function AccountMenuItem({ children, icon, suffix, className, textValue, ...props }: AccountMenuItemProps) {
  const Icon = typeof icon === "function" ? (icon as React.FC<{ className?: string }>) : null;

  return (
    <AriaMenuItem
      data-slot="account-menu-item"
      textValue={textValue ?? (typeof children === "string" ? children : undefined)}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl p-2 text-sm text-foreground outline-none",
        "data-[hovered]:bg-hover data-[focused]:bg-hover",
        "data-[focus-visible]:outline-2 data-[focus-visible]:-outline-offset-2 data-[focus-visible]:outline-ring",
        className,
      )}
      {...props}
    >
      {Icon ? <Icon className="size-4.5 shrink-0" /> : (icon as React.ReactNode)}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {suffix && (
        <span data-slot="account-menu-item-suffix" className="shrink-0 text-xs text-foreground-subtle">
          {suffix}
        </span>
      )}
    </AriaMenuItem>
  );
}

export { AccountMenu, AccountMenuItem, type AccountMenuProps, type AccountMenuItemProps };
