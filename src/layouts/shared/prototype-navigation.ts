/**
 * Event the prototype fires to move between pages. Storybook's preview
 * (`.storybook/preview.tsx`) handles it by swapping the story in place, so
 * going Home → Engagements doesn't reload the page and flash blank while the
 * next story prepares. Anywhere nothing handles it (e.g. a consuming app), the
 * link falls back to a normal page load.
 */
const PROTOTYPE_NAVIGATE_EVENT = "prototype:navigate";

type PrototypeNavigateDetail = { href: string };

/** Opens `href` — in place when Storybook's preview handles it, otherwise as a full page load. */
function navigatePrototype(href: string) {
  const event = new CustomEvent<PrototypeNavigateDetail>(PROTOTYPE_NAVIGATE_EVENT, {
    detail: { href },
    cancelable: true,
  });
  // `dispatchEvent` returns false once a handler calls `preventDefault()`, i.e. it took over the navigation.
  if (window.dispatchEvent(event)) window.location.assign(href);
}

export { PROTOTYPE_NAVIGATE_EVENT, navigatePrototype, type PrototypeNavigateDetail };
