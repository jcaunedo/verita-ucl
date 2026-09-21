import * as React from "react";
import { DotsHorizontal } from "@untitledui/icons";

import { cn } from "@/lib/utils";
import { Badge, type BadgeProps } from "@/components/data-display/badge";
import { Typography } from "@/components/typography";

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
 * The row-level hover background binds to Figma's `state/hover` variable
 * (`#31373f05`, ~2% neutral-700) — a distinct, lighter token from the
 * existing `--hover` (Figma's `color/hover`, ~4%, used by `Button`). Added as
 * `--row-hover`/`bg-row-hover` in `theme.css` rather than reusing `--hover`,
 * since the two are separate Figma variables with different values, not the
 * same token reused in two places.
 *
 * `onActionsPress` only renders the hover-revealed `···` overflow trigger
 * (Figma's `button` instance in the Hover variant) — the expanded menu itself
 * (View Details/Share/Withdraw, `product-specs/applications-card.md` §4.1) is
 * a separate concern for the consumer to wire up (e.g. an `overlays` menu
 * component), since Figma's Hover variant only shows the trigger, not the
 * open menu state.
 */
interface ApplicationCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Partner/opportunity logo. Optional, with a neutral fallback tile — Figma's `Logo`/`Logo icon`. */
  logoSrc?: string;
  /** Alt text for `logoSrc`. Required semantically whenever `logoSrc` is set. */
  logoAlt?: string;
  /** Opportunity/application title (Figma's `Title`). Supports multiline per the PRD. */
  title: string;
  /** Agreed/advertised compensation display string, already formatted per its unit, e.g. "$85/hour". Omit when unavailable — never a bare number. */
  compensation?: string;
  /** Engagement terms — time commitment and/or duration, e.g. "Up to 30 hrs/week · 3 months" (Figma's `Engagement terms`). Never a categorical type label or a location value, per `product-specs/applications-card.md` §2.3. Omit when neither is available. */
  engagementTerms?: string;
  /** Partner name or approved fallback (Figma's `Partner name`). */
  partnerName: string;
  /** Application status label (Figma's `badge` instance, e.g. "In review"). Always shown — required, never omitted or approximated per the PRD §2.3. */
  statusLabel: string;
  /** Tone for the status badge — see `product-specs/applications-card.md` §3's proposed status→tone table. */
  statusTone?: BadgeProps["tone"];
  /** Supporting-text line (Figma's `Supporting text`) — a single optional line, rendered only when it has confirmed content for the current application state (PRD §2.4.2). Omit entirely rather than passing an empty string. */
  supportingText?: string;
  /** Accessible label for the hover-revealed actions-menu (`···`) trigger. Required whenever `onActionsPress` is set. */
  actionsMenuLabel?: string;
  /** Called when the actions-menu trigger is activated. Opens the consumer-owned menu (View Details/Share/Withdraw) — this component does not render the menu itself. Omit to hide the trigger entirely. */
  onActionsPress?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Forwarded to the row's own click target (e.g. `onClick`), which routes to the application detail per PRD §4. */
  rowProps?: Omit<React.HTMLAttributes<HTMLDivElement>, "className">;
  className?: string;
}

/** An Applications card — identity, engagement terms, status, and supporting text for one application. Figma: `application-card`. */
function ApplicationCard({
  logoSrc,
  logoAlt,
  title,
  compensation,
  engagementTerms,
  partnerName,
  statusLabel,
  statusTone = "neutral",
  supportingText,
  actionsMenuLabel,
  onActionsPress,
  rowProps,
  className,
  ...props
}: ApplicationCardProps) {
  const detailParts = [compensation, engagementTerms, partnerName].filter(
    Boolean,
  );

  return (
    <div
      data-slot="application-card"
      className={cn(
        "group flex w-full items-center gap-4 py-5 pr-6 pl-5 transition-colors duration-150 ease-out",
        "hover:bg-row-hover",
        className,
      )}
      {...rowProps}
      {...props}
    >
      <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f9f1f2]">
        {logoSrc && (
          <img
            src={logoSrc}
            alt={logoAlt ?? ""}
            className="size-8 object-contain"
          />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
        <div className="flex w-full flex-col items-start">
          <Typography
            as="h3"
            weight="semibold"
            className="w-full text-foreground"
          >
            {title}
          </Typography>
          {detailParts.length > 0 && (
            <Typography className="flex items-center gap-1 whitespace-nowrap">
              {detailParts.map((part, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <span aria-hidden="true" className="text-foreground-muted">
                      ·
                    </span>
                  )}
                  <span className="text-foreground">{part}</span>
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
      <Badge tone={statusTone} label={statusLabel} size="md" />
      {onActionsPress && (
        <button
          type="button"
          aria-label={actionsMenuLabel}
          onClick={onActionsPress}
          className="flex shrink-0 items-center justify-center rounded-full px-[5px] py-2 text-icon-muted opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100 group-focus-within:opacity-100 hover:text-icon-foreground focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-ring"
        >
          <span className="flex items-center px-[3px]">
            <DotsHorizontal className="size-4" />
          </span>
        </button>
      )}
    </div>
  );
}

export { ApplicationCard, type ApplicationCardProps };
