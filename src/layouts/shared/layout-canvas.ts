/**
 * Horizontal padding for every layout's main canvas (the column beside the
 * `Sidebar`). Shared so Dashboard, Dashboard Empty State, and Engagements keep
 * the same gutters at every breakpoint instead of drifting apart per layout.
 *
 * `px-12` below `xl`. From `xl` up the right gutter is `pr-40`; the left one
 * is `pl-16` beside the expanded sidebar and matches the right (`pl-40`) when
 * the sidebar is collapsed.
 *
 * The left padding transitions with the sidebar's width so the content glides
 * instead of jumping. Documented exception to the motion-token rule: CSS
 * can't read `src/lib/motion`, so the duration and curve are
 * `enterTransition`'s (`motionDuration.slow`, 500ms; `[0.16, 1, 0.3, 1]`),
 * the same preset `Sidebar` animates its width with. Keep them in sync.
 */
export function layoutCanvasPaddingClassName(sidebarCollapsed: boolean) {
  return [
    "px-12 xl:pr-40",
    sidebarCollapsed ? "xl:pl-40" : "xl:pl-16",
    "transition-[padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
  ].join(" ");
}
