import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchField } from "./search-field";

const meta: Meta<typeof SearchField> = {
  title: "Forms/SearchField",
  component: SearchField,
  tags: ["autodocs"],
  args: {
    "aria-label": "Search applications",
  },
  decorators: [
    (Story) => (
      <div className="flex h-24 items-start bg-white p-4">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof SearchField>;

/** Figma `Default`: the collapsed 44px search button. Press it to expand; click outside while empty to collapse. */
export const Default: Story = {};

/** Figma `Dirty`: opens already expanded because it has a query, with the clear icon on the right. */
export const WithValue: Story = {
  args: { defaultValue: "abc" },
};

/** `collapsible={false}`: always an input, 240px wide by default. Focus it to see Figma's `Focus` border. */
export const AlwaysExpanded: Story = {
  args: { collapsible: false },
};

/** With a placeholder (Figma shows none, so it's opt-in). */
export const WithPlaceholder: Story = {
  args: { collapsible: false, placeholder: "Search by title or partner" },
};

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-4">
      <SearchField {...args} />
      <SearchField {...args} collapsible={false} />
      <SearchField {...args} defaultValue="abc" />
    </div>
  ),
  decorators: [
    (Story) => (
      <div className="bg-white p-4">
        <Story />
      </div>
    ),
  ],
};
