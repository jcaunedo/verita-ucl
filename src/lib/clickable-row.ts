import type * as React from "react";

type RowProps = Omit<React.HTMLAttributes<HTMLDivElement>, "className">;

/** True when the event came from a nested control (button/link/role=button) inside the row, not the row itself. */
function isFromNestedControl(event: React.SyntheticEvent<HTMLElement>) {
  const control = (event.target as HTMLElement).closest(
    'button, a[href], [role="button"]',
  );
  return control !== null && control !== event.currentTarget;
}

/**
 * Makes a whole card row its own click target (e.g. `ApplicationCard`,
 * `MatchCard`, `OfferCard` routing to their detail page). Only activates
 * when `rowProps.onClick` is set — otherwise the row stays a plain,
 * non-interactive container and `rowProps` passes through untouched.
 *
 * When clickable, the row gets `role="button"` + `tabIndex={0}`, which is
 * what DESIGN.md's global `cursor: pointer` rule keys on (a bare `<div>`
 * with only `onClick` gets no pointer), plus Enter/Space activation so it
 * behaves like a real button from the keyboard. Clicks and keys that
 * originate from a nested control (the `···` trigger, CTA, save/dismiss
 * buttons) are ignored, so pressing one never also fires the row's action.
 */
function clickableRowProps(rowProps: RowProps | undefined): RowProps | undefined {
  const onClick = rowProps?.onClick;
  if (!onClick) return rowProps;

  return {
    role: "button",
    tabIndex: 0,
    ...rowProps,
    onClick: (event) => {
      if (isFromNestedControl(event)) return;
      onClick(event);
    },
    onKeyDown: (event) => {
      rowProps.onKeyDown?.(event);
      if (event.defaultPrevented || event.target !== event.currentTarget) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        event.currentTarget.click();
      }
    },
  };
}

export { clickableRowProps };
