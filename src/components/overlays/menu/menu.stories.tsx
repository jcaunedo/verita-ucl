import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlignLeft, DotsHorizontal, Share06, XCircle } from "@untitledui/icons";

import { Button } from "@/components/buttons/button";
import { MenuContent, MenuItem, MenuSeparator, MenuTrigger } from "./menu";

const meta: Meta<typeof MenuItem> = {
  title: "Overlays/Menu",
  component: MenuItem,
  tags: ["autodocs"],
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

/** An application row's actions (PRD §4.1): View Details, Share, and a destructive Withdraw after a separator. */
export const Default: Story = {
  render: () => (
    <MenuTrigger defaultOpen>
      <Button color="tertiary" size="xs" aria-label="More actions" iconLeading={DotsHorizontal} />
      <MenuContent placement="bottom end">
        <MenuItem icon={AlignLeft}>View Details</MenuItem>
        <MenuItem icon={Share06}>Share</MenuItem>
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
        <MenuItem>Share</MenuItem>
        <MenuSeparator />
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
            <MenuItem size={size} icon={AlignLeft}>View Details</MenuItem>
            <MenuItem size={size} icon={Share06}>Share</MenuItem>
            <MenuSeparator />
            <MenuItem size={size} icon={XCircle} tone="destructive">
              Withdraw
            </MenuItem>
          </MenuContent>
        </MenuTrigger>
      ))}
    </div>
  ),
};
