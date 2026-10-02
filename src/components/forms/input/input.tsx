import * as React from "react";
import {
  Input as AriaInput,
  Label as AriaLabel,
  Text as AriaText,
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
} from "react-aria-components";

import { cn } from "@/lib/utils";
import { FieldIcon, fieldState, fieldTextVariants, fieldVariants, type FieldIconProp } from "@/components/forms/field";

interface InputProps extends Omit<AriaTextFieldProps, "children" | "className"> {
  /** Visible label above the field (Figma `Label`). Omit it and pass `aria-label` when the context already names it. */
  label?: React.ReactNode;
  /** Text between the label and the field (Figma `Description`), `sm` muted. */
  description?: React.ReactNode;
  /** Helper line under the field (Figma `Helper text`), `sm` muted. `errorMessage` takes its place while set. */
  hint?: React.ReactNode;
  /** Shown in place of `hint`, in destructive, and turns the field to Figma's Error state. */
  errorMessage?: React.ReactNode;
  placeholder?: string;
  /** Figma `Size`: `md` (40px, `base` text, the default) or `sm` (36px, `sm` text). */
  size?: "sm" | "md";
  /** 16px icon before the text (Figma `iconLeft`). An icon component (sized and colored here) or a rendered element. */
  iconLeading?: FieldIconProp;
  /** 16px icon after the text (Figma `iconRight`). */
  iconTrailing?: FieldIconProp;
  /** Muted text after the value, e.g. a unit (Figma `Suffix`). */
  suffix?: React.ReactNode;
  className?: string;
}

/**
 * A single-line text field. Figma: verita.ds → `Input`, `Type=Textfield` (`node-id=5724-930`): sizes `sm · 36` and
 * `md · 40`, states Default, Hover, HasValue, Focused, Error, Disabled, and Read-only. Built on React Aria's
 * `TextField`, so the label, description, hint, and error are wired to the input for screen readers.
 *
 * The box comes from `fieldVariants` (shared with `Textarea`, `SelectTrigger`, and `TagInput`). Text is `foreground`
 * with a `foreground/muted` placeholder (Default vs. HasValue), `foreground/subtle` while disabled. Clicking the box
 * around the text (e.g. beside an icon) focuses the input.
 *
 * The ref goes to the `<input>`.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    description,
    hint,
    errorMessage,
    placeholder,
    size = "md",
    iconLeading,
    iconTrailing,
    suffix,
    isDisabled,
    isReadOnly,
    isInvalid,
    className,
    ...props
  },
  forwardedRef,
) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useImperativeHandle(forwardedRef, () => inputRef.current as HTMLInputElement);
  const descriptionId = React.useId();
  const invalid = isInvalid || Boolean(errorMessage);

  return (
    <AriaTextField
      data-slot="input"
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
      <div
        data-slot="input-field"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget && !isDisabled) {
            event.preventDefault();
            inputRef.current?.focus();
          }
        }}
        className={fieldVariants({ size, state: fieldState({ isDisabled, isReadOnly, isInvalid: invalid }) })}
      >
        {iconLeading && <FieldIcon icon={iconLeading} isDisabled={isDisabled} />}
        <AriaInput
          ref={inputRef}
          placeholder={placeholder}
          className={cn(
            "min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-foreground-muted",
            size === "sm" ? "text-sm" : "text-base",
            "disabled:text-foreground-subtle disabled:placeholder:text-foreground-subtle",
          )}
        />
        {suffix && (
          <span className={cn("shrink-0 text-foreground-muted", size === "sm" ? "text-sm" : "text-base")}>
            {suffix}
          </span>
        )}
        {iconTrailing && <FieldIcon icon={iconTrailing} isDisabled={isDisabled} />}
      </div>
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

export { Input, type InputProps };
