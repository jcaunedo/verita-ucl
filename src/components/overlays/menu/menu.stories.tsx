import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowUpRight, DotsHorizontal, XCircle } from "@untitledui/icons";

import { FaceSlightlySmilingPlus } from "@/components/icons";
import { Button } from "@/components/buttons/button";
import { MenuContent, MenuItem, MenuSeparator, MenuTrigger } from "./menu";

const meta: Meta<typeof MenuItem> = {
  title: "Overlays/Menu",
  component: MenuItem,
  subcomponents: { MenuContent, MenuSeparator },
  tags: ["autodocs"],
  // Opens on mount, and an open popover locks page scroll — so on the Docs page each story gets its own iframe.
  parameters: { docs: { story: { inline: false, height: "260px" } } },
  decorators: [
    (Story) => (
      <div className="flex min-h-[260px] justify-end bg-white p-4 pr-48">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof MenuItem>;

/** An application row's actions (PRD §4.1): View Details, Refer, and a destructive Withdraw. No separator by default (DESIGN.md "Actions menus"). */
export const Default: Story = {
  args: { size: "sm" },
  // The labels and icons are fixed per item; `size` and `className` apply to every item.
  argTypes: { children: { control: false }, icon: { control: false }, tone: { control: false } },
  // On the Docs page this story renders inline and closed (open it from its trigger), so the Docs controls reach it; a
  // story in its own iframe doesn't receive Docs control changes.
  parameters: { docs: { story: { inline: true } } },
  render: ({ size, className }, { viewMode }) => (
    <MenuTrigger defaultOpen={viewMode !== "docs"}>
      <Button color="tertiary" size="xs" aria-label="More actions" iconLeading={DotsHorizontal} />
      <MenuContent placement="bottom end">
        <MenuItem size={size} className={className} icon={ArrowUpRight}>
          View Details
        </MenuItem>
        <MenuItem size={size} className={className} icon={FaceSlightlySmilingPlus}>
          Refer someone
        </MenuItem>
        <MenuItem size={size} className={className} icon={XCircle} tone="destructive">
          Withdraw
        </MenuItem>
      </MenuContent>
    </MenuTrigger>
  ),
};

/** `MenuSeparator` is available for when a design explicitly calls for a divider — not used by default (DESIGN.md "Actions menus"). */
export const WithSeparator: Story = {
  render: () => (
    <MenuTrigger defaultOpen>
      <Button color="tertiary" size="xs" aria-label="More actions" iconLeading={DotsHorizontal} />
      <MenuContent placement="bottom end">
        <MenuItem icon={ArrowUpRight}>View Details</MenuItem>
        <MenuItem icon={FaceSlightlySmilingPlus}>Refer someone</MenuItem>
        <MenuSeparator />
        <MenuItem icon={XCircle} tone="destructive">
          Withdraw
        </MenuItem>
      </MenuContent>
    </MenuTrigger>
  ),
};

/** Items without icons. */
export const TextOnly: Story = {
  render: () => (
    <MenuTrigger defaultOpen>
      <Button color="tertiary" size="xs" aria-label="More actions" iconLeading={DotsHorizontal} />
      <MenuContent placement="bottom end">
        <MenuItem>View Details</MenuItem>
        <MenuItem>Refer someone</MenuItem>
        <MenuItem tone="destructive">Withdraw</MenuItem>
      </MenuContent>
    </MenuTrigger>
  ),
};

/** Every item size (xs 32 / sm 36 / md 40), shared with `SelectItem`. */
export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      {(["xs", "sm", "md"] as const).map((size) => (
        <MenuTrigger key={size} defaultOpen={size === "sm"}>
          <Button color="secondary" size="xs">
            {`Open ${size}`}
          </Button>
          <MenuContent placement="bottom start">
            <MenuItem size={size} icon={ArrowUpRight}>View Details</MenuItem>
            <MenuItem size={size} icon={FaceSlightlySmilingPlus}>Refer someone</MenuItem>
            <MenuItem size={size} icon={XCircle} tone="destructive">
              Withdraw
            </MenuItem>
          </MenuContent>
        </MenuTrigger>
      ))}
    </div>
  ),
};
