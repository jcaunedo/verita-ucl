import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@/components/buttons/button";
import { Typography } from "@/components/typography";

import { Modal, type ModalProps } from "./modal";

/** Opens on load (unless `defaultOpen` is false) and reopens from the button, so the story shows the modal and its enter/exit motion. */
function ModalDemo({ defaultOpen = true, ...props }: Omit<ModalProps, "isOpen" | "onOpenChange"> & { defaultOpen?: boolean }) {
  const [isOpen, setOpen] = React.useState(defaultOpen);
  return (
    <div className={`flex items-start bg-white p-6 ${defaultOpen ? "min-h-[480px]" : ""}`}>
      <Button onPress={() => setOpen(true)}>Open modal</Button>
      <Modal {...props} isOpen={isOpen} onOpenChange={setOpen} />
    </div>
  );
}

const meta: Meta<typeof Modal> = {
  title: "Overlays/Modal",
  component: Modal,
  tags: ["autodocs"],
  // Opens on mount, and an open modal locks page scroll and covers the page — so on the Docs page each story gets its own iframe.
  parameters: { layout: "fullscreen", docs: { story: { inline: false, height: "480px" } } },
};
export default meta;
type Story = StoryObj<typeof Modal>;

/** Title, description, and a body. Close with ×, Esc, or a click outside. */
export const Default: Story = {
  args: {
    title: "Modal title",
    description: "Supporting text that explains what this dialog is for.",
    children: "The modal's body goes here, 24px below the title block.",
  },
  // On the Docs page this story renders inline and closed (open it from its trigger), so the Docs controls reach it; a
  // story in its own iframe doesn't receive Docs control changes.
  parameters: { docs: { story: { inline: true } } },
  render: ({ children, ...args }, { viewMode }) => (
    <ModalDemo {...args} defaultOpen={viewMode !== "docs"}>
      <Typography>{children}</Typography>
    </ModalDemo>
  ),
};

/** Title only, no description. */
export const TitleOnly: Story = {
  render: () => (
    <ModalDemo title="Modal title">
      <Typography>The modal's body.</Typography>
    </ModalDemo>
  ),
};

/** `isDismissable={false}`: a click outside doesn't close it; × and Esc still do. */
export const NotDismissable: Story = {
  render: () => (
    <ModalDemo title="Modal title" description="Clicking the scrim doesn't close this one." isDismissable={false}>
      <Typography>The modal's body.</Typography>
    </ModalDemo>
  ),
};
