import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronDown, Home01 } from "@untitledui/icons";

import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "Buttons/Button",
  component: Button,
  tags: ["autodocs"],
  // Button's two-signature type (button vs. link) hides its props from Storybook's type reader, so its description and controls are set here — keep in sync with `buttonVariants`.
  parameters: {
    docs: {
      description: {
        component:
          "The Verita button. Figma: `button` (Type=Text|Icon, Style×Tone→`color`, Size, State). Pass `href` to render it as a link with the same look.",
      },
    },
  },
  argTypes: {
    color: {
      control: "select",
      options: [
        "primary",
        "primary-destructive",
        "secondary",
        "secondary-destructive",
        "tertiary",
        "tertiary-destructive",
        "link-color",
      ],
      description: "Figma Style × Tone, e.g. Outlined + Destructive → `secondary-destructive`.",
      table: { type: { summary: "string" }, defaultValue: { summary: "primary" } },
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
      description: "Height: `xs` 32px, `sm` 36px, `md` 40px, `lg` 44px, `xl` 48px.",
      table: { type: { summary: "string" }, defaultValue: { summary: "sm" } },
    },
    isLoading: {
      control: "boolean",
      description: "Shows a loading spinner and disables the button.",
      table: { type: { summary: "boolean" } },
    },
    isDisabled: {
      control: "boolean",
      description: "Disables the button and shows its disabled style.",
      table: { type: { summary: "boolean" } },
    },
    noTextPadding: {
      control: "boolean",
      description: "Zeroes the button's own padding. Always on for `link-color`.",
      table: { type: { summary: "boolean" } },
    },
    count: { control: "text", description: "Counter after the label. Omit to hide it.", table: { type: { summary: "ReactNode" } } },
    iconLeading: {
      control: false,
      description:
        "Icon before the label. Pass an icon component (e.g. `HomeLine`, sized and colored automatically) or a pre-rendered element.",
      table: { type: { summary: "FC | ReactNode" } },
    },
    iconTrailing: {
      control: false,
      description: "Icon after the label. Same shape as `iconLeading`.",
      table: { type: { summary: "FC | ReactNode" } },
    },
    href: {
      control: false,
      description: "Renders the button as a link (React Aria `Link`) with the same look.",
      table: { type: { summary: "string" } },
    },
    children: { control: "text", description: "The label. Omit it for an icon-only button, and pass `aria-label` instead." },
  },
  args: {
    children: "Label",
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { color: "primary" } };
export const PrimaryDestructive: Story = {
  args: { color: "primary-destructive" },
};
export const Secondary: Story = { args: { color: "secondary" } };
export const SecondaryDestructive: Story = {
  args: { color: "secondary-destructive" },
};
export const Tertiary: Story = { args: { color: "tertiary" } };
export const TertiaryDestructive: Story = {
  args: { color: "tertiary-destructive" },
};
export const LinkColor: Story = { args: { color: "link-color" } };

export const Disabled: Story = {
  args: { color: "primary", isDisabled: true },
};

export const Loading: Story = {
  args: { color: "primary", isLoading: true },
};

export const WithIcons: Story = {
  args: {
    color: "primary",
    iconLeading: Home01,
    iconTrailing: ChevronDown,
  },
};

export const IconOnly: Story = {
  args: { color: "primary", children: undefined, iconLeading: Home01 },
};

export const TertiaryIconOnly: Story = {
  args: {
    color: "tertiary",
    children: undefined,
    iconLeading: Home01,
    "aria-label": "Home",
  },
};

export const AsLink: Story = {
  args: { color: "primary", href: "#" },
};

/** Figma `showCounter`: a counter pill after the label, e.g. how many items the action applies to. */
export const WithCounter: Story = {
  args: { color: "secondary", size: "xs", count: 3, children: "Send invites" },
};

export const NoTextPadding: Story = {
  args: { color: "tertiary", noTextPadding: true },
};

export const AllVariants: Story = {
  render: () => {
    const colors = [
      "primary",
      "primary-destructive",
      "secondary",
      "secondary-destructive",
      "tertiary",
      "tertiary-destructive",
      "link-color",
    ] as const;
    const sizes = ["xs", "sm", "md", "lg", "xl"] as const;

    return (
      <div className="flex flex-col gap-6 bg-white p-6">
        {colors.map((color) => (
          <div key={color} className="flex flex-col gap-2">
            <p className="text-xs text-muted-foreground">{color}</p>
            <div className="flex flex-wrap items-center gap-3">
              {sizes.map((size) => (
                <Button key={size} color={color} size={size}>
                  Label
                </Button>
              ))}
              <Button color={color} isDisabled>
                Disabled
              </Button>
              <Button color={color} isLoading>
                Loading
              </Button>
            </div>
          </div>
        ))}
        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground">with counter</p>
          {(["primary", "secondary"] as const).map((color) => (
            <div key={color} className="flex flex-wrap items-center gap-3">
              {sizes.map((size) => (
                <Button key={size} color={color} size={size} count={3}>
                  Label
                </Button>
              ))}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground">tertiary (icon only)</p>
          <div className="flex flex-wrap items-center gap-3">
            {sizes.map((size) => (
              <Button
                key={size}
                color="tertiary"
                size={size}
                iconLeading={Home01}
                aria-label="Home"
              />
            ))}
          </div>
        </div>
      </div>
    );
  },
};
