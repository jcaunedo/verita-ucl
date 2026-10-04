import * as React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & {
  /** Width and height in px, like `@untitledui/icons`. Default 24; usually sized by `className` (e.g. `size-4`). */
  size?: number;
};

/**
 * Product icons from verita.ds that `@untitledui/icons` doesn't ship. Same API and look as that package: a 24×24
 * outline on a 2px round stroke in `currentColor`, so they drop in anywhere an Untitled UI icon component goes (e.g.
 * `MenuItem`'s `icon`).
 */

/**
 * Figma: verita.ds `face-slightly-smiling-plus` (`node-id=6105-6231`). Referring someone: a smiling face with a plus,
 * used for "Refer someone" actions (design direction, 2026-10-03).
 */
function FaceSlightlySmilingPlus({ size = 24, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M13.267 2.08C11.1977 1.8158 9.09759 2.20536 7.26071 3.19413C5.42383 4.1829 3.94216 5.72137 3.02316 7.59414C2.10417 9.4669 1.79386 11.5802 2.13569 13.6381C2.47751 15.696 3.45436 17.5955 4.92945 19.0705C6.40455 20.5456 8.30402 21.5225 10.3619 21.8643C12.4198 22.2061 14.5331 21.8958 16.4059 20.9768C18.2786 20.0578 19.8171 18.5762 20.8059 16.7393C21.7946 14.9024 22.1842 12.8023 21.92 10.733M15 10V9M16 5H22M16.472 15C15.9092 15.629 15.2201 16.1322 14.4496 16.4767C13.679 16.8212 12.8445 16.9993 12.0005 16.9993C11.1565 16.9993 10.322 16.8212 9.55145 16.4767C8.78094 16.1322 8.09178 15.629 7.529 15M19 2V8M9 10V9" />
    </svg>
  );
}

export { FaceSlightlySmilingPlus, type IconProps };
