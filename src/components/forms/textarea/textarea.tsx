import * as React from "react";
import {
  Label as AriaLabel,
  Text as AriaText,
  TextArea as AriaTextArea,
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
} from "react-aria-components";

import { cn } from "@/lib/utils";
import { fieldState, fieldTextVariants, fieldVariants } from "@/components/forms/field";

interface TextareaProps extends Omit<AriaTextFieldProps, "children" | "className"> {
  /** Visible label above the field (Figma `Label`). Omit it and pass `aria-label` when the context already names it. */
  label?: React.ReactNode;
  /** Text between the label and the field (Figma `Description`), `sm` muted. */
  description?: React.ReactNode;
  /** Helper line under the field (Figma `Helper text`), `sm` muted. `errorMessage` takes its place while set. */
  hint?: React.ReactNode;
  /** Shown in place of `hint`, in destructive, and turns the field to Figma's Error state. */
  errorMessage?: React.ReactNode;
  placeholder?: string;
  /** Figma `Size`: `md` (`base` text, the default) or `sm` (`sm` text). Sets the one-line starting height too. */
  size?: "sm" | "md";
  /** Visible rows to start with. Default: one, as in Figma; the field grows with its content either way. */
  rows?: number;
  className?: string;
}

/**
 * A multi-line text field. Figma: verita.ds → `Input`, `Type=Textarea` (`node-id=5724-930`): sizes `sm · 36` and
 * `md · 40`, states Default, Hover, HasValue, Focused, Error, Disabled, and Read-only. Built on React Aria's
 * `TextField` with a `TextArea`, so the label, description, hint, and error are wired to it.
 *
 * The box is the `<textarea>` itself, styled with `fieldVariants` (shared with `Input`), so its states match. It starts
 * one line tall like Figma, grows with its content, and can be resized vertically. The resize grip is the browser's
 * own, not Figma's 6px `Resize handle` drawing.
 *
 * The ref goes to the `<textarea>`.
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    label,
    description,
    hint,
    errorMessage,
    placeholder,
    size = "md",
    rows = 1,
    isDisabled,
    isReadOnly,
    isInvalid,
    className,
    ...props
  },
  ref,
) {
  const descriptionId = React.useId();
  const invalid = isInvalid || Boolean(errorMessage);

  return (
    <AriaTextField
      data-slot="textarea"
      data-size={size}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isInvalid={invalid}
      // The description sits above the field, so it's linked by hand; the hint and error use React Aria's own slots.
      aria-describedby={description ? descriptionId : undefined}
      className={cn("flex w-full flex-col items-start gap-1.5", className)}
      {...props}
    >
      {label && <AriaLabel className={fieldTextVariants({ slot: "label" })}>{label}</AriaLabel>}
      {description && (
        <span id={descriptionId} className={fieldTextVariants({ slot: "description" })}>
          {description}
        </span>
      )}
      <AriaTextArea
        ref={ref}
        rows={rows}
        placeholder={placeholder}
        className={cn(
          fieldVariants({ size, state: fieldState({ isDisabled, isReadOnly, isInvalid: invalid }) }),
          "field-sizing-content block resize-y placeholder:text-foreground-muted",
          // A text block isn't centered like `Input`'s line, so sm pads 6px to land one 22px line at 36px.
          size === "sm" ? "py-[6px] text-sm" : "text-base",
          "disabled:resize-none disabled:placeholder:text-foreground-subtle",
        )}
      />
      {errorMessage ? (
        <AriaText slot="errorMessage" className={fieldTextVariants({ slot: "error" })}>
          {errorMessage}
        </AriaText>
      ) : (
        hint && (
          <AriaText slot="description" className={fieldTextVariants({ slot: "hint" })}>
            {hint}
          </AriaText>
        )
      )}
    </AriaTextField>
  );
});

export { Textarea, type TextareaProps };
