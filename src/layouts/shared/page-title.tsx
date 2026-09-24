import * as React from "react";

import { Typography } from "@/components/typography";

/**
 * Every layout's page title (e.g. "Welcome back, Theresa", "Engagements").
 * Figma `3xl -bold` (30/36) with 1% letter-spacing (0.3px) — shared so the
 * pages can't drift apart, the same way `layoutCanvasPaddingClassName`
 * shares the canvas gutters. Renders the page's `h1`.
 */
function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography as="h1" size="3xl" weight="bold" className="tracking-[0.01em]">
      {children}
    </Typography>
  );
}

export { PageTitle };
