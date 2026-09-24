import type { Variants } from "motion/react";

import { motionDistance, motionScale, motionStagger } from "./tokens";
import { enterTransition, exitTransition, standardTransition } from "./transitions";

/**
 * Reusable `Variants` for `initial`/`animate`/`exit`. Named after the
 * CLAUDE.md "Motion Vocabulary" — use these before inventing a new variant.
 * Each expects the component to also pass the matching transition (or
 * relies on the one embedded below where the pattern is direction-neutral).
 */

/** Plain opacity fade — no movement. Crossfades, simple mount/unmount. */
const fadeVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: standardTransition },
  exit: { opacity: 0, transition: exitTransition },
};

/** Content appearing in context: fade + small upward move. CLAUDE.md "Reveal". */
const revealVariants: Variants = {
  initial: { opacity: 0, y: motionDistance.subtle },
  animate: { opacity: 1, y: 0, transition: enterTransition },
  exit: { opacity: 0, y: motionDistance.subtle, transition: exitTransition },
};

/** Content being removed/closed: shorter than its entrance. CLAUDE.md "Dismiss". */
const dismissVariants: Variants = {
  initial: { opacity: 1, y: 0 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: motionDistance.hover, transition: exitTransition },
};

/**
 * A whole card/surface leaving the layout entirely (e.g. a dismissed
 * checklist card) — fade + soft scale-down, no directional movement (unlike
 * `dismissVariants`' downward slide, which suits a smaller toast/notification
 * rather than a card that's simply disappearing from a grid).
 */
const cardDismissVariants: Variants = {
  initial: { opacity: 1, scale: 1 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: motionScale.dismiss, transition: exitTransition },
};

/**
 * Same exit as `cardDismissVariants` (fade + soft scale-down), but enters
 * with a fade + slide in from the right (CLAUDE.md "Glide") instead of
 * appearing in place — for a card that's newly revealed by a queue shifting
 * (e.g. a hidden 4th card taking a slot vacated by a dismissed one), where
 * the arrival should read as "sliding into the row" rather than an
 * unrelated existing card animating out. Exit stays the same regardless of
 * cause (dismissal), since a card is never simultaneously entering and
 * being dismissed.
 */
const cardEnterFromRightVariants: Variants = {
  initial: { opacity: 0, x: motionDistance.medium, scale: 1 },
  animate: { opacity: 1, x: 0, scale: 1, transition: enterTransition },
  exit: { opacity: 0, x: 0, scale: motionScale.dismiss, transition: exitTransition },
};

/**
 * Menu/dropdown/select content entering near its trigger — CLAUDE.md
 * "Menus and Dropdowns": short fade, a controlled scale from
 * `motionScale.popIn` (0.98) to 1, and a small move away from the trigger.
 * `custom` is the popover's resolved placement side so the movement follows
 * it: `"bottom"` (the default) starts slightly above and settles down,
 * `"top"` starts slightly below. Pair with `transformOrigin` on the
 * trigger-facing edge so the scale grows out of the trigger.
 */
const popoverVariants: Variants = {
  initial: (side: "top" | "bottom" = "bottom") => ({
    opacity: 0,
    scale: motionScale.popIn,
    y: side === "top" ? motionDistance.hover : -motionDistance.hover,
  }),
  animate: { opacity: 1, scale: 1, y: 0, transition: standardTransition },
  exit: { opacity: 0, scale: motionScale.popIn, transition: exitTransition },
};

/**
 * The sidebar account menu's entrance: a fade plus a `motionDistance.small`
 * (12px) slide up from below, on `standardTransition` — more pronounced than
 * `popoverVariants`' 3px nudge because the menu opens over its trigger at the
 * bottom of the screen and should read as rising out of it. No scale: the
 * slide already carries the arrival. Exit is a plain fade.
 */
const accountMenuVariants: Variants = {
  initial: { opacity: 0, y: motionDistance.small },
  animate: { opacity: 1, y: 0, transition: standardTransition },
  exit: { opacity: 0, transition: exitTransition },
};

/**
 * Overlay/scrim backdrop for dialogs and overlays (fade only — the dialog
 * surface itself should use `panelVariants` or a Motion `layout` animation).
 */
const overlayVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: standardTransition },
  exit: { opacity: 0, transition: exitTransition },
};

/**
 * Drawer/panel surface sliding in from an edge. Callers should set the
 * appropriate axis before spreading — this default assumes a right-edge
 * panel (matching most drawer usage); pass a custom `initial`/`exit` `x`/`y`
 * for other edges rather than forking this variant.
 */
const panelVariants: Variants = {
  initial: { opacity: 0, x: motionDistance.medium },
  animate: { opacity: 1, x: 0, transition: standardTransition },
  exit: { opacity: 0, x: motionDistance.medium, transition: exitTransition },
};

/**
 * Directional screen/section transition. CLAUDE.md "Glide" — match the
 * direction of navigation: pass `custom={1}` to slide in from the right
 * (the "forward"/push case, e.g. navigating into a sub-page) or
 * `custom={-1}` to slide in from the left ("back"/pop, e.g. returning to a
 * parent screen). The outgoing screen continues in the *same* direction
 * the incoming screen is heading, so the pair reads as one continuous
 * strip sliding through rather than converging on the same side.
 *
 * Unlike `glidePattern` (a gesture-prop bundle with no transition of its
 * own), this is `Variants`-shaped for `AnimatePresence` mount/unmount and
 * uses `enterTransition`/`exitTransition` like the rest of this file. Each
 * key is a function of Motion's `custom` prop (not a `direction` argument
 * called ahead of time) — this matters for `AnimatePresence`: an exiting
 * element's `custom` is snapshotted at the moment it's removed, so its
 * `exit` animation stays correct even if the direction state driving new
 * renders has already changed by the time the exit plays out. Usage:
 * `<motion.div custom={direction} variants={slideVariants} ... />`.
 */
const slideVariants: Variants = {
  initial: (direction: 1 | -1 = 1) => ({
    opacity: 0,
    x: direction * motionDistance.medium,
  }),
  animate: { opacity: 1, x: 0, transition: enterTransition },
  exit: (direction: 1 | -1 = 1) => ({
    opacity: 0,
    x: -direction * motionDistance.medium,
    transition: exitTransition,
  }),
};

/**
 * Stagger container for the Flow pattern — small groups of related items
 * entering together. Apply to the parent; children should use
 * `revealVariants` (or similar) and inherit timing via variant propagation.
 */
const staggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: motionStagger.fast,
      delayChildren: 0,
    },
  },
};

export {
  fadeVariants,
  revealVariants,
  dismissVariants,
  cardDismissVariants,
  cardEnterFromRightVariants,
  overlayVariants,
  popoverVariants,
  accountMenuVariants,
  panelVariants,
  slideVariants,
  staggerContainerVariants,
};
