import * as React from "react";
import {
  Button as AriaButton,
  Label as AriaLabel,
  Tag as AriaTag,
  TagGroup as AriaTagGroup,
  TagList as AriaTagList,
  type TagGroupProps as AriaTagGroupProps,
  type TagListProps as AriaTagListProps,
  type TagProps as AriaTagProps,
} from "react-aria-components";
import { XClose } from "@untitledui/icons";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Avatar } from "@/components/data-display/avatar";
import { typographyVariants } from "@/components/typography";

/**
 * Figma: verita.ds → `Tag` (`node-id=6092-4246`). 24px tall (22px `sm` line + 1px top/bottom padding), white
 * `background/default` fill, 1px `border/neutral/border-dark`, `radius/md` (6px), 6px horizontal padding, 2px between the
 * avatar, label, and close. One size in Figma.
 */
const tagVariants = cva(
  [
    "group inline-flex h-6 shrink-0 items-center gap-0.5 rounded-md border border-border-dark bg-background px-1.5 py-px outline-none",
    "data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-ring",
    // No Figma source for disabled — the same quieted text as Button's disabled state.
    "data-[disabled]:text-foreground-subtle",
  ].join(" "),
);

interface TagProps extends Omit<AriaTagProps, "children" | "className"> {
  /** The tag's text (Figma `Label`, `sm -medium`, `icon/foreground`). */
  children: React.ReactNode;
  /** Leading 16px photo avatar (Figma `showAvatar`). Untitled UI's `avatarSrc`. */
  avatarSrc?: string;
  /** Alt text for the avatar. Defaults to empty, since the label already names the tag. */
  avatarAlt?: string;
  /**
   * Initials avatar when there's no photo, e.g. a person without a picture. At 16px only the first letter fits, in
   * `xxs` (11px).
   */
  avatarInitials?: string;
  /** The initials avatar's background, e.g. `bg-tone-success`. */
  avatarClassName?: string;
  /** Accessible label for the remove (×) button. Defaults to "Remove <label>" when the label is a string. */
  removeLabel?: string;
  className?: string;
}

/**
 * One tag. Figma: `Tag`. Render inside `TagList`. The close (×) shows only when the parent `TagGroup` has `onRemove`
 * (Figma `showXClose`); pressing it, or Backspace/Delete on a focused tag, removes it. The × is `icon/foreground` at
 * 50% opacity (Figma, 2026-10-02), rising to 100% while the tag is hovered or the × has keyboard focus, the same
 * treatment as `Toast`'s close.
 */
function Tag({
  children,
  avatarSrc,
  avatarAlt = "",
  avatarInitials,
  avatarClassName,
  removeLabel,
  className,
  textValue,
  ...props
}: TagProps) {
  const label = typeof children === "string" ? children : undefined;

  return (
    <AriaTag
      data-slot="tag"
      textValue={textValue ?? label}
      className={cn(tagVariants(), className)}
      {...props}
    >
      {({ allowsRemoving }) => (
        <>
          {(avatarSrc || avatarInitials) && (
            <Avatar
              // Decorative unless `avatarAlt` says otherwise: the label already names the tag.
              aria-hidden={avatarAlt ? undefined : true}
              src={avatarSrc}
              alt={avatarAlt}
              initials={avatarInitials?.slice(0, 1)}
              className={cn("size-4 text-xxs", avatarClassName)}
            />
          )}
          {/* Figma `Label container`: 2px either side of the label. */}
          <span className={cn(typographyVariants({ size: "sm", weight: "medium" }), "px-0.5 text-icon-foreground")}>
            {children}
          </span>
          {allowsRemoving && (
            <AriaButton
              slot="remove"
              aria-label={removeLabel ?? (label ? `Remove ${label}` : "Remove")}
              // 12px icon (Figma `X Close Button`) in a 16px hit area; the negative margin keeps Figma's 2px gap.
              className="-m-0.5 flex shrink-0 rounded-[3px] p-0.5 text-icon-foreground opacity-50 outline-none transition-opacity duration-160 ease-in-out group-hover:opacity-100 data-[focus-visible]:opacity-100 data-[focus-visible]:outline-2 data-[focus-visible]:outline-ring"
            >
              {/* 1.5px stroke at 12px (design direction, 2026-10-02): the icon's 24px grid would scale its own 2px stroke to 1px. */}
              <XClose aria-hidden="true" strokeWidth={3} className="size-3" />
            </AriaButton>
          )}
        </>
      )}
    </AriaTag>
  );
}

interface TagGroupProps extends Omit<AriaTagGroupProps, "className" | "children"> {
  /** Visible label above the tags. Omit it and pass `aria-label` instead when the context already names them. */
  label?: React.ReactNode;
  /** The group's `TagList`. */
  children: React.ReactNode;
  className?: string;
}

/**
 * A set of tags, on React Aria's `TagGroup` (as Untitled UI's Tags are): arrow keys move between tags, and passing
 * `onRemove` adds each tag's × and Backspace/Delete removal. Optional `selectionMode` makes tags selectable.
 */
function TagGroup({ label, children, className, ...props }: TagGroupProps) {
  return (
    <AriaTagGroup data-slot="tag-group" className={cn("flex flex-col gap-1.5", className)} {...props}>
      {label && <AriaLabel className={typographyVariants({ size: "sm", weight: "medium" })}>{label}</AriaLabel>}
      {children}
    </AriaTagGroup>
  );
}

interface TagListProps<T extends object> extends Omit<AriaTagListProps<T>, "className"> {
  className?: string;
}

/** The row of tags inside a `TagGroup`. Wraps onto new lines, 4px apart (design direction, 2026-10-02). */
function TagList<T extends object>({ className, ...props }: TagListProps<T>) {
  return <AriaTagList data-slot="tag-list" className={cn("flex flex-wrap gap-1", className)} {...props} />;
}

export { Tag, TagGroup, TagList, tagVariants, type TagProps, type TagGroupProps, type TagListProps };
