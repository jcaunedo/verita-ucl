import * as React from "react";
import { Popover as AriaPopover } from "react-aria-components";

import { cn } from "@/lib/utils";
import { Avatar } from "@/components/data-display/avatar";
import { Tag, TagGroup, TagList } from "@/components/data-display/tag";
import { fieldState, fieldTextVariants, fieldVariants } from "@/components/forms/field";
import { PopoverSurface, selectItemVariants } from "@/components/forms/select";

/** A value the field can suggest as you type, e.g. a connection: picking it adds `value` as a tag, labeled `label`. */
interface TagInputSuggestion {
  /** What becomes the tag's value, e.g. an email address. */
  value: string;
  /** What the option and the tag show, e.g. the person's name. */
  label: string;
  /** Secondary text after the label in the option, e.g. a job title. Searchable. */
  description?: string;
  /** Leading 24px avatar photo in the option. */
  avatarSrc?: string;
  /** Initials avatar background when there's no photo. */
  avatarClassName?: string;
}

/** The most suggestions shown at once. Keep typing to narrow them. */
const MAX_SUGGESTIONS = 6;

/** What splits typed or pasted text into tags by default: commas and line breaks. */
const DEFAULT_DELIMITER = /[,\n]+/;

interface TagInputProps {
  /** Visible label above the field (`sm -medium`). Omit it and pass `aria-label` when the context already names it. */
  label?: React.ReactNode;
  /** An action at the right end of the label row, e.g. a "Preview email" link (Figma `Input` `Label Container`). */
  labelAction?: React.ReactNode;
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
  /** The starting draft text, uncontrolled. Defaults to empty. */
  defaultInputValue?: string;
  /** Called whenever the draft text changes. */
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
  /**
   * Values to suggest while typing (e.g. the professional's connections), matched on label, description, and value.
   * Picking one adds its `value` as a tag showing its `label`. With suggestions, a typed space or delimiter only splits
   * off a tag when the text before it is valid (e.g. an email), so names can be searched with spaces.
   */
  suggestions?: readonly TagInputSuggestion[];
  /** Accessible name for the suggestion list. Default: "Suggestions". */
  suggestionsLabel?: string;
  /** Figma `Size` (from `Input`): `md` (40px, `base` text, the default) or `sm` (36px, `sm` text). Tags stay 24px. */
  size?: "sm" | "md";
  /** No typing and no removing tags; Figma `Input`'s Disabled look. */
  isDisabled?: boolean;
  /** The tags can be read and focused but not changed; Figma `Input`'s Read-only look. */
  isReadOnly?: boolean;
  /** Extra classes for the root element, merged after the component's own. */
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
 * - With `suggestions`: typing opens a list of matches under the field (`SelectContent`'s panel and `SelectItem`'s rows:
 *   avatar, label, muted description), excluding values already added. The first match is highlighted; Up/Down move,
 *   Enter or a click adds it, Escape closes the list (and only the list). The input is an ARIA combobox, so screen
 *   readers announce the highlighted option. The list is portaled, so a clipping parent (e.g. a modal) can't cut it off.
 *   A picked suggestion's tag shows its label and avatar (photo, or first initial on its color).
 *
 * The ref goes to the text input, e.g. to focus it.
 */
const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(function TagInput(
  {
    label,
    labelAction,
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
    suggestions,
    suggestionsLabel = "Suggestions",
    size = "md",
    isDisabled,
    isReadOnly,
    className,
  },
  forwardedRef,
) {
  const inputId = React.useId();
  const helpId = React.useId();
  const listId = React.useId();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const fieldRef = React.useRef<HTMLDivElement>(null);
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

  // Suggestions: the matches for what's typed, minus values already added.
  const [listDismissed, setListDismissed] = React.useState(false);
  const [highlighted, setHighlighted] = React.useState(0);
  const needle = draft.trim().toLowerCase();
  const matches = React.useMemo(
    () =>
      needle && suggestions
        ? suggestions
            .filter((suggestion) => !hasValue(values, suggestion.value))
            .filter((suggestion) =>
              [suggestion.label, suggestion.description ?? "", suggestion.value].some((text) =>
                text.toLowerCase().includes(needle),
              ),
            )
            .slice(0, MAX_SUGGESTIONS)
        : [],
    [needle, suggestions, values],
  );
  const listOpen = matches.length > 0 && !listDismissed && !isDisabled && !isReadOnly;
  const activeIndex = Math.min(highlighted, matches.length - 1);
  const optionId = (index: number) => `${listId}-option-${index}`;
  const suggestionFor = (item: string) => suggestions?.find((suggestion) => suggestion.value === item);
  const labelFor = (item: string) => suggestionFor(item)?.label ?? item;

  const pick = (suggestion: TagInputSuggestion) => {
    setValues([...values, suggestion.value]);
    setDraft("");
    setOwnError(null);
    setHighlighted(0);
    inputRef.current?.focus();
  };

  /** With suggestions, a delimiter only splits when everything before the last one is valid (names keep their spaces). */
  const shouldSplit = (text: string) => {
    const parts = text.split(delimiter);
    if (parts.length < 2) return false;
    if (!suggestions) return true;
    return parts
      .slice(0, -1)
      .map((part) => part.trim())
      .filter(Boolean)
      .every((part) => !validate?.(part));
  };

  const remove = (keys: Set<React.Key>) => {
    const next = values.filter((item) => !keys.has(item));
    setValues(next);
    setOwnError(null);
    // Removing the last tag would leave focus nowhere, so hand it back to the input.
    if (next.length === 0) requestAnimationFrame(() => inputRef.current?.focus());
  };

  return (
    <div data-slot="tag-input" className={cn("flex w-full flex-col items-start gap-1.5", className)}>
      {(label || labelAction) && (
        <div data-slot="tag-input-label" className="flex w-full items-center justify-between gap-4">
          {label && (
            <label htmlFor={inputId} className={fieldTextVariants({ slot: "label" })}>
              {label}
            </label>
          )}
          {labelAction}
        </div>
      )}
      {/* Clicking the field's empty space focuses the input. */}
      <div
        ref={fieldRef}
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
              {values.map((item) => {
                // A picked suggestion (e.g. a connection) keeps its avatar on the tag: the photo, or its initial.
                const suggestion = suggestionFor(item);
                const hasAvatar = Boolean(suggestion?.avatarSrc || suggestion?.avatarClassName);
                return (
                  <Tag
                    key={item}
                    id={item}
                    textValue={labelFor(item)}
                    avatarSrc={suggestion?.avatarSrc}
                    avatarInitials={hasAvatar && suggestion ? initialsOf(suggestion.label) : undefined}
                    avatarClassName={suggestion?.avatarClassName}
                  >
                    {labelFor(item)}
                  </Tag>
                );
              })}
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
          {...(suggestions && {
            role: "combobox",
            "aria-autocomplete": "list" as const,
            "aria-expanded": listOpen,
            "aria-controls": listOpen ? listId : undefined,
            "aria-activedescendant": listOpen ? optionId(activeIndex) : undefined,
          })}
          onChange={(event) => {
            const next = event.target.value;
            setListDismissed(false);
            setHighlighted(0);
            // A delimiter typed (or autocompleted) splits off the values before it.
            if (shouldSplit(next)) add(next, { showError: true });
            else {
              setDraft(next);
              setOwnError(null);
            }
          }}
          onKeyDown={(event) => {
            inputProps?.onKeyDown?.(event);
            if (isReadOnly) return;
            if (listOpen && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
              event.preventDefault();
              const step = event.key === "ArrowDown" ? 1 : -1;
              setHighlighted((activeIndex + step + matches.length) % matches.length);
            } else if (listOpen && event.key === "Escape") {
              // Close the list only, not a surrounding modal.
              event.preventDefault();
              event.stopPropagation();
              setListDismissed(true);
            } else if (event.key === "Enter") {
              event.preventDefault();
              if (listOpen) pick(matches[activeIndex]);
              else add(draft, { showError: true });
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
      {suggestions && (
        <AriaPopover
          triggerRef={fieldRef}
          isOpen={listOpen}
          onOpenChange={(open) => !open && setListDismissed(true)}
          isNonModal
          placement="bottom start"
          offset={4}
        >
          {({ placement }) => (
            <PopoverSurface placement={placement} className="w-(--trigger-width)">
              <div id={listId} role="listbox" aria-label={suggestionsLabel} className="flex flex-col gap-0.5">
                {matches.map((suggestion, index) => (
                  <div
                    key={suggestion.value}
                    id={optionId(index)}
                    role="option"
                    aria-selected={index === activeIndex}
                    data-focused={index === activeIndex || undefined}
                    data-slot="tag-input-option"
                    // Keep focus in the input while picking.
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => setHighlighted(index)}
                    onClick={() => pick(suggestion)}
                    className={selectItemVariants({ size: "sm" })}
                  >
                    {(suggestion.avatarSrc || suggestion.avatarClassName) && (
                      <Avatar
                        src={suggestion.avatarSrc}
                        alt=""
                        initials={initialsOf(suggestion.label)}
                        className={cn("shrink-0", suggestion.avatarClassName)}
                      />
                    )}
                    <span className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden whitespace-nowrap">
                      <span className="shrink-0">{suggestion.label}</span>
                      {suggestion.description && (
                        <span className="min-w-0 flex-1 truncate font-normal text-foreground-subtle">
                          {suggestion.description}
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </PopoverSurface>
          )}
        </AriaPopover>
      )}
      {(hint || error) && (
        <span id={helpId} aria-live="polite" className={fieldTextVariants({ slot: error ? "error" : "hint" })}>
          {error ?? hint}
        </span>
      )}
    </div>
  );
});

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export { TagInput, type TagInputProps, type TagInputSuggestion };
