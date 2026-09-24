import * as React from "react";
import { AnimatePresence } from "motion/react";

import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { Typography } from "@/components/typography";
import { NextStepCard, type NextStepCardProps } from "@/components/cards/next-step-card";

/** One Next Steps task, as each layout's `NEXT_STEPS` data declares it. */
interface NextStep
  extends Pick<
    NextStepCardProps,
    "badgeTone" | "label" | "title" | "description" | "buttonLabel" | "buttonProps" | "dismissible"
  > {
  key: string;
}

interface NextStepsSectionProps {
  /** Every eligible task, in priority order. Pass a stable (module-level) array — see the memo note below. */
  steps: readonly NextStep[];
}

/**
 * The "Next steps" section shared by `Dashboard` and `DashboardEmptyState`:
 * heading, capped-column grid, dismiss, and queue-reveal behavior.
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
   * The Next Steps grid caps its column count in two tiers — below `xl`
   * (1280px) it's 2-up, from `xl` to below `2xl` (1536px) it's 3-up, and at
   * `2xl`+ it's the full 4-up. Rather than wrapping the overflow to a second
   * row, any card beyond the current tier's column count is queued and only
   * mounted once a dismiss/completion frees a slot within the visible tier.
   */
  const isXlUp = useMediaQuery("(min-width: 1280px)");
  const is2xlUp = useMediaQuery("(min-width: 1536px)");
  const maxVisible = is2xlUp ? Infinity : isXlUp ? 3 : 2;
  const visibleNextSteps = eligibleNextSteps.slice(0, maxVisible);
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

  if (!sectionVisible) return null;

  return (
    <div className="flex w-full flex-col items-start gap-3">
      <div className="flex w-full flex-col items-start gap-0.5">
        <Typography size="lg" weight="bold" className="leading-6.5">
          Next steps
        </Typography>
        <Typography size="sm" className="text-foreground-muted">
          Complete these to unlock more opportunities and improve your matches.
        </Typography>
      </div>
      <div className="grid h-[248px] w-full grid-cols-2 gap-5 xl:grid-cols-3 2xl:grid-cols-4">
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
    </div>
  );
});

export { NextStepsSection, type NextStep, type NextStepsSectionProps };
