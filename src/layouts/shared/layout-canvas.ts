/**
 * Horizontal padding for every layout's main canvas (the column beside the
 * `Sidebar`). Shared so Dashboard, Dashboard Empty State, and Engagements keep
 * the same gutters at every breakpoint instead of drifting apart per layout.
 *
 * `px-12` below `xl`; from `xl` up, a wider right gutter (`pr-40`) than left
 * (`pl-16`). Independent of the sidebar's collapsed state.
 */
export const layoutCanvasPaddingClassName = "px-12 xl:pr-40 xl:pl-16";
