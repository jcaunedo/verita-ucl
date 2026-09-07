import type { Meta, StoryObj } from "@storybook/react-vite";
import { Logo } from "./logo";

const meta: Meta<typeof Logo> = {
  title: "Branding/Logo",
  component: Logo,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Logo>;

export const Default: Story = {};

export const Inverse: Story = {
  args: { variant: "inverse" },
  decorators: [
    (Story) => (
      <div className="bg-rosewood-800 p-6">
        <Story />
      </div>
    ),
  ],
};

export const Mark: Story = {
  args: { mark: true },
};

export const MarkInverse: Story = {
  args: { mark: true, variant: "inverse" },
  decorators: [
    (Story) => (
      <div className="bg-rosewood-800 p-6">
        <Story />
      </div>
    ),
  ],
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4 bg-white p-6">
        <Logo />
        <Logo mark />
      </div>
      <div className="flex items-center gap-4 bg-rosewood-800 p-6">
        <Logo variant="inverse" />
        <Logo mark variant="inverse" />
      </div>
    </div>
  ),
};
