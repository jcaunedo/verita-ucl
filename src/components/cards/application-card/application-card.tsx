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
 * `supportingText` has two positions (Figma: `supporting-text-1` in the right
 * container, `supporting-text-2` as the left container's 4th row). By default
 * it sits on the right, before the badge, using all the width the left
 * content doesn't need and wrapping to at most 2 lines; when it would need a
 * 3rd line there, it moves to the left instead. Inside an
 * `ApplicationCardGroup`, the whole list switches together. See
 * `useSupportingTextFit`.
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

/** Spacing the placement math needs: text → badge (Figma `Right Container` `gap-4`) and the revealed `···` slot (16px gap + 32px button + 4px focus-ring room). */
const TEXT_BADGE_GAP = 16;
const ACTIONS_SLOT_WIDTH = 52;
/** Figma `supporting-text-1`: wraps to at most 2 lines on the right before the text moves to the left container. */
const MAX_RIGHT_LINES = 2;

/**
 * Decides where `supportingText` goes. Either way, the side without the text
 * sizes to its content and the side with it takes the rest. With the text on
 * the right, the left content keeps its natural, unwrapped width and the text
 * gets everything between it and the badge. With the text on the left, the
 * right side shrinks to the badge and the left side fills the card.
 *
 * On every resize, the room the text would get on the right is computed: card
 * width, minus the left content at its unwrapped width, the 40px row gap, the
 * right padding, the badge, the 16px gap, and the `···` slot. A hidden copy of
 * the text is laid out at that width: if it fits in 2 lines, it goes on the
 * right (clamped with an ellipsis, as a safety net), otherwise on the left's
 * 4th row. Everything measured is independent of where the text currently
 * sits (hidden copies, and the text column's fixed starting x), so the
 * placement can't flip back and forth. The `···` slot is always counted, so
 * hovering never moves the text.
 */
function useSupportingTextFit(hasSupportingText: boolean, hasActions: boolean) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const textColumnRef = React.useRef<HTMLDivElement>(null);
  const badgeRef = React.useRef<HTMLDivElement>(null);
  const measureLinesRef = React.useRef<HTMLDivElement>(null);
  const measureTextRef = React.useRef<HTMLDivElement>(null);
  const [fitsRight, setFitsRight] = React.useState(true);

  React.useLayoutEffect(() => {
    const card = cardRef.current;
    if (!card || !hasSupportingText) return;

    const update = () => {
      const textColumn = textColumnRef.current;
      const badge = badgeRef.current;
      const lines = measureLinesRef.current;
      const text = measureTextRef.current;
      if (!textColumn || !badge || !lines || !text) return;

      const cardBox = card.getBoundingClientRect();
      const cardStyle = getComputedStyle(card);
      const leftNeeded = textColumn.getBoundingClientRect().left - cardBox.left + lines.getBoundingClientRect().width;
      const available =
        cardBox.width -
        leftNeeded -
        (parseFloat(cardStyle.columnGap) || 0) -
        (parseFloat(cardStyle.paddingRight) || 0) -
        badge.getBoundingClientRect().width -
        TEXT_BADGE_GAP -
        (hasActions ? ACTIONS_SLOT_WIDTH : 0);
      if (available <= 0) return setFitsRight(false);

      text.style.width = `${available}px`;
      const lineHeight = parseFloat(getComputedStyle(text).lineHeight) || 22;
      const lineCount = Math.round(text.getBoundingClientRect().height / lineHeight);
      setFitsRight(lineCount <= MAX_RIGHT_LINES);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(card);
    return () => observer.disconnect();
  }, [hasSupportingText, hasActions]);

  return { fitsRight, cardRef, textColumnRef, badgeRef, measureLinesRef, measureTextRef };
}

type SupportingTextPlacement = "right" | "left";

interface ApplicationCardGroupContextValue {
  placement: SupportingTextPlacement;
  report: (id: string, fitsRight: boolean) => void;
  unregister: (id: string) => void;
}

const ApplicationCardGroupContext = React.createContext<ApplicationCardGroupContextValue | null>(null);

/**
 * Wrap a list of `ApplicationCard`s so they place `supportingText` the same
 * way: if any card's text would need a 3rd line on the right, every card in
 * the group shows it as the left container's 4th row, so one list never
 * mixes both positions. Renders no element of its own. Cards outside a group
 * decide on their own.
 */
function ApplicationCardGroup({ children }: { children: React.ReactNode }) {
  const [fitsById, setFitsById] = React.useState<Record<string, boolean>>({});

  const report = React.useCallback((id: string, fitsRight: boolean) => {
    setFitsById((current) => (current[id] === fitsRight ? current : { ...current, [id]: fitsRight }));
  }, []);
  const unregister = React.useCallback((id: string) => {
    setFitsById((current) => {
      if (!(id in current)) return current;
      const { [id]: _removed, ...rest } = current;
      return rest;
    });
  }, []);

  const placement: SupportingTextPlacement = Object.values(fitsById).every(Boolean) ? "right" : "left";
  const value = React.useMemo(() => ({ placement, report, unregister }), [placement, report, unregister]);

  return <ApplicationCardGroupContext.Provider value={value}>{children}</ApplicationCardGroupContext.Provider>;
}

/** This card's supporting-text position: the group's shared one inside an `ApplicationCardGroup`, else its own fit. */
function useSupportingTextPlacement(hasSupportingText: boolean, hasActions: boolean) {
  const { fitsRight, ...refs } = useSupportingTextFit(hasSupportingText, hasActions);
  const group = React.useContext(ApplicationCardGroupContext);
  const id = React.useId();

  React.useLayoutEffect(() => {
    if (!group || !hasSupportingText) return;
    group.report(id, fitsRight);
  }, [group?.report, id, fitsRight, hasSupportingText]);

  React.useLayoutEffect(() => {
    if (!group || !hasSupportingText) return;
    return () => group.unregister(id);
  }, [group?.unregister, id, hasSupportingText]);

  const placement: SupportingTextPlacement = group ? group.placement : fitsRight ? "right" : "left";
  return { placement, ...refs };
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
  // Figma: every terms part (incl. duration) binds `foreground/foreground`; only the `·` separators are `foreground/muted`.
  // Compensation is semibold (`sm -semibold`); engagement terms and duration are regular.
  const termsParts = [
    { value: compensation, className: "font-semibold" },
    { value: engagementTerms },
    { value: duration },
  ].filter((part) => Boolean(part.value));
  const hasActions = Boolean(actionsMenu || onActionsPress);
  const { placement, cardRef, textColumnRef, badgeRef, measureLinesRef, measureTextRef } =
    useSupportingTextPlacement(Boolean(supportingText), hasActions);

  const termsRow = termsParts.length > 0 && (
    <Typography size="sm" className="flex items-center gap-1 whitespace-nowrap">
      {termsParts.map((part, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span aria-hidden="true" className="text-foreground-muted">
              ·
            </span>
          )}
          <span className={cn("text-foreground", part.className)}>{part.value}</span>
        </React.Fragment>
      ))}
    </Typography>
  );

  return (
    <div
      ref={cardRef}
      data-slot="application-card"
      data-supporting-text-placement={supportingText ? placement : undefined}
      className={cn(
        "group relative flex w-full items-center gap-10 py-4 pr-6 pl-5 transition-colors duration-150 ease-out",
        "hover:bg-hover-row has-[[aria-expanded=true]]:bg-hover-row",
        "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
        className,
      )}
      {...clickableRowProps(rowProps)}
      {...props}
    >
      {/* Figma `Left Container`: with supporting text on the right it sizes to its content (the text takes the rest);
          otherwise it fills the card (Figma's `flex-1`). */}
      <div
        className={cn(
          "flex min-w-0 items-center gap-5",
          supportingText && placement === "right" ? "flex-initial" : "flex-1",
        )}
      >
        <AvatarCompanies company={company} logoSrc={logoSrc} logoAlt={logoAlt} />
        <div ref={textColumnRef} className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
          <div className="flex w-full flex-col items-start gap-0.5">
            {/* Figma groups partner name + title with no gap; the 2px gap sits between that pair and the terms row. */}
            <div className="flex w-full flex-col items-start">
              <Typography size="xs" className="w-full text-foreground-muted">
                {partnerName}
              </Typography>
              <Typography
                as="h3"
                weight="bold"
                className="w-full text-foreground"
              >
                {title}
              </Typography>
            </div>
            {termsRow}
          </div>
          {supportingText && placement === "left" && (
            <Typography size="sm" className="w-full text-foreground-muted">
              {supportingText}
            </Typography>
          )}
        </div>
      </div>
      {/* Figma `Right Container`, content right-aligned. Takes the remaining width (`flex-1`) unless the supporting text
          moved to the left container, where it shrinks to the badge (+ `···` slot) so the left side gets the width. */}
      <div
        className={cn(
          "flex items-center justify-end",
          supportingText && placement === "left" ? "shrink-0" : "min-w-px flex-1",
        )}
      >
        {supportingText && placement === "right" && (
          // Figma `supporting-text-1`: fills the space before the badge, right-aligned, up to 2 lines then an ellipsis.
          <Typography size="sm" className="mr-4 line-clamp-2 min-w-px flex-1 text-right text-foreground-muted">
            {supportingText}
          </Typography>
        )}
        <div ref={badgeRef} className="flex shrink-0">
          <Badge tone={statusTone} label={statusLabel} size="md" />
        </div>
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
      {supportingText && (
        // Hidden measuring copies for `useSupportingTextFit`: the left lines at their natural, unwrapped width, and
        // the supporting text laid out at the width it would get on the right (set by the hook). Zero-size and
        // clipped so they never affect layout or scrolling.
        <div aria-hidden="true" className="pointer-events-none invisible absolute top-0 left-0 size-0 overflow-hidden">
          <div ref={measureLinesRef} className="flex w-max flex-col whitespace-nowrap">
            <Typography size="xs">{partnerName}</Typography>
            <Typography as="div" weight="bold">
              {title}
            </Typography>
            {termsRow}
          </div>
          <Typography ref={measureTextRef} size="sm" as="div">
            {supportingText}
          </Typography>
        </div>
      )}
    </div>
  );
}

export { ApplicationCard, ApplicationCardGroup, type ApplicationCardProps };
