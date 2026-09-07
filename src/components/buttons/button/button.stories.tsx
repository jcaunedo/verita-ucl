import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronDown, Home01 } from "@untitledui/icons";

import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "Buttons/Button",
  component: Button,
  tags: ["autodocs"],
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

export const AsLink: Story = {
  args: { color: "primary", href: "#" },
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
      </div>
    );
  },
};
