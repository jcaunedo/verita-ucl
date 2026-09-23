import * as React from "react";
import { DotsHorizontal } from "@untitledui/icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/buttons/button";
import { clickableRowProps } from "@/lib/clickable-row";
import {
  AvatarCompanies,
  type AvatarCompaniesProps,
} from "@/components/data-display/avatar-companies";
import { Badge, type BadgeProps } from "@/components/data-display/badge";
import { Typography } from "@/components/typography";
import { MenuContent, MenuTrigger } from "@/components/overlays/menu";

/**
 * A single application row — identity, engagement terms, status, and an
 * optional supporting-text line, routing to the application detail. Figma:
 * `application-card` (`Property 1`: Default, Hover). Composes the existing
 * `Badge` (`application-status`) and `Typography` rather than reproducing
 * their look inline — matching `ContractCard`/`NextStepCard`'s composition
 * pattern.
 *
 * The entire row is the primary click target (no separate CTA button), per
 * `product-specs/applications-card.md` §4 — `onPress`/`href` land on the
 * outer element via `rowProps`. `Property 1=Hover` in Figma is a pure `:hover`
 * pseudostate preview, not a prop a consumer sets, so it's expressed as
 * Tailwind `hover:`/`group-hover:` utilities rather than a `cva` variant.
 *
 * The row-level hover background binds to Figma's `state/hover-row`
 * (`bg-hover-row`) — the shared card/table row hover, see DESIGN.md
 * "Row hover".
 *
 * `onActionsPress` only renders the hover-revealed `···` overflow trigger
 * (Figma's `button` instance in the Hover variant) — the expanded menu itself
 * (View Details/Share/Withdraw, `product-specs/applications-card.md` §4.1) is
 * a separate concern for the consumer to wire up (e.g. an `overlays` menu
 * component), since Figma's Hover variant only shows the trigger, not the
 * open menu state. The trigger takes no space until hover/focus-within: its
 * slot then grows to Figma's 16px gap + 32px button, pushing the badge left
 * as the trigger dissolves in (Default → Hover in Figma).
 *
 * `partnerName` renders as a small eyebrow line above `title` (Figma's
 * `partner-name`, revised out of the terms row) rather than inline with
 * `compensation`/`engagementTerms`, per `product-specs/applications-card.md`
 * §2.3/§6.2. `duration` is a separate optional terms-row element from
 * `engagementTerms` (§2.3.2) — shown only when a confirmed timeframe exists;
 * its leading separator is toggled with it as one unit so the row never
 * dangles a trailing `·`.
 *
 * The avatar composes `AvatarCompanies` rather than reproducing its tile
 * markup inline — Figma's `avatar-companies` node this card's `Logo` slot
 * references. `company` defaults to `"partner"`; pass `company="verita"`
 * for the bundled Verita mark (Figma's Verita-partner rows).
 */
interface ApplicationCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Avatar tile treatment, forwarded to `AvatarCompanies` (Figma's `avatar-companies` `Property 1`). `"verita"` renders the bundled Verita mark and ignores `logoSrc`; any other value renders the partner tile. Defaults to `"partner"`. */
  company?: AvatarCompaniesProps["company"];
  /** Partner/opportunity logo, forwarded to `AvatarCompanies`. Optional, with a neutral fallback tile — Figma's `Logo`/`Logo icon`. Ignored when `company="verita"`. */
  logoSrc?: string;
  /** Alt text for `logoSrc`. Required semantically whenever `logoSrc` is set. */
  logoAlt?: string;
  /** Opportunity/application title (Figma's `Title`). Supports multiline per the PRD. */
  title: string;
  /** Agreed/advertised compensation display string, already formatted per its unit, e.g. "$85/hour". Omit when unavailable — never a bare number. */
  compensation?: string;
  /** Engagement terms — time commitment only, e.g. "Up to 30 hrs/week" (Figma's `Engagement terms`). Never a categorical type label or a location value, per `product-specs/applications-card.md` §2.3. Omit when unavailable. */
  engagementTerms?: string;
  /** Expected duration of the opportunity, e.g. "3 months", "2 weeks", "Ongoing" (Figma's `duration`) — a separate field from `engagementTerms`, never combined into one string. Shown only when a confirmed timeframe exists; omit rather than showing a placeholder (`product-specs/applications-card.md` §2.3.2). */
  duration?: string;
  /** Partner name or approved fallback (Figma's `partner-name`). Rendered as a small eyebrow line above `title`. */
  partnerName: string;
  /** Application status label (Figma's `badge` instance, e.g. "Applied"). Always shown — required, never omitted or approximated per the PRD §2.3. */
  statusLabel: string;
  /** Tone for the status badge — see `product-specs/applications-card.md` §3's proposed status→tone table. */
  statusTone?: BadgeProps["tone"];
  /** Supporting-text line (Figma's `Supporting text`) — a single optional line, rendered only when it has confirmed content for the current application state (PRD §2.4.2). Omit entirely rather than passing an empty string. */
  supportingText?: string;
  /** Accessible label for the hover-revealed actions-menu (`···`) trigger. Required whenever `onActionsPress` is set. */
  actionsMenuLabel?: string;
  /** Called when the actions-menu trigger is activated. Opens the consumer-owned menu (View Details/Share/Withdraw) — this component does not render the menu itself. Omit to hide the trigger entirely. */
  onActionsPress?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * The row's actions menu (`MenuItem`s / `MenuSeparator`s, e.g. View Details, Share, Withdraw — PRD §4.1).
   * When set, the hover-revealed `···` becomes a real menu trigger that opens it (bottom-end aligned) —
   * takes precedence over `onActionsPress`. While open, the trigger stays revealed and the row keeps its hover tint.
   */
  actionsMenu?: React.ReactNode;
  /** Forwarded to the row's own click target (e.g. `onClick`, which routes to the application detail per PRD §4). Passing `onClick` makes the whole row a `role="button"` (pointer cursor, focusable, Enter/Space) via `clickableRowProps`; clicks on nested controls don't trigger it. */
  rowProps?: Omit<React.HTMLAttributes<HTMLDivElement>, "className">;
  className?: string;
}

/** An Applications card — identity, engagement terms, status, and supporting text for one application. Figma: `application-card`. */
function ApplicationCard({
  company = "partner",
  logoSrc,
  logoAlt,
  title,
  compensation,
  engagementTerms,
  duration,
  partnerName,
  statusLabel,
  statusTone = "neutral",
  supportingText,
  actionsMenuLabel,
  onActionsPress,
  actionsMenu,
  rowProps,
  className,
  ...props
}: ApplicationCardProps) {
  // Figma: compensation/engagement-terms bind `foreground/foreground`; duration binds `foreground/muted`.
  const termsParts = [
    { value: compensation, muted: false },
    { value: engagementTerms, muted: false },
    { value: duration, muted: true },
  ].filter((part) => part.value);

  return (
    <div
      data-slot="application-card"
      className={cn(
        "group flex w-full items-center gap-10 py-5 pr-6 pl-5 transition-colors duration-150 ease-out",
        "hover:bg-hover-row has-[[aria-expanded=true]]:bg-hover-row",
        "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
        className,
      )}
      {...clickableRowProps(rowProps)}
      {...props}
    >
      <div className="flex min-w-0 flex-1 items-center gap-5">
        <AvatarCompanies company={company} logoSrc={logoSrc} logoAlt={logoAlt} />
        <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
          <div className="flex w-full flex-col items-start gap-0.5">
            <Typography size="xs" className="w-full text-foreground-muted">
              {partnerName}
            </Typography>
            <Typography
              as="h3"
              weight="semibold"
              className="w-full text-foreground"
            >
              {title}
            </Typography>
            {termsParts.length > 0 && (
              <Typography
                size="sm"
                className="flex items-center gap-1 whitespace-nowrap"
              >
                {termsParts.map((part, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && (
                      <span
                        aria-hidden="true"
                        className="text-foreground-muted"
                      >
                        ·
                      </span>
                    )}
                    <span
                      className={
                        part.muted ? "text-foreground-muted" : "text-foreground"
                      }
                    >
                      {part.value}
                    </span>
                  </React.Fragment>
                ))}
              </Typography>
            )}
          </div>
          {supportingText && (
            <Typography size="sm" className="w-full text-foreground-muted">
              {supportingText}
            </Typography>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center">
        <Badge tone={statusTone} label={statusLabel} size="md" />
        {(actionsMenu || onActionsPress) && (
          // Hover/focus-within reveal: the slot grows 0 → 48px (Figma's 16px gap + 32px button), pushing the badge left, while the button dissolves in.
          // Enter mirrors `standardTransition` (`motionDuration.normal`, Tailwind's `ease-in-out` = cubic-bezier(0.4,0,0.2,1)); exit is shorter per CLAUDE.md "Dismiss".
          // Kept mounted (clipped, not unmounted) so keyboard users can still tab to it — focus expands the slot via `group-focus-within`.
          // The reveal lives on the slot, not the Button, so the Button keeps its own look + hover transition untouched. The 4px `py-1 pr-1`
          // (cancelled by `-my-1 -mr-1`, hence 52px = 48 + 4) keeps Button's outset focus ring inside the `overflow-hidden` clip.
          <div
            data-slot="application-card-actions"
            className="-my-1 -mr-1 flex w-0 justify-end overflow-hidden py-1 pr-1 opacity-0 transition-[width,opacity] duration-150 ease-in-out group-focus-within:w-[52px] group-focus-within:opacity-100 group-focus-within:duration-300 group-hover:w-[52px] group-hover:opacity-100 group-hover:duration-300 has-[[aria-expanded=true]]:w-[52px] has-[[aria-expanded=true]]:opacity-100 motion-reduce:transition-none"
          >
            {actionsMenu ? (
              <MenuTrigger>
                <Button
                  color="tertiary"
                  size="xs"
                  iconLeading={DotsHorizontal}
                  aria-label={actionsMenuLabel}
                />
                <MenuContent placement="bottom end">{actionsMenu}</MenuContent>
              </MenuTrigger>
            ) : (
              <Button
                color="tertiary"
                size="xs"
                iconLeading={DotsHorizontal}
                aria-label={actionsMenuLabel}
                onClick={(event) => onActionsPress?.(event as React.MouseEvent<HTMLButtonElement>)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export { ApplicationCard, type ApplicationCardProps };
