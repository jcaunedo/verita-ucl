import * as React from "react";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { Sidebar, type SidebarProps } from "@/components/navigation/sidebar";
import { Typography } from "@/components/typography";
import { NextStepsSection } from "@/layouts/shared/next-steps-section";
import { layoutCanvasPaddingClassName } from "@/layouts/shared/layout-canvas";
import { PageTitle } from "@/layouts/shared/page-title";
import { readSidebarCollapsed, saveSidebarCollapsed } from "@/layouts/shared/demo-state";
import { prototypeAccountMenu } from "@/layouts/shared/prototype-account-menu";
import { SectionEmptyState } from "@/components/cards/section-empty-state";
import { CalloutCard } from "@/components/cards/callout-card";

/**
 * `dismissible: true` only for `Recommended` tasks — per
 * `product-specs/next-steps-card.md` §2.1/§2.3, `Required now`/`Required
 * later` cards cannot be dismissed while applicable.
 */
const NEXT_STEPS = [
  {
    key: "interview",
    badgeTone: "destructive",
    label: "Required now",
    title: "Complete AI interview",
    description: "Help us understand your expertise and match you with better-fit roles.",
    buttonLabel: "Start interview",
    dismissible: false,
  },
  {
    key: "availability",
    badgeTone: "warning",
    label: "Required later",
    title: "Confirm availability",
    description: "Set your schedule so we can recommend roles that fit.",
    buttonLabel: "Set availability",
    dismissible: false,
  },
  {
    key: "linkedin",
    badgeTone: "info",
    label: "Recommended",
    title: "LinkedIn Profile",
    description: "Strengthen your profile and improve match quality.",
    buttonLabel: "Connect LinkedIn",
    // Opens LinkedIn sign-in in a new tab — the CTA and the whole card (which clicks the CTA) both follow this link.
    buttonProps: { href: "https://www.linkedin.com/uas/login", target: "_blank", rel: "noopener noreferrer" },
    dismissible: true,
  },
  {
    key: "resume",
    badgeTone: "info",
    label: "Recommended",
    title: "Upload resume",
    description: "Upload your resume as a PDF, it will improve your matches.",
    buttonLabel: "Upload PDF",
    dismissible: true,
  },
] as const;


const CALLOUTS = [
  {
    key: "qualify",
    title: "Qualify for more work",
    description: "Complete assessments to validate your skills and qualify for more opportunities.",
    href: "#",
  },
  {
    key: "refer",
    title: "Refer and earn",
    description: "Refer talented professionals and earn rewards when they join the network.",
    href: "#",
  },
] as const;

interface DashboardEmptyStateProps {
  /**
   * Passed through to the internal `Sidebar`'s `navHrefOverrides` — this
   * repo has no router, so there's nothing to wire by default. Exists so a
   * Storybook story can turn this layout into a clickable prototype (e.g.
   * pointing "Home" at this very story's own URL) without forking the
   * component to hardcode a demo-only link.
   */
  navHrefOverrides?: SidebarProps["navHrefOverrides"];
  /**
   * Turns the "Welcome back" heading into a link to this URL — a
   * prototype hotspot (same purpose as `navHrefOverrides`), e.g. jumping
   * from this empty state to the populated `Dashboard` story. The heading
   * looks unchanged; it just becomes a real `<a href>` (pointer cursor via
   * the global rule, keyboard-focusable). Omit for a plain heading.
   */
  welcomeHref?: string;
}

/**
 * Full-page reference layout — the provider portal's home dashboard in its
 * empty state (no active work yet). Figma: Verita → `Dashboard`. A separate
 * `dashboard-empty-state` layout since the fully-populated dashboard (with
 * work-in-progress cards, tables, etc. once those components exist) will be
 * its own `layouts/dashboard/` layout rather than a variant of this one.
 */
function DashboardEmptyState({ navHrefOverrides, welcomeHref }: DashboardEmptyStateProps = {}) {
  // Starts as the professional last left it on another page (prototype pages remount on every sidebar link).
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(readSidebarCollapsed);
  /**
   * Below `lg` (1024px) the sidebar auto-collapses — including on initial
   * load at a narrow width, not only when resizing into that range. Crossing
   * back above `lg` restores whatever state the sidebar was in *before* the
   * auto-collapse, but only if the current collapse was the automatic one:
   * if the user manually collapsed it themselves while already below `lg`,
   * that's their own choice and must stick even after crossing back above
   * `lg` — `wasAutoCollapsedRef` distinguishes the two so the restore only
   * ever undoes this effect's own action, never a manual one. `Sidebar`'s
   * own toggle (via `onCollapsedChange` below) clears the flag the moment
   * the user interacts with it, so any manual toggle — collapse or expand —
   * immediately "promotes" the current state to user-owned.
   */
  const isLgUp = useMediaQuery("(min-width: 1024px)");
  const wasAutoCollapsedRef = React.useRef(false);
  const preCollapseStateRef = React.useRef(false);
  React.useEffect(() => {
    if (!isLgUp) {
      setSidebarCollapsed((current) => {
        if (!current) {
          preCollapseStateRef.current = current;
          wasAutoCollapsedRef.current = true;
        }
        return true;
      });
    } else if (wasAutoCollapsedRef.current) {
      setSidebarCollapsed(preCollapseStateRef.current);
      wasAutoCollapsedRef.current = false;
    }
  }, [isLgUp]);

  const handleSidebarCollapsedChange = (collapsed: boolean) => {
    // A manual toggle always promotes the current state to user-owned —
    // even a manual re-collapse while already below `lg` should stick
    // through a later crossing back above `lg`, per `wasAutoCollapsedRef`'s
    // own comment above.
    wasAutoCollapsedRef.current = false;
    setSidebarCollapsed(collapsed);
    saveSidebarCollapsed(collapsed);
  };

  return (
    <div className="flex min-h-screen w-full items-start bg-white">
      <div className="sticky top-0 shrink-0">
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapsedChange={handleSidebarCollapsedChange}
          navHrefOverrides={navHrefOverrides}
          accountMenu={prototypeAccountMenu}
        />
      </div>
      <div className={cn("flex min-w-px flex-1 flex-col items-center", layoutCanvasPaddingClassName(sidebarCollapsed))}>
        <div className="flex w-full max-w-[1400px] flex-1 flex-col items-start gap-8 pt-10 pb-[104px]">
          <div className="flex w-full items-center justify-between">
            <div className="flex min-w-px flex-1 flex-col items-start gap-1.5">
              <PageTitle>
                {welcomeHref ? (
                  <a
                    href={welcomeHref}
                    className="rounded-sm text-inherit no-underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    Welcome back, Theresa
                  </a>
                ) : (
                  "Welcome back, Theresa"
                )}
              </PageTitle>
              <Typography size="lg">Let’s make today count.</Typography>
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-12">
            <NextStepsSection steps={NEXT_STEPS} />

            <SectionEmptyState
              title="You don’t have any active work yet"
              description="Browse work and apply to what fits you best."
              buttonLabel="Discover work"
            />

            {/* One column at `lg` (1024px) and below, two side by side above it; side by side, `items-stretch` keeps both cards
    the same height however their text wraps. */}
            <div className="flex w-full flex-col gap-5 min-[1025px]:flex-row min-[1025px]:items-stretch">
              {CALLOUTS.map(({ key, ...callout }) => (
                <CalloutCard key={key} {...callout} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { DashboardEmptyState };
