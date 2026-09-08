import * as React from "react";
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from "react-aria-components";
import { ChevronSelectorVertical } from "@untitledui/icons";

import { cn } from "@/lib/utils";
import { Avatar, type AvatarProps } from "@/components/data-display/avatar";

/**
 * Figma `Account Menu` COMPONENT_SET (Property1: Expanded, Expanded Hover,
 * Collapsed, Collapsed Hover) — the sidebar footer's account trigger.
 * Named `AccountTrigger` in code (not `AccountMenu`) — that name is
 * reserved for the future component wrapping the actual dropdown menu that
 * opens on press. Trigger only for now: Figma doesn't yet show what opens on
 * press (no menu/popover contents defined), so this renders the button
 * exactly as designed and exposes `onPress` — a future `AccountMenu`
 * (`MenuTrigger`/`Popover`) can wrap it without changing this component.
 *
 * Hover fill uses the shared `--hover` token (Figma: `color/hover`, 4%
 * neutral-700) — same token `Button`'s `secondary` hover uses — expressed as
 * an OUTSIDE-aligned `outline` (8px expanded, 4px collapsed in Figma),
 * matching `SidebarMenuItem`'s identical auto-layout-stroke-as-padding
 * pattern — an outline doesn't consume layout space, unlike a `border`
 * would. (Figma's Hover fill was originally a solid `neutral-700`; the
 * design was updated to the subtle `color/hover` overlay, re-synced here.)
 *
 * The avatar's fill color and the name label's `text-neutral-800` (not the
 * semantic `--foreground`, which is `neutral-700` — Figma binds this label
 * specifically to `neutral-800`) are per-instance Figma sample data, not
 * tokens — both come through as props here.
 *
 * The status dot (Figma's `Dot`) was removed from this component's Figma
 * source — `showStatusDot` is forced off on the embedded `Avatar` regardless
 * of what's passed in `avatar`, since `Avatar` itself still supports the dot
 * for other consumers.
 */
interface AccountTriggerProps
  extends Omit<AriaButtonProps, "children" | "className"> {
  /** User's display name. Hidden when `collapsed`. */
  name: string;
  /** User's email or secondary line. Hidden when `collapsed`. */
  email: string;
  /** Same shape as `Avatar`'s props (`src`/`initials`/etc.), minus `size`/`showStatusDot` — this component fixes the avatar at 36px with no status dot, per Figma. */
  avatar: Omit<AvatarProps, "size" | "className" | "showStatusDot"> & {
    className?: string;
  };
  /** Collapsed sidebar state — renders the avatar only (Figma's `Collapsed`/`Collapsed Hover`). */
  collapsed?: boolean;
  className?: string;
}

/** The sidebar footer's account trigger — avatar + name/email + chevron, collapsing to avatar-only. Figma: `Account Menu`. */
function AccountTrigger({
  name,
  email,
  avatar,
  collapsed = false,
  className,
  ...props
}: AccountTriggerProps) {
  return (
    <AriaButton
      data-slot="account-trigger"
      data-collapsed={collapsed ? true : undefined}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full outline-8 outline-transparent transition duration-100 ease-linear",
        "data-[hovered]:outline-hover data-[hovered]:bg-hover",
        "data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring data-[focus-visible]:ring-offset-2",
        collapsed ? "h-10 w-9 outline-4" : "w-full",
        className,
      )}
      {...props}
    >
      <Avatar
        {...avatar}
        size="md"
        showStatusDot={false}
        className={cn("shrink-0", avatar.className)}
      />
      {!collapsed && (
        <>
          <span className="flex min-w-px flex-1 flex-col items-start justify-center overflow-hidden text-left">
            <span className="w-full truncate text-left text-sm font-medium text-neutral-800">
              {name}
            </span>
            <span className="w-full truncate text-left text-xs text-muted-foreground">
              {email}
            </span>
          </span>
          <ChevronSelectorVertical data-icon className="size-4 shrink-0 text-muted-foreground" />
        </>
      )}
    </AriaButton>
  );
}

export { AccountTrigger, type AccountTriggerProps };
