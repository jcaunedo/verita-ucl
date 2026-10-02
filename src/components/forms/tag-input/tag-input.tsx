import * as React from "react";

import { cn } from "@/lib/utils";
import { Tag, TagGroup, TagList } from "@/components/data-display/tag";
import { fieldState, fieldTextVariants, fieldVariants } from "@/components/forms/field";

/** What splits typed or pasted text into tags by default: commas and line breaks. */
const DEFAULT_DELIMITER = /[,\n]+/;

interface TagInputProps {
  /** Visible label above the field (`sm -medium`). Omit it and pass `aria-label` when the context already names it. */
  label?: React.ReactNode;
  /** Accessible name for the input when there's no visible `label`. */
  "aria-label"?: string;
  /** Helper line under the field (`sm`, muted). An error message takes its place while there is one. */
  hint?: React.ReactNode;
  /** Shown only while there are no tags. */
  placeholder?: string;
  /** The tags, controlled. Pair with `onChange`. */
  value?: string[];
  /** The starting tags when uncontrolled. */
  defaultValue?: string[];
  /** Called with the new list whenever a tag is added or removed. */
  onChange?: (value: string[]) => void;
  /** The text typed but not yet turned into a tag, controlled. Pair with `onInputChange`. */
  inputValue?: string;
  defaultInputValue?: string;
  onInputChange?: (inputValue: string) => void;
  /** Returns an error message when a value can't become a tag, or nothing when it can. Default: anything goes. */
  validate?: (value: string) => string | null | undefined;
  /** Shown when the typed value is already a tag (compared ignoring case). */
  duplicateMessage?: string;
  /** What splits typed or pasted text into several tags. Enter always adds the typed value. Default: comma, line break. */
  delimiter?: RegExp;
  /** An error from outside the field, e.g. on submit. Takes precedence over the field's own validation message. */
  errorMessage?: string;
  /** Accessible name for the list of tags. Defaults to the label when it's a string. */
  tagsLabel?: string;
  /** Extra attributes for the text input, e.g. `inputMode`, `autoComplete`, `name`. */
  inputProps?: Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "defaultValue" | "onChange" | "placeholder" | "id" | "aria-invalid" | "aria-describedby"
  >;
  /** Figma `Size` (from `Input`): `md` (40px, `base` text, the default) or `sm` (36px, `sm` text). Tags stay 24px. */
  size?: "sm" | "md";
  /** No typing and no removing tags; Figma `Input`'s Disabled look. */
  isDisabled?: boolean;
  /** The tags can be read and focused but not changed; Figma `Input`'s Read-only look. */
  isReadOnly?: boolean;
  className?: string;
}

/** Controlled when `value` is passed, uncontrolled otherwise, like React Aria's own `value`/`defaultValue`. */
function useControllableState<T>(value: T | undefined, defaultValue: T, onChange?: (next: T) => void) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const current = value !== undefined ? value : uncontrolled;
  const set = (next: T) => {
    if (value === undefined) setUncontrolled(next);
    onChange?.(next);
  };
  return [current, set] as const;
}

const hasValue = (values: string[], value: string) =>
  values.some((existing) => existing.toLowerCase() === value.toLowerCase());

/**
 * A text field that turns what you type into removable tags: Untitled UI's Tag input pattern, built from `Tag`,
 * `TagGroup`, and `TagList` on the shared field box (`fieldVariants`, as `Input`). Empty, it keeps `Input`'s 14px left and
 * right padding, so the placeholder lines up with other fields; once it holds tags, the padding drops to 8px so the
 * tags sit evenly in the box (design direction, 2026-10-02). Its states follow Figma `Input`: Hover darkens the border, Focused
 * (the input or a tag) is the 2px `input/ring` border, Error is destructive, and Disabled and Read-only fill it
 * `tone-neutral-subtle` and drop the tags' ×. The tags and the input share the field and wrap together, so the field
 * grows a row at a time instead of scrolling sideways.
 *
 * - Enter, or typing a `delimiter` (comma by default), turns the typed text into a tag. Pasting several values adds one
 *   tag each. Leaving the field keeps a valid value as a tag.
 * - A value `validate` rejects, or one that's already a tag, isn't added: the field turns destructive and the message
 *   replaces `hint`. A rejected value stays in the input so it can be fixed; repeats in a paste are skipped.
 * - Backspace in the empty input removes the last tag. Arrow keys move between tags and Backspace/Delete removes the
 *   focused one (React Aria `TagGroup`); each tag's × removes it too. Removing the last tag returns focus to the input.
 * - Enter never submits the surrounding form, so a second Enter can't send by accident.
 *
 * The ref goes to the text input, e.g. to focus it.
 */
const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(function TagInput(
  {
    label,
    "aria-label": ariaLabel,
    hint,
    placeholder,
    value,
    defaultValue = [],
    onChange,
    inputValue,
    defaultInputValue = "",
    onInputChange,
    validate,
    duplicateMessage = "Already added",
    delimiter = DEFAULT_DELIMITER,
    errorMessage,
    tagsLabel,
    inputProps,
    size = "md",
    isDisabled,
    isReadOnly,
    className,
  },
  forwardedRef,
) {
  const inputId = React.useId();
  const helpId = React.useId();
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useImperativeHandle(forwardedRef, () => inputRef.current as HTMLInputElement);

  const [values, setValues] = useControllableState(value, defaultValue, onChange);
  const [draft, setDraft] = useControllableState(inputValue, defaultInputValue, onInputChange);
  const [ownError, setOwnError] = React.useState<string | null>(null);
  const error = errorMessage ?? ownError;

  const split = (text: string) =>
    text
      .split(delimiter)
      .map((part) => part.trim())
      .filter(Boolean);

  /**
   * Adds every valid, new value in `parts` as a tag. Rejected values stay in the input. A single typed repeat stays
   * too, with `duplicateMessage`; repeats among several pasted values are just skipped.
   */
  const addParts = (parts: string[], { showError }: { showError: boolean }) => {
    if (parts.length === 0) return;
    const next = [...values];
    const rejected: string[] = [];
    let message: string | null = null;
    for (const part of parts) {
      const invalid = validate?.(part);
      if (invalid) {
        rejected.push(part);
        message ??= invalid;
      } else if (hasValue(next, part)) {
        if (parts.length === 1) {
          rejected.push(part);
          message ??= duplicateMessage;
        }
      } else next.push(part);
    }
    if (next.length !== values.length) setValues(next);
    setDraft(rejected.join(", "));
    // Leaving the field (`showError: false`) never adds a message, but keeps one that's still true.
    if (showError || rejected.length === 0) setOwnError(showError ? message : null);
  };
  const add = (text: string, options: { showError: boolean }) => addParts(split(text), options);

  const remove = (keys: Set<React.Key>) => {
    const next = values.filter((item) => !keys.has(item));
    setValues(next);
    setOwnError(null);
    // Removing the last tag would leave focus nowhere, so hand it back to the input.
    if (next.length === 0) requestAnimationFrame(() => inputRef.current?.focus());
  };

  return (
    <div data-slot="tag-input" className={cn("flex w-full flex-col items-start gap-1.5", className)}>
      {label && (
        <label htmlFor={inputId} className={fieldTextVariants({ slot: "label" })}>
          {label}
        </label>
      )}
      {/* Clicking the field's empty space focuses the input. */}
      <div
        data-slot="tag-input-field"
        data-invalid={error ? true : undefined}
        onMouseDown={(event) => {
          if (event.target !== event.currentTarget || isDisabled) return;
          event.preventDefault();
          inputRef.current?.focus();
        }}
        className={cn(
          fieldVariants({ size, state: fieldState({ isDisabled, isReadOnly, isInvalid: Boolean(error) }) }),
          // Tags and the input wrap together, 4px apart. 14px in from each side (`fieldVariants`) while empty, 8px with tags.
          "flex-wrap gap-1",
          values.length > 0 && "px-2",
        )}
      >
        {values.length > 0 && (
          // `contents` lets each tag wrap in the field's own row, so the input sits right after the last tag.
          <TagGroup
            aria-label={tagsLabel ?? (typeof label === "string" ? label : ariaLabel)}
            onRemove={isDisabled || isReadOnly ? undefined : remove}
            className="contents"
          >
            <TagList className="contents">
              {values.map((item) => (
                <Tag key={item} id={item}>
                  {item}
                </Tag>
              ))}
            </TagList>
          </TagGroup>
        )}
        <input
          type="text"
          {...inputProps}
          ref={inputRef}
          id={inputId}
          disabled={isDisabled}
          readOnly={isReadOnly}
          aria-label={label ? undefined : ariaLabel}
          value={draft}
          onChange={(event) => {
            const next = event.target.value;
            // A delimiter typed (or autocompleted) splits off the values before it.
            if (next.split(delimiter).length > 1) add(next, { showError: true });
            else {
              setDraft(next);
              setOwnError(null);
            }
          }}
          onKeyDown={(event) => {
            inputProps?.onKeyDown?.(event);
            if (isReadOnly) return;
            if (event.key === "Enter") {
              event.preventDefault();
              add(draft, { showError: true });
            } else if (event.key === "Backspace" && draft === "" && values.length > 0) {
              event.preventDefault();
              setValues(values.slice(0, -1));
              setOwnError(null);
            }
          }}
          onPaste={(event) => {
            inputProps?.onPaste?.(event);
            if (isReadOnly) return;
            const text = event.clipboardData.getData("text");
            if (split(text).length < 2) return;
            event.preventDefault();
            const { selectionStart, selectionEnd } = event.currentTarget;
            const start = selectionStart ?? draft.length;
            const end = selectionEnd ?? draft.length;
            // What's typed before and after the caret stays separate from the pasted values.
            addParts([...split(draft.slice(0, start)), ...split(text), ...split(draft.slice(end))], {
              showError: true,
            });
          }}
          onBlur={(event) => {
            inputProps?.onBlur?.(event);
            add(draft, { showError: false });
          }}
          placeholder={values.length === 0 ? placeholder : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={hint || error ? helpId : undefined}
          className={cn(
            "h-6 min-w-30 flex-1 bg-transparent text-foreground outline-none placeholder:text-foreground-muted",
            size === "sm" ? "text-sm" : "text-base",
            "disabled:placeholder:text-foreground-subtle",
          )}
        />
      </div>
      {(hint || error) && (
        <span id={helpId} aria-live="polite" className={fieldTextVariants({ slot: error ? "error" : "hint" })}>
          {error ?? hint}
        </span>
      )}
    </div>
  );
});

export { TagInput, type TagInputProps };
