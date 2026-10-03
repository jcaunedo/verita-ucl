import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { CurrencyDollarCircle, Link02 } from "@untitledui/icons";

import { fadeVariants, standardTransition, useMotionPreference } from "@/lib/motion";
import { Button } from "@/components/buttons/button";
import { Hyperlink } from "@/components/buttons/hyperlink";
import { Typography, typographyVariants } from "@/components/typography";
import { Modal } from "@/components/overlays/modal";
import { TagInput } from "@/components/forms/tag-input";
import { AvatarCompanies, type AvatarCompaniesProps } from "@/components/data-display/avatar-companies";
import { InlineAlert } from "@/components/feedback/inline-alert";
import { toast } from "@/components/feedback/toast";

/**
 * Intro copy for a shared post, one picked at random each time the modal opens so shares don't all read the same.
 * `{link}` is replaced with the referral link.
 */
const SHARE_MESSAGES = [
  "Thought this might be worth sharing. Verita connects experienced professionals with flexible opportunities that match their expertise. Take a look and see what you discover:\n{link}",
  "If you’re open to something new, Verita might have an opportunity worth checking out. Discover flexible work that fits your background and experience:\n{link}",
  "Sharing this because your next opportunity might be here. Verita helps experienced professionals discover flexible work that matches what they do best:\n{link}",
  "Know someone ready for a new opportunity? Verita connects experienced professionals with flexible work across different fields. Take a look or pass it along:\n{link}",
  "I thought this could be useful to someone in my network. Verita makes it easier to discover flexible opportunities that match your experience and expertise:\n{link}",
];

/**
 * "Share on" destinations: each network's own share page, opened in a new window. LinkedIn and X prefill the post
 * with the intro copy (which already ends with the link). Facebook's sharer only accepts a URL and never prefills
 * text (Facebook's policy), so it gets the link alone and shows its own preview of it.
 */
const SHARE_NETWORKS = [
  {
    label: "LinkedIn",
    href: (_url: string, text: string) =>
      `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`,
  },
  {
    label: "X",
    href: (_url: string, text: string) => `https://x.com/intent/post?text=${encodeURIComponent(text)}`,
  },
  {
    label: "Facebook",
    href: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
];

/** What an opportunity's share copy is written from (see `OPPORTUNITY_SHARE_MESSAGES`). */
interface OpportunityShareContext {
  /** "Senior Financial Analyst". */
  title: string;
  /** "a Senior Financial Analyst" / "an AI Trainer". */
  role: string;
  /** Who it suits, as a plural phrase, e.g. "financial analysts and FP&A professionals". */
  audience: string;
  /** The terms in brackets with a leading space, e.g. " ($95–115k/yr, 32 hrs/week, 1 year)", or "" when there are none. */
  terms: string;
}

/**
 * Intro copy for sharing a specific opportunity (pass `opportunity`), one picked at random each time the modal opens,
 * like `SHARE_MESSAGES`. Each names the role and its terms and speaks to the people it suits (`audience`), so the post
 * reaches the right part of the professional's network. Kept short enough for X with a long title. The link follows on
 * its own line.
 */
const OPPORTUNITY_SHARE_MESSAGES: ((context: OpportunityShareContext) => string)[] = [
  ({ role, audience, terms }) =>
    `Calling ${audience}: Verita is looking for ${role}${terms}. Flexible, expert-level work. Take a look or pass it along:`,
  ({ role, audience, terms }) =>
    `Know any ${audience}? There’s ${role} opportunity on Verita${terms} that could be a great fit. Worth a look:`,
  ({ role, audience, terms }) =>
    `Sharing ${role} opportunity for ${audience}${terms}. Verita connects experts with flexible work that fits their background:`,
  ({ title, audience, terms }) =>
    `Open role for ${audience}: ${title} on Verita${terms}. Apply, or share it with someone who’d be a great fit:`,
  ({ role, audience, terms }) =>
    `If you’re one of the ${audience} in my network, this could be for you: ${role} opportunity on Verita${terms}. Details here:`,
];

/** "a Senior Financial Analyst", "an AI Trainer": the title with its indefinite article. */
function withArticle(title: string) {
  return `${/^[aeiou]/i.test(title) ? "an" : "a"} ${title}`;
}

/**
 * The share copy for an opportunity: `OPPORTUNITY_SHARE_MESSAGES[index]` filled from it, then the link. Without an
 * `audience`, the copy speaks to "professionals with {title} experience".
 */
function opportunityShareText(opportunity: ReferralOpportunity, index: number, link: string) {
  const { title, audience, compensation, engagementTerms, duration } = opportunity;
  const termParts = [compensation, engagementTerms, duration].filter(Boolean);
  const message = OPPORTUNITY_SHARE_MESSAGES[index % OPPORTUNITY_SHARE_MESSAGES.length]({
    title,
    role: withArticle(title),
    audience: audience ?? `professionals with ${title} experience`,
    terms: termParts.length > 0 ? ` (${termParts.join(", ")})` : "",
  });
  return `${message}\n${link}`;
}

/**
 * A random index into the share messages (`SHARE_MESSAGES` and `OPPORTUNITY_SHARE_MESSAGES` are the same length),
 * never the same as `previous`, so reopening the modal changes the copy.
 */
function pickMessageIndex(previous: number | null) {
  if (SHARE_MESSAGES.length < 2) return 0;
  let next = Math.floor(Math.random() * SHARE_MESSAGES.length);
  while (next === previous) next = Math.floor(Math.random() * SHARE_MESSAGES.length);
  return next;
}

/** The opportunity being referred to, shown as a summary above the link (Figma `Opportunity Default` / `Email`). */
interface ReferralOpportunity {
  /** Opportunity title, e.g. "Senior Financial Analyst". */
  title: string;
  /** Partner name or approved fallback, e.g. "Verita partner" (the small line above the title). */
  partnerName: string;
  /** Avatar tile, forwarded to `AvatarCompanies`. Defaults to `"verita"`. */
  company?: AvatarCompaniesProps["company"];
  /** Partner logo, forwarded to `AvatarCompanies` when `company` isn't `"verita"`. */
  logoSrc?: string;
  logoAlt?: string;
  /** Formatted pay, e.g. "$95–115k/yr". Omit when unknown. */
  compensation?: string;
  /** Time commitment, e.g. "32 hrs/week". Omit when unknown. */
  engagementTerms?: string;
  /** Expected duration, e.g. "1 year". Omit when there's no confirmed timeframe. */
  duration?: string;
  /** The opportunity's referral reward in USD (`referrals.md` §9), shown as "$450 potential referral reward". */
  reward?: number;
  /**
   * Who the opportunity suits, as a plural phrase: the roles, job titles, or industry it's for, e.g. "financial analysts
   * and FP&A professionals". Not shown in the modal; the LinkedIn and X share copy speaks to them. Defaults to
   * "professionals with {title} experience".
   */
  audience?: string;
}

interface ShareReferralLinkModalProps {
  /** Whether the modal is open. Controlled: pair with `onOpenChange`. */
  isOpen: boolean;
  /** Called with `false` when the modal closes (×, Esc, or a click outside it). */
  onOpenChange: (isOpen: boolean) => void;
  /**
   * The link to share: the professional's general referral link (e.g. "https://ref.verita-ai.com/hhd87"), or, with
   * `opportunity`, their link for that opportunity (e.g. "https://ref.verita-ai.com/hhd87-yw7e").
   */
  link: string;
  /**
   * Refer someone to this opportunity instead of to Verita in general (`referrals.md` §6). The title and description
   * change, and a summary of the opportunity and its reward sits above the link. Everything else works the same.
   */
  opportunity?: ReferralOpportunity;
  /** Called after the link is copied, e.g. for analytics. */
  onCopy?: () => void;
  /**
   * Called with the addresses when "Send invite" is pressed and they're all valid. The modal then closes and confirms
   * with a toast. Sending the emails is the app's job; the prototype only shows the toast.
   */
  onSendInvite?: (emails: string[]) => void;
  /**
   * "Preview email", at the right of the "Share by email" label when referring an `opportunity` (Figma `Opportunity
   * Email`). Shows what the invite will say; there's no design for the preview yet, so it's the app's to open.
   */
  onPreviewEmail?: () => void;
}

const rewardCurrency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

/**
 * The opportunity summary (Figma `Opportunity Default` / `Opportunity Email`): the `application-card` layout without
 * its status badge or hover, since it isn't a row to open. A 1px `border/neutral/border` box with `radius/base` (8px),
 * 20px left and 24px right padding, 16px top and bottom: the 48px `avatar-companies` tile, 20px gap, then partner name
 * (`xs`, muted) over the title (`base -bold`), and 2px below them the terms (`sm`: pay `semibold`, then hours and
 * duration, with muted `·` between). The reward sits 12px below as a success `InlineAlert` with `currency-dollar-circle`.
 */
function OpportunitySummary({ opportunity }: { opportunity: ReferralOpportunity }) {
  const {
    title,
    partnerName,
    company = "verita",
    logoSrc,
    logoAlt,
    compensation,
    engagementTerms,
    duration,
    reward,
  } = opportunity;
  const terms = [
    { value: compensation, className: "font-semibold" },
    { value: engagementTerms },
    { value: duration },
  ].filter((part) => Boolean(part.value));

  return (
    <div data-slot="share-referral-opportunity" className="flex w-full flex-col items-start gap-3">
      <div className="flex w-full items-center gap-5 rounded-base border border-border bg-background py-4 pr-6 pl-5">
        <AvatarCompanies company={company} logoSrc={logoSrc} logoAlt={logoAlt} />
        <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
          <div className="flex w-full flex-col items-start">
            <Typography size="xs" className="text-foreground-muted">
              {partnerName}
            </Typography>
            <Typography weight="bold">{title}</Typography>
          </div>
          {terms.length > 0 && (
            <Typography size="sm" className="flex flex-wrap items-center gap-1">
              {terms.map((part, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <span aria-hidden="true" className="text-foreground-muted">
                      ·
                    </span>
                  )}
                  <span className={part.className}>{part.value}</span>
                </React.Fragment>
              ))}
            </Typography>
          )}
        </div>
      </div>
      {reward !== undefined && (
        // Figma `Opportunity Email`: green `tone/success` with `currency-dollar-circle`, since it's money the professional
        // can earn. Also used on the link view, so the line doesn't change color when the views swap.
        <InlineAlert tone="success" icon={CurrencyDollarCircle}>
          {rewardCurrency.format(reward)} potential referral reward
        </InlineAlert>
      )}
    </div>
  );
}

/** Figma `Property 1`: `Link Default` / `Opportunity Default` share the link; `… Email` sends it by email. */
type ShareMode = "link" | "email";

const EMAIL_PATTERN = /^[^\s@,]+@[^\s@,]+\.[^\s@,]+$/;

/** Splits typed or pasted text into addresses: commas, semicolons, and whitespace. */
const EMAIL_DELIMITER = /[\s,;]+/;

const INVALID_EMAIL_MESSAGE = "Enter a valid email address";
const DUPLICATE_EMAIL_MESSAGE = "You’ve already added this email";
const EMAIL_HELP = "Enter an email address and press Enter or Space to add it.";

/**
 * Copies the link, closes the modal right away, and confirms with a toast ("Referral link copied and ready to share").
 * The toast needs a mounted `Toaster`. If the clipboard is blocked (e.g. an insecure context), the modal stays open
 * and an error toast says to copy the link by hand: the field is selectable, so that always works.
 */
function useCopyLink({ link, onClose, onCopy }: { link: string; onClose: () => void; onCopy?: () => void }) {
  return React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      toast({
        tone: "destructive",
        title: "Couldn’t copy your referral link",
        description: "Select the link and copy it instead.",
      });
      return;
    }
    onClose();
    onCopy?.();
    toast({ title: "Referral link copied and ready to share" });
  }, [link, onClose, onCopy]);
}

/**
 * The rendered height of an element, kept current with a `ResizeObserver`, so a wrapper can animate to it. A callback
 * ref (not `useRef`), because the element only exists while the modal is open.
 */
function useMeasuredHeight() {
  const [node, setNode] = React.useState<HTMLElement | null>(null);
  const [height, setHeight] = React.useState<number | "auto">("auto");
  React.useLayoutEffect(() => {
    if (!node) return;
    const observer = new ResizeObserver(() => setHeight(node.offsetHeight));
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);
  return { ref: setNode, height };
}

/**
 * The modal for sharing a professional's referral link (`product-specs/referrals.md` §6). Figma: verita.ds →
 * `share-referral-link-modal` (`node-id=6087-4006`), four states: `Link Default` / `Link Email` (a general referral,
 * from Referrals' "Share your referral link") and `Opportunity Default` / `Opportunity Email` (pass `opportunity`;
 * from an opportunity's "Refer"). Built on `Modal`.
 *
 * - Opportunity: "Refer someone to apply", its own description, and the opportunity summary with its potential reward
 *   (`OpportunitySummary`) between the description and the link. The link and email views below are the same, except
 *   that the email view adds "Preview email" at the right of its label (`onPreviewEmail`).
 *
 * - Link view (`Default`): a `sm -medium` label over a read-only field on `color-tone-info-subtle` with `radius/input`,
 *   a leading `link-02` icon, and the link in `base`. It's a real read-only input, so the link can be selected and
 *   copied by hand too. "Copy referral link" (full-width 40px primary, `base -medium` label) copies it, closes the
 *   modal, and shows a toast, so render a `Toaster`.
 * - Email view (`Variant2`): "Share by email" as a `TagInput`: each address becomes a removable tag. Enter, a comma,
 *   a semicolon, or a space adds the typed address, and a pasted list adds one tag per address. An invalid or repeated
 *   address isn't added, and its message replaces the helper line. The addresses are kept as a `string[]`.
 *   "Send invite" is disabled until there's at least one valid address (Figma's disabled fill is the Button's own
 *   `disabled:bg-neutral-300`); a valid address still in the input counts and is sent with the tags.
 * - Bottom row: the toggle between the two views ("Share by email" / "Share your link", underlined `sm`), `or` in
 *   `xs` muted, then "Share on:" LinkedIn · X · Facebook, each opening that network's share page in a new window.
 *   LinkedIn and X prefill one of `SHARE_MESSAGES` (picked at random per opening) with the link, or, for an
 *   opportunity, one of `OPPORTUNITY_SHARE_MESSAGES`, naming the role and its terms for the people it suits (`audience`). Facebook takes the
 *   link only. No hover in Figma; links fade to `foreground/muted`, like `Hyperlink`'s hover swap.
 *
 * Motion: swapping views crossfades the field and button (`fadeVariants`, the old view leaves before the new one
 * arrives) while the area between them grows or shrinks to the new view's height on `standardTransition` (CLAUDE.md
 * "Expand"), so the modal resizes and re-centers smoothly instead of jumping. Under reduced motion the swap is
 * instant. The modal always opens on the link view. Switching to email moves focus into the email input.
 *
 * Clicking the link field selects the whole link, with no focus ring: the selection is the highlight. The email
 * helper line is replaced by the validation message when an address is invalid.
 */
function ShareReferralLinkModal({
  isOpen,
  onOpenChange,
  link,
  opportunity,
  onCopy,
  onSendInvite,
  onPreviewEmail,
}: ShareReferralLinkModalProps) {
  const { prefersReducedMotion } = useMotionPreference();
  const close = React.useCallback(() => onOpenChange(false), [onOpenChange]);
  const copy = useCopyLink({ link, onClose: close, onCopy });
  const fieldId = React.useId();
  const emailRef = React.useRef<HTMLInputElement>(null);

  const [mode, setMode] = React.useState<ShareMode>("link");
  const [emails, setEmails] = React.useState<string[]>([]);
  // What's typed in the input but not yet a tag.
  const [draft, setDraft] = React.useState("");
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const focusEmailOnEnter = React.useRef(false);
  const swapArea = useMeasuredHeight();
  // The swap area's height only glides while the view is swapping. The rest of the time (e.g. the email field growing
  // as you type) it follows the content at once, so the glide never clips the button under the field.
  const [isSwapping, setIsSwapping] = React.useState(false);
  const swapTimer = React.useRef<number | undefined>(undefined);
  React.useEffect(() => () => window.clearTimeout(swapTimer.current), []);

  // A new intro each time the modal opens; it stays the same while open, so every network gets the same copy.
  const [messageIndex, setMessageIndex] = React.useState(() => pickMessageIndex(null));
  React.useEffect(() => {
    if (!isOpen) return;
    setMessageIndex((previous) => pickMessageIndex(previous));
    setMode("link");
    setEmails([]);
    setDraft("");
    setEmailError(null);
  }, [isOpen]);
  // An opportunity gets copy written for it and the people it suits; a general referral gets the general copy.
  const shareText = opportunity
    ? opportunityShareText(opportunity, messageIndex, link)
    : SHARE_MESSAGES[messageIndex].replace("{link}", link);

  const switchMode = () => {
    const next: ShareMode = mode === "link" ? "email" : "link";
    focusEmailOnEnter.current = next === "email";
    setEmailError(null);
    setMode(next);
    setIsSwapping(true);
    window.clearTimeout(swapTimer.current);
    // The exit fade, then the height glide (`standardTransition`), with a little slack.
    swapTimer.current = window.setTimeout(() => setIsSwapping(false), 800);
  };

  const draftEmail = draft.trim();
  const isDraftValid = EMAIL_PATTERN.test(draftEmail);

  const hasValidEmail = emails.length > 0 || isDraftValid;

  const sendInvite = (event: React.FormEvent) => {
    event.preventDefault();
    // A repeat of a tag is dropped rather than blocking the send; anything else still typed must be valid.
    const isRepeat = emails.some((email) => email.toLowerCase() === draftEmail.toLowerCase());
    const pending = draftEmail !== "" && !isRepeat ? [draftEmail] : [];
    if (pending.length > 0 && !isDraftValid) {
      setEmailError(INVALID_EMAIL_MESSAGE);
      emailRef.current?.focus();
      return;
    }
    const list = [...emails, ...pending];
    if (list.length === 0) {
      setEmailError(INVALID_EMAIL_MESSAGE);
      emailRef.current?.focus();
      return;
    }
    onSendInvite?.(list);
    close();
    toast({
      title: list.length === 1 ? `Invite sent to ${list[0]}` : `Invites sent to ${list.length} people`,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={opportunity ? "Refer someone to apply" : "Share your referral link"}
      description={
        opportunity
          ? "Share this opportunity with someone you think could be a good fit. They can be new to Verita or already a member. You’ll earn the referral reward if they start working and meet the qualifying milestone."
          : "Share this link with someone you’d like to invite to Verita. If they join through your link and later meet the referral requirements, you’ll be able to track their progress and reward here."
      }
    >
      {opportunity && <OpportunitySummary opportunity={opportunity} />}
      {/* The height glide wraps the crossfade. `-m-1 p-1` keeps focus rings (e.g. the buttons' 2px offset ring) inside
          the clipped area. */}
      <motion.div
        initial={false}
        animate={{ height: swapArea.height }}
        transition={prefersReducedMotion || !isSwapping ? { duration: 0 } : standardTransition}
        className="-m-1 w-[calc(100%+0.5rem)] overflow-hidden"
      >
        <div ref={swapArea.ref} className="p-1">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={mode}
              variants={fadeVariants}
              initial={prefersReducedMotion ? false : "initial"}
              animate="animate"
              exit={prefersReducedMotion ? undefined : "exit"}
              onAnimationComplete={() => {
                if (focusEmailOnEnter.current && mode === "email") {
                  focusEmailOnEnter.current = false;
                  emailRef.current?.focus();
                }
              }}
              className="w-full"
            >
              {mode === "link" ? (
                <div className="flex w-full flex-col items-start gap-4">
                  <div data-slot="share-referral-link-field" className="flex w-full flex-col items-start gap-1.5">
                    <label
                      htmlFor={fieldId}
                      className={typographyVariants({
                        size: "sm",
                        weight: "medium",
                      })}
                    >
                      Your referral link
                    </label>
                    <div className="flex w-full items-center gap-2 rounded-input bg-tone-info-subtle px-3.5 py-[7px]">
                      <Link02 aria-hidden="true" className="size-4 shrink-0 text-icon-foreground" />
                      <input
                        id={fieldId}
                        readOnly
                        value={link}
                        onFocus={(event) => event.currentTarget.select()}
                        className="min-w-0 flex-1 truncate bg-transparent text-base text-foreground outline-none"
                      />
                    </div>
                  </div>
                  {/* Figma: 40px tall with a `base -medium` label; UCL's `md` Button is 40px with an `sm` label, so the label size is overridden. */}
                  <Button size="md" onPress={copy} className="w-full text-base">
                    Copy referral link
                  </Button>
                </div>
              ) : (
                <form noValidate onSubmit={sendInvite} className="flex w-full flex-col items-start gap-4">
                  <TagInput
                    ref={emailRef}
                    label="Share by email"
                    labelAction={
                      // Figma `Opportunity Email` only: lets the professional see what the invite will say.
                      opportunity && (
                        <Hyperlink onPress={onPreviewEmail} className="font-normal">
                          Preview email
                        </Hyperlink>
                      )
                    }
                    hint={EMAIL_HELP}
                    placeholder="Search connections or enter email"
                    value={emails}
                    onChange={setEmails}
                    inputValue={draft}
                    onInputChange={(next) => {
                      setDraft(next);
                      setEmailError(null);
                    }}
                    validate={(email) => (EMAIL_PATTERN.test(email) ? null : INVALID_EMAIL_MESSAGE)}
                    duplicateMessage={DUPLICATE_EMAIL_MESSAGE}
                    delimiter={EMAIL_DELIMITER}
                    // Only the send-time error; the field shows its own validation messages.
                    errorMessage={emailError ?? undefined}
                    tagsLabel="Email addresses to invite"
                    inputProps={{ inputMode: "email", autoComplete: "email" }}
                  />
                  <Button type="submit" size="md" isDisabled={!hasValidEmail} className="w-full text-base">
                    Send invite
                  </Button>
                </form>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Figma: the view toggle, `or`, "Share on:", and the links, 10px apart; the links sit 5px apart around `·`. */}
      <div className="flex w-full flex-wrap items-center justify-center gap-[10px]">
        <button
          type="button"
          onClick={switchMode}
          className="rounded-sm text-sm text-foreground underline transition-colors duration-160 ease-in-out outline-none hover:text-foreground-muted focus-visible:ring-2 focus-visible:ring-ring"
        >
          {mode === "link" ? "Share by email" : "Share your link"}
        </button>
        <Typography as="span" size="xs" className="text-foreground-muted">
          or
        </Typography>
        <Typography as="span" size="sm">
          Share on:
        </Typography>
        <ul className="flex items-center gap-[5px]">
          {SHARE_NETWORKS.map(({ label, href }, index) => (
            <li key={label} className="flex items-center gap-[5px]">
              {index > 0 && (
                <Typography as="span" size="sm" aria-hidden="true">
                  ·
                </Typography>
              )}
              <a
                href={href(link, shareText)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Share on ${label} (opens in a new window)`}
                className="rounded-sm text-sm text-foreground underline transition-colors duration-160 ease-in-out outline-none hover:text-foreground-muted focus-visible:ring-2 focus-visible:ring-ring"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}

export { ShareReferralLinkModal, type ShareReferralLinkModalProps, type ReferralOpportunity };
