import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button as AriaButton } from "react-aria-components";
import { ArrowDown, ArrowUp } from "@untitledui/icons";

import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { mediaAbove } from "@/lib/breakpoints";
import { standardTransition, useMotionPreference } from "@/lib/motion";
import { Typography } from "@/components/typography";
import { hyperlinkVariants } from "@/components/buttons/hyperlink";
import { NextStepCard, type NextStepCardProps } from "@/components/cards/next-step-card";

/** One row of the grid: the card's fixed 248px height. */
const ROW_HEIGHT = 248;
/**
 * The height wrapper's clip inset (`p-1`, offset by `-m-1`), in px. It gives a hovered card's Lift and a focused
 * card's outline (2px, offset 2px) room inside the `overflow-hidden` wrapper, so neither gets clipped.
 */
const CLIP_INSET = 4;

/** One Next Steps task, as each layout's `NEXT_STEPS` data declares it. */
interface NextStep
  extends Pick<
    NextStepCardProps,
    "variant" | "badgeTone" | "label" | "title" | "description" | "buttonLabel" | "buttonProps" | "dismissible"
  > {
  key: string;
}

interface NextStepsSectionProps {
  /** Every eligible task, in priority order. Pass a stable (module-level) array — see the memo note below. */
  steps: readonly NextStep[];
}

/**
 * The "Next steps" section shared by `Dashboard` and `DashboardEmptyState`:
 * heading, capped-column grid, dismiss, queue-reveal, and View more / View
 * less behavior.
 *
 * Owns all of its own state and is `React.memo`'d so a parent re-render
 * that doesn't change `steps` (e.g. a sidebar collapse/expand) never
 * re-renders the cards. That matters for motion: Motion's `layout`
 * animation runs on every re-render of a `layout` component, so without
 * this isolation a sidebar toggle made the cards spring to their new
 * positions out of step with the page's plain reflow. Isolating by render
 * (rather than gating with `layoutDependency`) keeps the dismiss reflow
 * intact — the remaining cards still glide into the dismissed card's slot
 * once its exit finishes, because `AnimatePresence`'s own removal
 * re-render is what drives that sibling layout animation.
 */
const NextStepsSection = React.memo(function NextStepsSection({ steps }: NextStepsSectionProps) {
  /**
   * Per `product-specs/next-steps-card.md` §2.1, dismissal is immediate with
   * no confirmation step — clicking the X removes the card right away. This
   * reference layout has no backend, so "dismissed" is just local UI state;
   * a real consumer would also persist the dismissal so the task doesn't
   * re-surface on reload (the PRD's only re-surface trigger is the task's
   * requirement level changing, never a page refresh).
   */
  const [dismissedKeys, setDismissedKeys] = React.useState<Set<string>>(new Set());
  const eligibleNextSteps = steps.filter((step) => !dismissedKeys.has(step.key));
  /**
   * The Next Steps grid caps its column count in two tiers — at `lg`
   * (1024px) and below it's 2-up, the `xl` range (1025–1280px) is 3-up, and
   * above `xl` (the `2xl` frame and up) it's the full 4-up (DESIGN.md
   * "Breakpoints include their own width"). Collapsed (the default), it shows
   * one row: any card beyond the current tier's column count is queued and
   * only mounted once a dismiss/completion frees a slot within the row.
   * "View more" expands the grid to every eligible card, wrapping to more
   * rows; "View less" collapses it back to one row
   * (`product-specs/next-steps-card.md` §4.1). The toggle only shows while
   * there are more cards than fit in one row.
   */
  const isLgUp = useMediaQuery(mediaAbove("lg"));
  const isXlUp = useMediaQuery(mediaAbove("xl"));
  const maxVisible = isXlUp ? 4 : isLgUp ? 3 : 2;
  const [expanded, setExpanded] = React.useState(false);
  const hasOverflow = eligibleNextSteps.length > maxVisible;
  const isExpanded = expanded && hasOverflow;
  const visibleNextSteps = isExpanded ? eligibleNextSteps : eligibleNextSteps.slice(0, maxVisible);
  /**
   * Tracks each card's `key` the first time it appears in `visibleNextSteps`
   * — a key already seen mounts as a plain fade-in (or is on true first
   * render, skipped below); a key seen for the first time on a *later*
   * render (i.e. a queued card newly revealed by a slot opening up) mounts
   * with `enterFromRight` instead, so only the actual newly-surfaced card
   * gets the directional entrance, not the whole grid on initial load.
   */
  const seenKeysRef = React.useRef<Set<string> | null>(null);
  if (seenKeysRef.current === null) {
    seenKeysRef.current = new Set(visibleNextSteps.map((step) => step.key));
  }
  const newlyRevealedKeys = new Set(
    visibleNextSteps
      .filter((step) => !seenKeysRef.current!.has(step.key))
      .map((step) => step.key),
  );
  React.useEffect(() => {
    for (const step of visibleNextSteps) {
      seenKeysRef.current!.add(step.key);
    }
  });
  /**
   * Separate from `visibleNextSteps.length === 0` so the "Next steps"
   * section (heading + grid) stays mounted long enough for the last card's
   * exit animation to finish — `AnimatePresence`'s `onExitComplete` flips
   * this only once every exiting card has actually left, rather than the
   * section vanishing mid-animation the instant the last card is filtered
   * out of `visibleNextSteps`.
   */
  const [sectionVisible, setSectionVisible] = React.useState(true);
  const sectionRef = React.useRef<HTMLDivElement>(null);
  /** Set when "View less" is pressed with the section above the viewport; read once the collapse finishes. */
  const scrollAfterCollapseRef = React.useRef(false);
  const { prefersReducedMotion, resolve } = useMotionPreference();

  if (!sectionVisible) return null;

  return (
    <div ref={sectionRef} className="flex w-full flex-col items-start gap-3">
      <div className="flex w-full flex-col items-start gap-0.5">
        <Typography size="xl" weight="semibold">
          Next steps
        </Typography>
        <Typography size="sm" className="text-foreground-muted">
          Complete important tasks and stay ahead of what’s next.
        </Typography>
      </div>
      {/*
        CLAUDE.md "Expand": the grid's height animates between one row and all rows. A documented exception to "prefer
        `layout`" (same reason as `rowDismissVariants`): `layout` doesn't move the sections below, and animating `height`
        to/from `auto` on this wrapper does, so the page grows and shrinks with the grid instead of jumping. On collapse,
        the hidden cards play their own dismiss exit (shorter than this) while the wrapper closes over them.
      */}
      <motion.div
        className="-m-1 w-[calc(100%+8px)] overflow-hidden p-1"
        initial={false}
        animate={{ height: isExpanded ? "auto" : ROW_HEIGHT + CLIP_INSET * 2 }}
        transition={resolve(standardTransition)}
        onAnimationComplete={() => {
          // Collapsing from further down the page leaves the section above the viewport and the reader somewhere
          // below it, so bring the section back into view. This waits for the collapse to finish: a smooth scroll
          // started while the page is still shrinking gets cut short.
          if (scrollAfterCollapseRef.current && !isExpanded) {
            scrollAfterCollapseRef.current = false;
            sectionRef.current?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
          }
        }}
      >
        {/* Figma: 20px column gap, 24px row gap (rows only show once expanded); every row is the card's fixed 248px. */}
        <div className="grid w-full auto-rows-[248px] grid-cols-2 gap-x-5 gap-y-6 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence
            onExitComplete={() => {
              if (eligibleNextSteps.length === 0) {
                setSectionVisible(false);
              }
            }}
          >
            {visibleNextSteps.map(({ key, ...step }) => (
              <NextStepCard
                key={key}
                {...step}
                enterFromRight={newlyRevealedKeys.has(key)}
                onDismiss={
                  step.dismissible
                    ? () => setDismissedKeys((prev) => new Set(prev).add(key))
                    : undefined
                }
              />
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
      {hasOverflow && (
        // A disclosure toggle, not navigation, so it's a button styled as `Hyperlink` (Figma's `Hyperlink` instance).
        <AriaButton
          aria-expanded={isExpanded}
          className={hyperlinkVariants()}
          onPress={() => {
            if (!isExpanded) {
              // Cards revealed by expanding appear in place on their new row. Marking them seen first keeps them
              // from taking the queue's slide-in-from-the-right entrance, which is for a card filling a freed slot.
              for (const step of eligibleNextSteps) seenKeysRef.current!.add(step.key);
            } else {
              scrollAfterCollapseRef.current = (sectionRef.current?.getBoundingClientRect().top ?? 0) < 0;
            }
            setExpanded(!isExpanded);
          }}
        >
          {isExpanded ? "View less" : "View more"}
          {isExpanded ? (
            <ArrowUp className="size-[18px] shrink-0" />
          ) : (
            <ArrowDown className="size-[18px] shrink-0" />
          )}
        </AriaButton>
      )}
    </div>
  );
});

export { NextStepsSection, type NextStep, type NextStepsSectionProps };
