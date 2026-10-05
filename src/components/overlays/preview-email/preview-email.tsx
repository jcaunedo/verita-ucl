import * as React from "react";
import { ArrowLeft } from "@untitledui/icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/buttons/button";
import { Logo } from "@/components/branding/logo";
import { Typography } from "@/components/typography";

interface PreviewEmailProps {
  /**
   * The recipient's first name, for the greeting above the headline (Figma: "Hi {first-name},"). Without it, the
   * greeting reads "Hi there,".
   */
  recipientFirstName?: string;
  /** The email's headline (Figma: `3xl -semibold`), e.g. "Theresa invited you to discover opportunities on Verita AI." */
  title: React.ReactNode;
  /** The paragraph under the headline (Figma: `base`). */
  description: React.ReactNode;
  /** The email's button label. Defaults to "Discover opportunities". */
  ctaLabel?: string;
  /** The back (←) button: returns to where the preview was opened from. */
  onBack: () => void;
  /** Accessible label for the back button. Defaults to "Back". */
  backLabel?: string;
  /** "Send invite" at the top right ("Send invites" when `recipientCount` is more than 1). */
  onSend: () => void;
  /** How many invites the send button sends, shown as a counter after its label. Omit (or 0) to hide it. */
  recipientCount?: number;
  className?: string;
}

/**
 * Props for a "Send invite" button sending `count` invites: the label ("Send invites" for more than one), `Button`'s
 * counter with the number (hidden at 0), and the name screen readers hear, "Send invites to 3 people", instead of
 * "Send invites 3". Spread onto a `Button`.
 */
function sendInviteButtonProps(count: number) {
  const label = count > 1 ? "Send invites" : "Send invite";
  if (count <= 0) return { children: label };
  return { children: label, count, "aria-label": `${label} to ${count} ${count === 1 ? "person" : "people"}` };
}

/**
 * A preview of the invite email a professional sends from the share modal (Figma: verita.ds → `preview-email`,
 * `node-id=6111-349`). It fills the modal surface on its own, with no modal title or ×, so render it inside
 * `Modal` with `bare` (`ShareReferralLinkModal` does).
 *
 * - Header: a 32px icon-only back button on its Figma fill (`neutral-700` at 8%, `--icon-hover`), "Send invite" as a
 *   32px secondary button with `Button`'s counter (`recipientCount`, `sendInviteButtonProps`), 16px in from the sides,
 *   then a full-width `border/neutral/border` divider 16px below.
 * - Email (24px below, 40px side and 24px vertical padding): the `Verita-Logo` wordmark (152.57x32), the message,
 *   and the footer, 40px apart. The message is the greeting ("Hi {first-name},", `base`), headline, and description
 *   20px apart (all `foreground/foreground`), then the email's 40px brand button 30px below. The footer is
 *   "verita-ai.com" (`sm -medium`, `state/link`) over the copyright (`xs`, `foreground/subtle`), 6px apart.
 *
 * The email part is a picture of what the recipient gets, so its button and link are plain text, not controls. Focus
 * starts on the back button when the preview mounts, since it replaces the view that held focus.
 */
function PreviewEmail({
  recipientFirstName,
  title,
  description,
  ctaLabel = "Discover opportunities",
  onBack,
  backLabel = "Back",
  onSend,
  recipientCount = 0,
  className,
}: PreviewEmailProps) {
  return (
    <div data-slot="preview-email" className={cn("flex w-full max-w-[600px] flex-col gap-6 py-4", className)}>
      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full items-center justify-between gap-4 px-4">
          {/* Figma shows the back button on the `--icon-hover` fill at rest; there's no separate hover, so it keeps it. */}
          <Button
            color="tertiary"
            size="xs"
            iconLeading={ArrowLeft}
            aria-label={backLabel}
            onPress={onBack}
            autoFocus
            className="bg-icon-hover"
          />
          <Button color="secondary" size="xs" onPress={onSend} {...sendInviteButtonProps(recipientCount)} />
        </div>
        <div aria-hidden="true" className="w-full border-t border-border" />
      </div>
      <section aria-label="Invite email" className="flex w-full flex-col items-start gap-10 px-10 py-6">
        <Logo title="Verita AI" />
        <div className="flex w-full flex-col items-start gap-[30px]">
          <div className="flex w-full flex-col items-start gap-5">
            <Typography>{recipientFirstName ? `Hi ${recipientFirstName},` : "Hi there,"}</Typography>
            <Typography as="h3" size="3xl" weight="semibold" className="font-sans">
              {title}
            </Typography>
            <Typography>{description}</Typography>
          </div>
          {/* Figma: the email's 40px brand button with a `base -medium` label, 18px side padding. Not a control here. */}
          <span className="inline-flex h-10 items-center rounded-full bg-tone-brand px-[18px] text-base font-medium text-primary-foreground">
            {ctaLabel}
          </span>
        </div>
        <div className="flex w-full flex-col items-start gap-1.5">
          <Typography as="span" size="sm" weight="medium" className="text-link">
            verita-ai.com
          </Typography>
          <Typography as="span" size="xs" className="text-foreground-subtle">
            © {new Date().getFullYear()} verita-ai.com
          </Typography>
        </div>
      </section>
    </div>
  );
}

export { PreviewEmail, sendInviteButtonProps, type PreviewEmailProps };
