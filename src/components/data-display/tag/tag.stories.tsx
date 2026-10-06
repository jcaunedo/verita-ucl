import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tag, TagGroup, TagList } from "./tag";

const avatar = (seed: string) => `https://i.pravatar.cc/64?u=${seed}`;

const meta: Meta<typeof Tag> = {
  title: "DataDisplay/Tag",
  component: Tag,
  subcomponents: { TagGroup, TagList },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="bg-white p-6">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof Tag>;

/** Figma `Tag`, label only (`showAvatar` and `showXClose` off). */
export const Default: Story = {
  args: { children: "Label" },
  render: (args) => (
    <TagGroup aria-label="Tags">
      <TagList>
        <Tag id="label" {...args} />
      </TagList>
    </TagGroup>
  ),
};

/** Figma `showAvatar`: a 16px photo before the label. */
export const WithAvatar: Story = {
  render: () => (
    <TagGroup aria-label="People">
      <TagList>
        <Tag id="olivia" avatarSrc={avatar("olivia")}>
          Olivia Rhye
        </Tag>
      </TagList>
    </TagGroup>
  ),
};

/**
 * Untitled UI's "Close X" example: avatar + ×. The × sits at 50% opacity and reaches 100% while the tag is hovered.
 * Press it, or focus a tag and press Backspace/Delete, to remove it.
 */
export const CloseX: Story = {
  render: function CloseXStory() {
    const [people, setPeople] = React.useState([
      { id: "olivia", name: "Olivia Rhye" },
      { id: "phoenix", name: "Phoenix Baker" },
      { id: "lana", name: "Lana Steiner" },
      { id: "demi", name: "Demi Wilkinson" },
    ]);
    return (
      <TagGroup
        label="Invited"
        onRemove={(keys) => setPeople((current) => current.filter((person) => !keys.has(person.id)))}
      >
        <TagList items={people} renderEmptyState={() => <span className="text-sm text-foreground-muted">No one left</span>}>
          {(person) => (
            <Tag id={person.id} avatarSrc={avatar(person.id)}>
              {person.name}
            </Tag>
          )}
        </TagList>
      </TagGroup>
    );
  },
};

/** Every combination: label only, with avatar, with ×, and with both. */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <TagGroup aria-label="Label only">
        <TagList>
          <Tag id="a">Label</Tag>
        </TagList>
      </TagGroup>
      <TagGroup aria-label="With avatar">
        <TagList>
          <Tag id="b" avatarSrc={avatar("b")}>
            Label
          </Tag>
        </TagList>
      </TagGroup>
      <TagGroup aria-label="With close" onRemove={() => {}}>
        <TagList>
          <Tag id="c">Label</Tag>
        </TagList>
      </TagGroup>
      <TagGroup aria-label="With avatar and close" onRemove={() => {}}>
        <TagList>
          <Tag id="d" avatarSrc={avatar("d")}>
            Label
          </Tag>
        </TagList>
      </TagGroup>
    </div>
  ),
};
