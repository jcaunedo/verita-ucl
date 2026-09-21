import type { Meta, StoryObj } from "@storybook/react-vite";
import { AvatarCompanies } from "./avatar-companies";

const meta: Meta<typeof AvatarCompanies> = {
  title: "DataDisplay/AvatarCompanies",
  component: AvatarCompanies,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof AvatarCompanies>;

export const Verita: Story = {
  args: {
    company: "verita",
  },
};

export const Partner: Story = {
  args: {
    company: "google",
    logoSrc:
      "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
    logoAlt: "Google",
  },
};

export const NoLogo: Story = {
  args: {
    company: "partner",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <AvatarCompanies company="verita" />
      <AvatarCompanies
        company="google"
        logoSrc="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
        logoAlt="Google"
      />
      <AvatarCompanies company="partner" />
    </div>
  ),
};
