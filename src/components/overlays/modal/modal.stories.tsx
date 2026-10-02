import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@/components/buttons/button";
import { Typography } from "@/components/typography";

import { Modal, type ModalProps } from "./modal";

/** Opens on load and reopens from the button, so the story shows the modal and its enter/exit motion. */
function ModalDemo(props: Omit<ModalProps, "isOpen" | "onOpenChange">) {
  const [isOpen, setOpen] = React.useState(true);
  return (
    <div className="flex min-h-[480px] items-start bg-white p-6">
      <Button onPress={() => setOpen(true)}>Open modal</Button>
      <Modal {...props} isOpen={isOpen} onOpenChange={setOpen} />
    </div>
  );
}

const meta: Meta<typeof Modal> = {
  title: "Overlays/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof Modal>;

/** Title, description, and a body. Close with ×, Esc, or a click outside. */
export const Default: Story = {
  render: () => (
    <ModalDemo title="Modal title" description="Supporting text that explains what this dialog is for.">
      <Typography>The modal's body goes here, 24px below the title block.</Typography>
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
