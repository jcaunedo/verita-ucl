import type { ArgTypesEnhancer, Preview } from "@storybook/react-vite";
import { RouterProvider } from "react-aria-components";
import {
  SET_CURRENT_STORY,
  STORY_ERRORED,
  STORY_MISSING,
  STORY_RENDERED,
  STORY_THREW_EXCEPTION,
} from "storybook/internal/core-events";
import { addons } from "storybook/preview-api";

import "../src/styles/globals.css";
import {
  PROTOTYPE_NAVIGATE_EVENT,
  navigatePrototype,
  type PrototypeNavigateDetail,
} from "../src/layouts/shared/prototype-navigation";

/** The story id in a prototype link (`iframe.html?id=…`), or null for any other URL. */
function storyIdFromHref(href: string) {
  const url = new URL(href, window.location.href);
  if (url.origin !== window.location.origin || !url.pathname.endsWith("/iframe.html")) return null;
  return url.searchParams.get("id");
}

function currentStoryId() {
  return new URLSearchParams(window.location.search).get("id");
}

/**
 * Storybook unmounts the old story before it mounts the next one, leaving the
 * page empty for a moment. Cover that gap with a static copy of the page as it
 * looks now, removed once the next story has rendered (or failed to). The
 * copy sits in its own scroll container at the current scroll offset, so
 * sticky parts (the sidebar) stay where they were. The next page starts at the
 * top, like a page load.
 */
function holdCurrentPage() {
  const root = document.getElementById("storybook-root");
  if (!root) return;
  const holder = document.createElement("div");
  holder.setAttribute("aria-hidden", "true");
  holder.style.cssText =
    "position:fixed;inset:0;overflow:hidden;z-index:2147483647;pointer-events:none;background:white;";
  holder.appendChild(root.cloneNode(true));
  document.body.appendChild(holder);
  holder.scrollTop = window.scrollY;

  const channel = addons.getChannel();
  const events = [STORY_RENDERED, STORY_ERRORED, STORY_MISSING, STORY_THREW_EXCEPTION];
  let released = false;
  const release = () => {
    if (released) return;
    released = true;
    events.forEach((name) => channel.off(name, release));
    window.scrollTo(0, 0);
    requestAnimationFrame(() => holder.remove());
  };
  events.forEach((name) => channel.on(name, release));
  window.setTimeout(release, 3000);
}

/**
 * Prototype pages (Dashboard, Engagements, …) are separate stories linked by
 * `iframe.html?id=…` URLs. Following one as a normal link reloads the iframe,
 * and Storybook shows a blank page while the next story prepares — a white
 * flash on every page change. Instead, switch the story in place: push the
 * URL (so the address bar, a reload, and Back keep working) and ask the
 * preview to render that story (`SET_CURRENT_STORY`, which `channel.emit`
 * also delivers to the preview's own listener), holding the current page on
 * screen until the next one renders. Links to the story that's
 * already showing still reload, since re-selecting it wouldn't remount it
 * and pages like "2 offers" rely on a fresh mount to restore their state.
 */
if (typeof window !== "undefined") {
  window.addEventListener(PROTOTYPE_NAVIGATE_EVENT, (event) => {
    const { href } = (event as CustomEvent<PrototypeNavigateDetail>).detail;
    const storyId = storyIdFromHref(href);
    if (!storyId || storyId === currentStoryId()) return;
    event.preventDefault();
    window.history.pushState({}, "", new URL(href, window.location.href));
    holdCurrentPage();
    addons.getChannel().emit(SET_CURRENT_STORY, { storyId, viewMode: "story" });
  });

  window.addEventListener("popstate", () => {
    const storyId = currentStoryId();
    if (!storyId) return;
    holdCurrentPage();
    addons.getChannel().emit(SET_CURRENT_STORY, { storyId, viewMode: "story" });
  });
}

/**
 * Text props typed as React content (`label`, `title`, `children`) or as an open string union (`company`) get a text box
 * instead of Storybook's JSON editor — in stories they're almost always plain text. Runs before Storybook picks default
 * controls, which keeps any control already set (here or in a story's `argTypes`).
 */
const textControlsForTextProps: ArgTypesEnhancer = ({ argTypes }) =>
  Object.fromEntries(
    Object.entries(argTypes).map(([name, argType]) => {
      const type = argType.table?.type?.summary ?? "";
      const isText = type === "ReactNode" || type.startsWith("(string & {})");
      return [name, !argType.control && isText ? { ...argType, control: { type: "text" } } : argType];
    }),
  );

const preview: Preview = {
  // Every component gets an auto-generated Docs page; full-page layouts opt out with "!autodocs".
  tags: ["autodocs"],
  argTypesEnhancers: [textControlsForTextProps],
  parameters: {
    // Sidebar order: overview and foundations, then component families, then the full-page prototypes.
    options: {
      storySort: {
        order: [
          "Introduction",
          "Foundations",
          ["Colors", "Typography", "Motion"],
          "Guidelines",
          [
            "Overview",
            "Lists and rows",
            "Actions and menus",
            "Messages and feedback",
            "Empty views",
            "Modals and overlays",
            "Page layout",
            "Developer contracts",
          ],
          "Components",
          "Icons",
          "Branding",
          "Buttons",
          "Forms",
          "Navigation",
          "Overlays",
          "Feedback",
          "DataDisplay",
          "Cards",
          "Layouts",
        ],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /(^d|D)ate$/, // `date`, `startDate` — not `validate`
      },
    },
  },
  // Every React Aria link (sidebar nav, "View All", account-menu pages) navigates through `navigatePrototype`.
  decorators: [
    (Story) => (
      <RouterProvider navigate={navigatePrototype}>
        <Story />
      </RouterProvider>
    ),
  ],
};

export default preview;
