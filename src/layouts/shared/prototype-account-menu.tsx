import { LogOut01, ReverseLeft, Settings02, Translate01, UserCircle } from "@untitledui/icons";

import type { SidebarProps } from "@/components/navigation/sidebar";
import { AccountMenuItem } from "@/components/overlays/account-menu";
import { restartPrototype } from "@/layouts/shared/demo-state";

/**
 * The sidebar account menu every layout passes to `Sidebar`: Figma's items
 * plus "Restart prototype" (Figma: `reverse-left`), which clears every demo
 * interaction and returns to the starting Dashboard — e.g. to bring back a
 * declined offer before the next demo.
 * Prototype-only, so it lives here rather than in `Sidebar`'s defaults.
 */
const prototypeAccountMenu: NonNullable<SidebarProps["accountMenu"]> = {
  children: (
    <>
      <AccountMenuItem id="profile" icon={UserCircle}>
        My Profile
      </AccountMenuItem>
      <AccountMenuItem id="language" icon={Translate01} suffix="English">
        Language
      </AccountMenuItem>
      <AccountMenuItem id="settings" icon={Settings02}>
        Settings
      </AccountMenuItem>
      <AccountMenuItem id="sign-out" icon={LogOut01}>
        Sign out
      </AccountMenuItem>
      <AccountMenuItem id="restart-prototype" icon={ReverseLeft} onAction={restartPrototype}>
        Restart prototype
      </AccountMenuItem>
    </>
  ),
  termsHref: "#",
  privacyHref: "#",
};

export { prototypeAccountMenu };
