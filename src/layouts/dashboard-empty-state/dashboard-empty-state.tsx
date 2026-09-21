import * as React from "react";

import { Sidebar } from "@/components/navigation/sidebar";
import { Typography } from "@/components/typography";
import { NextStepCard } from "@/components/cards/next-step-card";
import { SectionEmptyState } from "@/components/cards/section-empty-state";
import { CalloutCard } from "@/components/cards/callout-card";

const NEXT_STEPS = [
  {
    key: "interview",
    badgeTone: "destructive",
    label: "Required now",
    title: "Complete AI interview",
    description: "Help us understand your expertise and match you with better-fit roles.",
    buttonLabel: "Start interview",
  },
  {
    key: "availability",
    badgeTone: "warning",
    label: "Required later",
    title: "Confirm availability",
    description: "Set your schedule so we can recommend roles that fit.",
    buttonLabel: "Set availability",
  },
  {
    key: "linkedin",
    badgeTone: "info",
    label: "Recommended",
    title: "LinkedIn Profile",
    description: "Strengthen your profile and improve match quality.",
    buttonLabel: "Connect LinkedIn",
  },
  {
    key: "resume",
    badgeTone: "info",
    label: "Recommended",
    title: "Upload resume",
    description: "Upload your resume as a PDF, it will improve your matches.",
    buttonLabel: "Upload PDF",
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

/** Full-page reference layout — the provider portal's home dashboard. Figma: Verita → `Dashboard`. */
function Dashboard() {
  return (
    <div className="flex min-h-screen w-full items-start gap-14 bg-white">
      <div className="sticky top-0 shrink-0">
        <Sidebar />
      </div>
      <div className="flex min-w-px flex-1 flex-col items-center pr-[216px]">
        <div className="flex w-full max-w-[1400px] flex-1 flex-col items-start gap-8 pt-10 pb-[104px]">
          <div className="flex w-full items-center justify-between">
            <div className="flex min-w-px flex-1 flex-col items-start gap-1.5">
              <Typography size="3xl" weight="semibold">
                Welcome back, Tien
              </Typography>
              <Typography size="lg">Let’s make today count.</Typography>
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-12">
            <div className="flex w-full flex-col items-start gap-4">
              <div className="flex w-full flex-col items-start gap-0.5">
                <Typography size="xl" weight="semibold">
                  Next steps
                </Typography>
                <Typography size="sm" className="text-foreground-muted">
                  Complete these to unlock more opportunities and improve your matches.
                </Typography>
              </div>
              <div className="grid h-[248px] w-full grid-cols-4 gap-6">
                {NEXT_STEPS.map(({ key, ...step }) => (
                  <NextStepCard key={key} {...step} className="h-full w-auto" />
                ))}
              </div>
            </div>

            <SectionEmptyState
              title="You don’t have any active work yet"
              description="Browse work and apply to what fits you best."
              buttonLabel="Discover work"
            />

            <div className="flex w-full items-start gap-6">
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

export { Dashboard };
