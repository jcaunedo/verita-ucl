import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronDown, UserCircle } from "@untitledui/icons";
import { Label, ListBox, Select, SelectValue, type Key } from "react-aria-components";

import { Button } from "@/components/buttons/button";
import { SelectContent, SelectItem, SelectSeparator, SelectTrigger, type SelectItemProps } from "./select";
import { fieldTextVariants } from "@/components/forms/field";

/**
 * The panel stories open from a plain `Button` + React Aria `SelectValue`, to show the panel on its own. For the field
 * trigger (Figma `Input` `Type=Dropdown`), see the `Trigger` stories below.
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
  defaultOpen = true,
}: {
  size?: SelectItemProps["size"];
  defaultSelectedKey?: Key;
  itemProps?: (option: string, index: number) => Partial<SelectItemProps>;
  withSeparator?: boolean;
  defaultOpen?: boolean;
}) {
  return (
    <Select aria-label="Discipline" defaultOpen={defaultOpen} defaultSelectedKey={defaultSelectedKey}>
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
  subcomponents: { SelectTrigger, SelectContent, SelectSeparator },
  tags: ["autodocs"],
  // Opens on mount, and an open popover locks page scroll — so on the Docs page each story gets its own iframe.
  parameters: { docs: { story: { inline: false, height: "340px" } } },
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
  args: { size: "sm" },
  // The option labels are fixed; `size`, `supportingText`, and `className` apply to every option.
  argTypes: { children: { control: false }, icon: { control: false }, avatar: { control: false } },
  // On the Docs page this story renders inline and closed (open it from its trigger), so the Docs controls reach it; a
  // story in its own iframe doesn't receive Docs control changes.
  parameters: { docs: { story: { inline: true } } },
  render: ({ size, supportingText, className }, { viewMode }) => (
    <DemoSelect size={size} itemProps={() => ({ supportingText, className })} defaultOpen={viewMode !== "docs"} />
  ),
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

/** A labeled field select: React Aria `Select` + `Label` + `SelectTrigger` + `SelectContent` matched to its width. */
function FieldSelect({
  label,
  size,
  isDisabled,
  isInvalid,
  defaultSelectedKey,
  withIcon,
}: {
  label: string;
  size?: "sm" | "md";
  isDisabled?: boolean;
  isInvalid?: boolean;
  defaultSelectedKey?: Key;
  withIcon?: boolean;
}) {
  return (
    <Select
      placeholder="Value"
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      defaultSelectedKey={defaultSelectedKey}
      className="flex w-[280px] flex-col gap-1.5"
    >
      <Label className={fieldTextVariants({ slot: "label" })}>{label}</Label>
      <SelectTrigger size={size} isInvalid={isInvalid} iconLeading={withIcon ? UserCircle : undefined} />
      <SelectContent className="w-(--trigger-width)">
        {OPTIONS.map((option) => (
          <SelectItem key={option} id={option} size={size}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/**
 * Figma `Input` `Type=Dropdown`: the field that opens the panel. Hover for `Hover`; open it for `Focused`. The value
 * is the `Select`'s `placeholder` until an option is picked.
 */
export const Trigger: Story = {
  render: () => <FieldSelect label="Label" />,
};

/** Every trigger state at both sizes: Default, HasValue, with icon, Error, Disabled. */
export const TriggerAllVariants: Story = {
  render: () => (
    <div className="flex gap-6">
      {(["sm", "md"] as const).map((size) => (
        <div key={size} className="flex flex-col gap-6">
          <FieldSelect label={`Default · ${size}`} size={size} />
          <FieldSelect label="HasValue" size={size} defaultSelectedKey="Engineering" />
          <FieldSelect label="With icon" size={size} defaultSelectedKey="Engineering" withIcon />
          <FieldSelect label="Error" size={size} defaultSelectedKey="Engineering" isInvalid />
          <FieldSelect label="Disabled" size={size} defaultSelectedKey="Engineering" isDisabled />
        </div>
      ))}
    </div>
  ),
};
