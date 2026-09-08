import type { Meta, StoryObj } from "@storybook/react-vite";
import { Check } from "@untitledui/icons";

import { Badge } from "./badge";

const meta: Meta<typeof Badge> = {
  title: "DataDisplay/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: { label: "Label" },
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge tone="neutral" label="Neutral" />
      <Badge tone="brand" label="Brand" />
      <Badge tone="destructive" label="Destructive" />
      <Badge tone="warning" label="Warning" />
      <Badge tone="success" label="Success" />
      <Badge tone="info" label="Info" />
      <Badge tone="gray-blue" label="Gray blue" />
      <Badge tone="blue-light" label="Blue light" />
      <Badge tone="indigo" label="Indigo" />
      <Badge tone="purple" label="Purple" />
      <Badge tone="pink" label="Pink" />
      <Badge tone="orange" label="Orange" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge size="sm" label="sm · 22" />
      <Badge size="md" label="md · 26" />
      <Badge size="lg" label="lg · 30" />
    </div>
  ),
};

export const WithDot: Story = {
  args: { tone: "success", label: "Online", dot: true },
};

export const WithLeadingIcon: Story = {
  args: { tone: "success", label: "Verified", icon: Check },
};

export const WithTrailingIcon: Story = {
  args: { tone: "brand", label: "Featured", rightIcon: Check },
};

export const IconOnly: Story = {
  args: { tone: "success", label: undefined, icon: Check },
};

export const Removable: Story = {
  args: { tone: "neutral", label: "Removable", onClose: () => {} },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <Badge tone="neutral" label="Neutral" />
        <Badge tone="brand" label="Brand" />
        <Badge tone="destructive" label="Destructive" />
        <Badge tone="warning" label="Warning" />
        <Badge tone="success" label="Success" />
        <Badge tone="info" label="Info" />
        <Badge tone="gray-blue" label="Gray blue" />
        <Badge tone="blue-light" label="Blue light" />
        <Badge tone="indigo" label="Indigo" />
        <Badge tone="purple" label="Purple" />
        <Badge tone="pink" label="Pink" />
        <Badge tone="orange" label="Orange" />
      </div>
      <div className="flex items-center gap-2">
        <Badge size="sm" label="sm · 22" />
        <Badge size="md" label="md · 26" />
        <Badge size="lg" label="lg · 30" />
      </div>
      <div className="flex items-center gap-2">
        <Badge tone="success" label="Online" dot />
        <Badge tone="success" label="Verified" icon={Check} />
        <Badge tone="brand" label="Featured" rightIcon={Check} />
        <Badge tone="success" icon={Check} />
        <Badge tone="neutral" label="Removable" onClose={() => {}} />
      </div>
    </div>
  ),
};
