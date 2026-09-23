import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronDown, UserCircle } from "@untitledui/icons";
import { ListBox, Select, SelectValue, type Key } from "react-aria-components";

import { Button } from "@/components/buttons/button";
import { SelectContent, SelectItem, SelectSeparator, type SelectItemProps } from "./select";

/**
 * Figma has no Select trigger/field design yet, so these stories open the
 * panel from a plain `Button` + React Aria `SelectValue` — a stand-in to
 * exercise `SelectContent`/`SelectItem`, not a proposed trigger design.
 */
function StoryTrigger() {
  return (
    <Button color="secondary" iconTrailing={ChevronDown}>
      <SelectValue />
    </Button>
  );
}

const OPTIONS = ["Product design", "Engineering", "Data science", "Finance", "Operations", "Marketing"];

function DemoSelect({
  size,
  defaultSelectedKey = "Engineering",
  itemProps,
  withSeparator = false,
}: {
  size?: SelectItemProps["size"];
  defaultSelectedKey?: Key;
  itemProps?: (option: string, index: number) => Partial<SelectItemProps>;
  withSeparator?: boolean;
}) {
  return (
    <Select aria-label="Discipline" defaultOpen defaultSelectedKey={defaultSelectedKey}>
      <StoryTrigger />
      <SelectContent>
        {OPTIONS.flatMap((option, index) => [
          ...(withSeparator && index === 3 ? [<SelectSeparator key="separator" />] : []),
          <SelectItem key={option} id={option} size={size} {...itemProps?.(option, index)}>
            {option}
          </SelectItem>,
        ])}
      </SelectContent>
    </Select>
  );
}

const meta: Meta<typeof SelectItem> = {
  title: "Forms/Select",
  component: SelectItem,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="min-h-[340px] bg-white p-4">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof SelectItem>;

/** Figma `Select Content (Popper)` with default `sm · 36` items; hover an option for `State=Hover`, the checked one is `State=Selected`. */
export const Default: Story = {
  render: () => <DemoSelect />,
};

export const SizeXs: Story = {
  render: () => <DemoSelect size="xs" />,
};

export const SizeMd: Story = {
  render: () => <DemoSelect size="md" />,
};

export const WithSupportingText: Story = {
  render: () => <DemoSelect itemProps={(_, i) => ({ supportingText: `${(i + 2) * 12} open roles` })} />,
};

export const WithIcon: Story = {
  render: () => <DemoSelect itemProps={() => ({ icon: UserCircle })} />,
};

export const WithAvatar: Story = {
  render: () => (
    <DemoSelect itemProps={(option) => ({ avatar: { initials: option.slice(0, 2).toUpperCase() } })} />
  ),
};

/** Figma `State=Divider` between two groups of options. */
export const WithSeparator: Story = {
  render: () => <DemoSelect withSeparator />,
};

/**
 * Every size × state at once, as static panels (a plain `ListBox` instead of
 * an open popover, so three panels can sit side by side). The second item in
 * each is selected; hover any item to see `State=Hover`.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex items-start gap-6">
      {(["xs", "sm", "md"] as const).map((size) => (
        <div
          key={size}
          className="w-[216px] rounded-select-content border border-border bg-background p-[7px] shadow-popover"
        >
          <ListBox
            aria-label={`Size ${size}`}
            selectionMode="single"
            defaultSelectedKeys={["b"]}
            className="flex flex-col gap-0.5 outline-none"
          >
            <SelectItem id="a" size={size}>Menu Item</SelectItem>
            <SelectItem id="b" size={size}>Menu Item</SelectItem>
            <SelectItem id="c" size={size} supportingText="supporting-text">Menu Item</SelectItem>
            <SelectSeparator />
            <SelectItem id="d" size={size} icon={UserCircle}>Menu Item</SelectItem>
            <SelectItem id="e" size={size} avatar={{ initials: "TS" }}>Menu Item</SelectItem>
          </ListBox>
        </div>
      ))}
    </div>
  ),
};
