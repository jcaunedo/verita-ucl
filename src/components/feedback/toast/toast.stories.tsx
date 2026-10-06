import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@/components/buttons/button";

import { Toast, Toaster, toast } from "./toast";

const meta: Meta<typeof Toast> = {
  title: "Feedback/Toast",
  component: Toast,
  // `Toaster`'s props all come from `sonner`, so instead of an empty props tab, the setup goes in the page description.
  parameters: {
    docs: {
      description: {
        component: `A toast notification card. Figma: \`sonner\`. Usually shown through \`toast()\` rather than rendered directly.

**Setup:** mount \`<Toaster />\` once near the root of the app, then call \`toast()\` from anywhere:

\`\`\`tsx
import { Toaster, toast } from "verita-ai-ucl";

<Toaster />;
toast({ title: "Referral link copied", tone: "success" });
\`\`\`

\`Toaster\` shows toasts bottom right on desktop and bottom center at 768px and below (DESIGN.md "Toasts"), keeps at most 3 visible, and pauses auto-dismiss while one is hovered. \`toast()\` takes \`title\`, \`description\`, \`tone\`, \`action\` (\`{ label, onClick }\`), \`duration\`, \`dismissible\`, and \`id\`, and returns the toast's id: \`toast.dismiss(id)\` closes it, \`toast.dismiss()\` closes them all.`,
      },
    },
  },
  tags: ["autodocs"],
  args: {
    title: "Title",
    description: "Description",
    actionLabel: "Label",
    onAction: () => {},
    onClose: () => {},
  },
  decorators: [
    (Story) => (
      <div className="bg-white p-6">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof Toast>;

/** Figma `sonner`: icon, title, description, action, and close. Hover the toast to bring the × to full opacity. */
export const Default: Story = {};

/** Title only, no description. */
export const TitleOnly: Story = {
  args: { description: undefined },
};

/** No action button (Figma `showActionButton` off). */
export const WithoutAction: Story = {
  args: { actionLabel: undefined },
};

/** No close button (Figma `showCloseButton` off). */
export const WithoutClose: Story = {
  args: { onClose: undefined },
};

/** Every tone. Figma only shows `success`; the others pick their icon from DESIGN.md's message-icon map. */
export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Toast {...args} tone="success" title="Link copied" description="Your referral link is ready to share." />
      <Toast {...args} tone="info" title="Import in progress" description="We'll let you know when it's done." />
      <Toast {...args} tone="warning" title="Some contacts were skipped" description="12 rows had no email address." />
      <Toast {...args} tone="destructive" title="Upload failed" description="The file isn't a CSV. Try another file." />
    </div>
  ),
};

/** The real thing: `Toaster` mounted once, `toast()` from a button. Toasts stack bottom right (bottom center on mobile) and pause while hovered. */
export const WithToaster: Story = {
  render: () => (
    <>
      <div className="flex flex-wrap gap-2">
        <Button
          onPress={() =>
            toast({
              title: "Referral link copied",
              description: "Share it with someone new to Verita.",
              action: { label: "Undo", onClick: () => {} },
            })
          }
        >
          Show a toast
        </Button>
        <Button
          color="secondary"
          onPress={() => toast({ tone: "destructive", title: "Upload failed", description: "The file isn't a CSV." })}
        >
          Show an error
        </Button>
      </div>
      <Toaster />
    </>
  ),
};
