import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * `tailwind-merge` taught this repo's component radius roles (`theme.css`
 * "Component-specific radius roles"). Without them it doesn't recognize e.g.
 * `rounded-select-content` as a radius, so a `className` override like
 * `rounded-3xl` would be kept alongside it instead of replacing it, and
 * whichever rule the stylesheet emits last would win. Add new roles here
 * when they're added to `theme.css`.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      radius: [
        "base",
        "card",
        "input",
        "popover",
        "modal",
        "chip",
        "badge",
        "pill",
        "select-item",
        "select-content",
        "button-xs",
        "button-sm",
        "button-md",
        "button-lg",
        "button-xl",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
