import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { typographyVariants } from "@/components/typography";

/**
 * The bordered box every text-entry field shares: `Input`, `Textarea`, `SelectTrigger`, and `TagInput`. Figma:
 * verita.ds → `Input` (`node-id=5724-930`), the `Input Field` / `Textarea Field` layer. One place for the look, so the
 * four fields can't drift apart.
 *
 * - Fill `background/default`, 1px `border/neutral/border`, `radius/input` (8px), `shadow/Input`, 14px left and right
 *   padding, 8px between its parts.
 * - `size` (Figma `Size`): `md · 40` and `sm · 36`. The text size lives on the control itself (`base` / `sm`).
 * - `state` (Figma `State`), set from the field's props; Hover and Focused are CSS:
 *   - Default: Hover darkens the border to `border/neutral/border-dark`. Focused is a 2px `input/ring` border, drawn as
 *     the 1px border plus a 1px inset ring so nothing moves (same as `SearchField`).
 *   - `invalid` (Error): 1px `tone/destructive` border; focused, the inset ring is destructive too.
 *   - `disabled`: `tone-neutral-subtle` fill, `border/neutral/border-soft`, no shadow.
 *   - `readonly` (Read-only): looks like Disabled, but keeps the focus border so keyboard users can see where they are
 *     (Figma has no focused Read-only state).
 * - Default and HasValue share the box; only the text color differs (placeholder `foreground/muted`, value
 *   `foreground`), which is the control's job.
 */
const fieldVariants = cva("flex w-full items-center gap-2 rounded-input border px-3.5 text-foreground outline-none", {
  variants: {
    size: {
      // Figma's md box measures 38px (24px line + 7px padding, stroke inside); 40px matches its `md · 40` name and Button md.
      md: "min-h-10 py-[7px]",
      // 36px. 5px padding keeps a 24px row (e.g. `Tag`s) at 36px; a single line of `sm` text is centered.
      sm: "min-h-9 py-[5px]",
    },
    state: {
      default: [
        "border-border bg-background shadow-input",
        "hover:not-focus-within:border-border-dark",
        "focus-within:border-input-ring focus-within:inset-ring-1 focus-within:inset-ring-input-ring",
      ],
      invalid: [
        "border-tone-destructive bg-background shadow-input",
        "focus-within:inset-ring-1 focus-within:inset-ring-tone-destructive",
      ],
      disabled: "border-border-soft bg-tone-neutral-subtle text-foreground-subtle",
      readonly: [
        "border-border-soft bg-tone-neutral-subtle",
        "focus-within:border-input-ring focus-within:inset-ring-1 focus-within:inset-ring-input-ring",
      ],
    },
  },
  defaultVariants: { size: "md", state: "default" },
});

type FieldState = NonNullable<VariantProps<typeof fieldVariants>["state"]>;

/** The `state` for `fieldVariants` from a field's props. Disabled wins, then read-only, then invalid. */
function fieldState({
  isDisabled,
  isReadOnly,
  isInvalid,
}: {
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
}): FieldState {
  if (isDisabled) return "disabled";
  if (isReadOnly) return "readonly";
  if (isInvalid) return "invalid";
  return "default";
}

/**
 * The text around a field (Figma: `Label`, `Description`, `Helper text`): label in `sm -medium`, description and hint
 * in `sm` muted, and the error in `sm` destructive, replacing the hint.
 */
const fieldTextVariants = cva("", {
  variants: {
    slot: {
      label: typographyVariants({ size: "sm", weight: "medium" }),
      description: cn(typographyVariants({ size: "sm" }), "text-foreground-muted"),
      hint: cn(typographyVariants({ size: "sm" }), "text-foreground-muted"),
      error: cn(typographyVariants({ size: "sm" }), "text-tone-destructive"),
    },
  },
});

/** Matches `Button`/`SelectItem`'s icon-prop contract: an icon component (sized and colored here) or a rendered element. */
type FieldIconProp =
  React.FC<{ className?: string; "aria-hidden"?: React.AriaAttributes["aria-hidden"] }> | React.ReactNode;

/**
 * A field's 16px icon (Figma `iconLeft`/`iconRight`): `icon/foreground`, or `icon/subtle` while disabled. Pass
 * `className` to override the color (e.g. the Dropdown chevron's `icon/subtle`).
 */
function FieldIcon({ icon, isDisabled, className }: { icon: FieldIconProp; isDisabled?: boolean; className?: string }) {
  if (typeof icon !== "function") return <>{icon}</>;
  const Icon = icon;
  return (
    <Icon
      aria-hidden="true"
      className={cn("size-4 shrink-0", isDisabled ? "text-icon-subtle" : "text-icon-foreground", className)}
    />
  );
}

export { fieldVariants, fieldTextVariants, fieldState, FieldIcon, type FieldState, type FieldIconProp };
