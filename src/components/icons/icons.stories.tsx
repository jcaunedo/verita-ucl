import type { Meta, StoryObj } from "@storybook/react-vite";

import { FaceSlightlySmilingPlus } from "./icons";

const meta: Meta<typeof FaceSlightlySmilingPlus> = {
  title: "Icons/Product icons",
  component: FaceSlightlySmilingPlus,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof FaceSlightlySmilingPlus>;

/** `face-slightly-smiling-plus`: "Refer someone". */
export const FaceSlightlySmilingPlusIcon: Story = {};

/** Every product icon at 16, 20, and 24px, in the default text color and muted. */
export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-4 text-foreground">
      <FaceSlightlySmilingPlus className="size-4" />
      <FaceSlightlySmilingPlus className="size-5" />
      <FaceSlightlySmilingPlus className="size-6" />
      <FaceSlightlySmilingPlus className="size-6 text-foreground-muted" />
    </div>
  ),
};
