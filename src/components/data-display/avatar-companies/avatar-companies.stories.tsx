import type { Meta, StoryObj } from "@storybook/react-vite";
import { partnerLogos } from "@/assets/logos";
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

export const Google: Story = {
  args: { company: "google", logoSrc: partnerLogos.google, logoAlt: "Google" },
};

export const Amazon: Story = {
  args: { company: "amazon", logoSrc: partnerLogos.amazon, logoAlt: "Amazon" },
};

export const Apple: Story = {
  args: { company: "apple", logoSrc: partnerLogos.apple, logoAlt: "Apple" },
};

export const BankOfAmerica: Story = {
  args: {
    company: "bank-of-america",
    logoSrc: partnerLogos.bankOfAmerica,
    logoAlt: "Bank of America",
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
      <AvatarCompanies company="google" logoSrc={partnerLogos.google} logoAlt="Google" />
      <AvatarCompanies company="amazon" logoSrc={partnerLogos.amazon} logoAlt="Amazon" />
      <AvatarCompanies
        company="bank-of-america"
        logoSrc={partnerLogos.bankOfAmerica}
        logoAlt="Bank of America"
      />
      <AvatarCompanies company="apple" logoSrc={partnerLogos.apple} logoAlt="Apple" />
      <AvatarCompanies company="partner" />
    </div>
  ),
};
