import type { Meta, StoryObj } from "@storybook/react-vite";
import { LogOut01, ReverseLeft, Settings02, Translate01, UserCircle } from "@untitledui/icons";

import { AccountTrigger } from "@/components/buttons/account-trigger";
import { AccountMenu, AccountMenuItem } from "./account-menu";

const USER = {
  name: "Theresa Smith",
  email: "theresa@email.com",
  avatar: { initials: "TS", className: "bg-success" },
};

const meta: Meta<typeof AccountMenu> = {
  title: "Overlays/AccountMenu",
  component: AccountMenu,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      // Room above the trigger for the menu, which opens upward from the sidebar footer.
      <div className="flex min-h-[600px] w-[280px] items-end bg-white p-6">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof AccountMenu>;

/** The Figma menu: My Profile, Language (with the current value), Settings, Sign out, and the footer links. */
export const Default: Story = {
  render: () => (
    <AccountMenu
      defaultOpen
      trigger={<AccountTrigger {...USER} />}
      {...USER}
      termsHref="#"
      privacyHref="#"
    >
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
    </AccountMenu>
  ),
};

/** Closed until the trigger is pressed. */
export const Closed: Story = {
  render: () => (
    <AccountMenu trigger={<AccountTrigger {...USER} />} {...USER} termsHref="#" privacyHref="#">
      <AccountMenuItem id="profile" icon={UserCircle}>
        My Profile
      </AccountMenuItem>
      <AccountMenuItem id="sign-out" icon={LogOut01}>
        Sign out
      </AccountMenuItem>
    </AccountMenu>
  ),
};

/** Opened from the collapsed sidebar's avatar-only trigger. */
export const CollapsedTrigger: Story = {
  render: () => (
    <AccountMenu defaultOpen trigger={<AccountTrigger {...USER} collapsed />} {...USER} termsHref="#" privacyHref="#">
      <AccountMenuItem id="profile" icon={UserCircle}>
        My Profile
      </AccountMenuItem>
      <AccountMenuItem id="sign-out" icon={LogOut01}>
        Sign out
      </AccountMenuItem>
    </AccountMenu>
  ),
};

/** No `termsHref`/`privacyHref`: the footer is omitted. */
export const WithoutFooter: Story = {
  render: () => (
    <AccountMenu defaultOpen trigger={<AccountTrigger {...USER} />} {...USER}>
      <AccountMenuItem id="profile" icon={UserCircle}>
        My Profile
      </AccountMenuItem>
      <AccountMenuItem id="sign-out" icon={LogOut01}>
        Sign out
      </AccountMenuItem>
    </AccountMenu>
  ),
};

/** Every item shape: icon + label, icon + label + suffix, label only. The prototype adds "Restart prototype" last. */
export const AllVariants: Story = {
  render: () => (
    <AccountMenu
      defaultOpen
      trigger={<AccountTrigger {...USER} />}
      {...USER}
      termsHref="#"
      privacyHref="#"
    >
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
      <AccountMenuItem id="restart" icon={ReverseLeft}>
        Restart prototype
      </AccountMenuItem>
      <AccountMenuItem id="no-icon">Label only</AccountMenuItem>
    </AccountMenu>
  ),
};
