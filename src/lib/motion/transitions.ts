import type { Transition } from "motion/react";

import { motionDuration } from "./tokens";

/**
 * Named `Transition` presets. CLAUDE.md "Easing" — pick by interaction
 * intent, not by how the curve looks in isolation.
 */

/** Common UI transitions: smooth accel, controlled decel, no overshoot. */
const standardTransition: Transition = {
	duration: motionDuration.normal,
	ease: [0.4, 0, 0.2, 1],
};

/** Elements entering the interface: quick start, gentle finish. */
const enterTransition: Transition = {
	duration: motionDuration.slow,
	ease: [0.16, 1, 0.3, 1],
};

/** Elements leaving the interface: shorter than enter, decisive. */
const exitTransition: Transition = {
	duration: motionDuration.fast,
	ease: [0.4, 0, 1, 1],
};

/**
 * Spring presets. CLAUDE.md "Spring" — direct manipulation, drag, press,
 * shared-element movement, responsive layout changes. Deliberately
 * non-bouncy (high damping) per the brand's "Calm/Refined" personality.
 */

/** Small, contained motion (press feedback, tab indicators). */
const subtleSpring: Transition = {
	type: "spring",
	stiffness: 400,
	damping: 32,
};

/** Direct-manipulation feedback that should feel snappy (hover/press). */
const responsiveSpring: Transition = {
	type: "spring",
	stiffness: 500,
	damping: 30,
};

/** Layout/shared-element transitions (Motion `layout`/`layoutId`). */
const layoutSpring: Transition = {
	type: "spring",
	stiffness: 350,
	damping: 35,
};

/**
 * Content reflowing into space freed by a removal (e.g. the page below a
 * dismissed section gliding up). Deliberately slow and gentle — the move is
 * large (a whole section's height), so the `standardTransition` curve over
 * `motionDuration.slow` keeps it calm instead of a fast, harsh jump. Runs
 * after the dismissed element's own (short) exit.
 */
const reflowTransition: Transition = {
	duration: motionDuration.slow,
	ease: [0.4, 0, 0.2, 1],
};

export {
	standardTransition,
	enterTransition,
	exitTransition,
	subtleSpring,
	responsiveSpring,
	layoutSpring,
	reflowTransition,
};
