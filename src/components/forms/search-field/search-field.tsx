import * as React from "react";
import {
  Button as AriaButton,
  Input as AriaInput,
  SearchField as AriaSearchField,
  type SearchFieldProps as AriaSearchFieldProps,
} from "react-aria-components";
import { motion } from "motion/react";
import { SearchMd, XClose } from "@untitledui/icons";

import { cn } from "@/lib/utils";
import { exitTransition, standardTransition, useMotionPreference } from "@/lib/motion";

/** Figma `Input` (search) collapsed: 14px padding + 16px icon + 14px padding. */
const COLLAPSED_WIDTH = 44;
/** Figma `Input` (search) focused/filled width. */
const EXPANDED_WIDTH = 240;

interface SearchFieldProps extends Omit<AriaSearchFieldProps, "children" | "className" | "style"> {
  /** Accessible name for the field, and for the collapsed button that opens it (e.g. "Search applications"). */
  "aria-label": string;
  /** Placeholder text. Figma shows none, so it defaults to none. */
  placeholder?: string;
  /**
   * `true` (default): starts as a 44px search button and expands to 240px when pressed; it collapses again when focus
   * leaves it while empty, or on Escape when empty. `false`: always expanded (width from `className`, default 240px).
   */
  collapsible?: boolean;
  className?: string;
}

/**
 * A search input that can collapse to an icon button. Figma: verita.ds `Input` instances — Default
 * (`node-id=6035-1175`, collapsed), Focus (`6035-1166`), and Dirty (`6036-1189`, with the clear icon).
 *
 * Built on React Aria's `SearchField`: search-input semantics, the clear button, and Escape-to-clear come from it.
 * Expanding animates the pill's `width` directly (not a `layout` scale), so the fully rounded corners stay round the
 * whole way; collapse is shorter than expand, per the Motion System. Under reduced motion it resizes instantly.
 *
 * The 2px focused border is a 1px border plus a 1px inset ring (Figma: `input/ring`), so the content doesn't shift
 * when focus arrives.
 */
function SearchField({
  "aria-label": ariaLabel,
  placeholder,
  collapsible = true,
  value: valueProp,
  defaultValue,
  onChange,
  className,
  ...props
}: SearchFieldProps) {
  const { resolve } = useMotionPreference();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  // Controlled or uncontrolled, like React Aria's own `value`/`defaultValue`; tracked here to know when it's empty.
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue ?? "");
  const value = valueProp ?? uncontrolledValue;
  const handleChange = (next: string) => {
    if (valueProp === undefined) setUncontrolledValue(next);
    onChange?.(next);
  };

  // Starts open when there's already a query, so a remount never hides an active search.
  const [open, setOpen] = React.useState(value !== "");
  const expanded = !collapsible || open;
  const focusOnOpenRef = React.useRef(false);

  React.useEffect(() => {
    if (open && focusOnOpenRef.current) {
      focusOnOpenRef.current = false;
      inputRef.current?.focus();
    }
  }, [open]);

  const expand = () => {
    focusOnOpenRef.current = true;
    setOpen(true);
  };

  const collapse = (returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) requestAnimationFrame(() => triggerRef.current?.focus());
  };

  return (
    <motion.div
      data-slot="search-field"
      data-expanded={expanded || undefined}
      className={cn(
        "relative flex h-9 shrink-0 items-center overflow-hidden rounded-full border border-border bg-white shadow-input",
        // Focused (Figma `Focus`/`Dirty`): 2px `input/ring` border, drawn as border + inset ring so nothing moves.
        "focus-within:border-input-ring focus-within:inset-ring-1 focus-within:inset-ring-input-ring",
        // Collapsed it acts as a button: the secondary button's hover fill, and its keyboard focus ring.
        !expanded && "hover:bg-hover has-[[data-focus-visible]]:ring-2 has-[[data-focus-visible]]:ring-ring has-[[data-focus-visible]]:ring-offset-2",
        !collapsible && "w-60",
        className,
      )}
      initial={false}
      animate={collapsible ? { width: expanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH } : undefined}
      transition={resolve(expanded ? standardTransition : exitTransition)}
      // Clicking or tabbing outside collapses it, but only while it's empty: a query stays visible.
      onBlur={(event) => {
        if (!collapsible || event.currentTarget.contains(event.relatedTarget as Node | null)) return;
        // The trigger unmounting as it opens can report a blur before the input takes focus: ignore that one.
        if (focusOnOpenRef.current) return;
        if (value === "") collapse(false);
      }}
    >
      {/* Inert while collapsed, so the hidden input can't be tabbed to; the trigger below stands in for it. */}
      <div inert={!expanded} className="flex min-w-0 flex-1 items-center">
        <AriaSearchField
          {...props}
          aria-label={ariaLabel}
          value={value}
          onChange={handleChange}
          // React Aria clears on Escape; a second Escape on the now-empty field collapses it and returns focus.
          onKeyDown={(event) => {
            if (event.key === "Escape" && value === "" && collapsible) collapse(true);
            else event.continuePropagation();
          }}
          className="group flex min-w-0 flex-1 items-center gap-2 px-[13px]"
        >
          <SearchMd aria-hidden className="size-4 shrink-0 text-icon-foreground" />
          <AriaInput
            ref={inputRef}
            placeholder={placeholder}
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-foreground-subtle [&::-webkit-search-cancel-button]:hidden"
          />
          {/* Figma `Dirty`: the clear icon appears once there's text. */}
          <AriaButton
            aria-label="Clear search"
            className="flex shrink-0 rounded-full text-icon-foreground outline-none group-data-[empty]:hidden data-[hovered]:text-foreground data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring"
          >
            <XClose aria-hidden className="size-4" />
          </AriaButton>
        </AriaSearchField>
      </div>
      {!expanded && (
        <AriaButton
          ref={triggerRef}
          aria-label={ariaLabel}
          aria-expanded={false}
          onPress={expand}
          className="absolute inset-0 rounded-full outline-none"
        />
      )}
    </motion.div>
  );
}

export { SearchField, type SearchFieldProps };
