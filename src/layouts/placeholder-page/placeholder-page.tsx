import { cn } from "@/lib/utils";
import { Sidebar, type SidebarProps } from "@/components/navigation/sidebar";
import { layoutCanvasPaddingClassName } from "@/layouts/shared/layout-canvas";
import { PageTitle } from "@/layouts/shared/page-title";
import { prototypeAccountMenu } from "@/layouts/shared/prototype-account-menu";
import { useLayoutSidebar } from "@/layouts/shared/use-layout-sidebar";

interface PlaceholderPageProps {
  /** Page title, e.g. "Discover". */
  title: string;
  /** The sidebar item this page belongs to, shown as current. */
  activeNavKey: NonNullable<SidebarProps["defaultActiveNavKey"]>;
  /** Where each sidebar item links (the prototype's stories) — same no-router reason as the other layouts. */
  navHrefOverrides?: SidebarProps["navHrefOverrides"];
}

/**
 * A sidebar destination with no design yet (Discover, Earnings):
 * the shared page shell and the page title only, so every sidebar item is
 * clickable in the prototype. Replace with the real layout once it's designed.
 */
function PlaceholderPage({ title, activeNavKey, navHrefOverrides }: PlaceholderPageProps) {
  const { sidebarCollapsed, handleSidebarCollapsedChange } = useLayoutSidebar();

  return (
    <div className="flex min-h-screen w-full items-start bg-white">
      <div className="sticky top-0 shrink-0">
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapsedChange={handleSidebarCollapsedChange}
          navHrefOverrides={navHrefOverrides}
          accountMenu={prototypeAccountMenu}
          defaultActiveNavKey={activeNavKey}
        />
      </div>
      <div className={cn("flex min-w-px flex-1 flex-col items-center self-stretch", layoutCanvasPaddingClassName(sidebarCollapsed))}>
        <div className="flex w-full max-w-[1400px] flex-1 flex-col items-start gap-8 pt-10 pb-[104px]">
          <PageTitle>{title}</PageTitle>
        </div>
      </div>
    </div>
  );
}

export { PlaceholderPage, type PlaceholderPageProps };
