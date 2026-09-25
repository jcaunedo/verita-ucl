# Design & Component Contracts

Durable, team-visible rules about _why_ a component is built the way it is —
things that would otherwise get silently re-broken by a future edit or
Figma resync. This file is committed to git so it travels with the repo
across machines and is visible to any contributor (human or AI).

Add an entry here when a fix or convention:

- took real iteration to land on and could plausibly be "fixed" back to a
  worse state by someone who doesn't know the history, or
- is a contract between two pieces of code (e.g. two CSS rules that must
  change together) that isn't obvious from reading either one alone.

Keep entries short: what the rule is, why it exists, and the exact
known-good shape to check against. Don't restate things that are already
self-evident from reading the code.

---

## Design quality bar — consumer and internal products are equal

**Rule:** Every Verita product is designed to be intuitive, efficient, and
human by default. This standard applies equally to consumer experiences and
internal operational tools. Internal systems are not treated as secondary
products — they meet the same bar for clarity, usability, and design quality
as customer-facing experiences.

**Why:** The principle is simple: every Verita product must be human, fast,
and trustworthy, regardless of audience. It's easy to unconsciously treat
internal/operational tools as lower priority since they have no external
audience — this rule exists so that assumption doesn't quietly lower the bar
for account-settings or other internal-facing UCL consumers.

**How to apply:** Don't reach for a lower-effort pattern (skipping states,
skipping motion, skipping copy quality) just because a screen is
internal-only.

⚠️ **Gap:** brand voice/copy tone guidance for Verita is not yet defined —
add a "Brand voice" section here once it is.

---

## Global `cursor: pointer` on every clickable element (`src/styles/theme.css`)

**Rule:** Every clickable/interactive element in UCL must show `cursor: pointer`
on hover (and `cursor: not-allowed` when disabled) — this is enforced **once,
globally**, not per-component. Don't add `cursor-pointer`/`hover:cursor-pointer`
utility classes to individual components; the global `@layer base` rule
already covers any real interactive element for free.

```css
@layer base {
	button:not(:disabled),
	[role="button"]:not([aria-disabled="true"]),
	a[href],
	label[for],
	summary,
	select,
	[data-slot][role="checkbox"]:not([data-disabled]),
	[data-slot][role="radio"]:not([data-disabled]),
	[data-slot][role="switch"]:not([data-disabled]),
	[data-slot][role="option"]:not([aria-disabled="true"]),
	[data-slot][role="menuitem"]:not([aria-disabled="true"]),
	[data-slot][role="tab"]:not([aria-disabled="true"]) {
		cursor: pointer;
	}

	button:disabled,
	[role="button"][aria-disabled="true"],
	[data-slot][role="tab"][aria-disabled="true"],
	select:disabled {
		cursor: not-allowed;
	}
}
```

**Why:** Tailwind v4's preflight sets `cursor: default` on `<button>` — a
deliberate change from v3's `cursor: pointer` default. Left alone, every new
component built against v4 would render non-pointer cursors on obviously
clickable controls unless someone remembered to hand-roll `cursor-pointer` on
each one (which is exactly what several individual components — `Input`,
`Select`, `Combobox` — did before this rule existed, each with slightly
different disabled-state handling). Centralizing it once removes that
per-component guesswork and keeps the affordance consistent app-wide.

**How to apply:**

- **New components using a real interactive element or role** (`<button>`,
  `<a href>`, `<select>`, `role="button"`/`"checkbox"`/`"radio"`/`"switch"`/`"tab"`)
  get the pointer cursor automatically — do not add a redundant
  `cursor-pointer` class.
- **Custom non-native interactive elements** (a `<div>` acting as a button,
  for instance) must carry `role="button"` (and `aria-disabled="true"` when
  disabled) to match the selector list above — a bare clickable `<div>` with
  only an `onClick` handler and no role will NOT get the pointer cursor from
  this rule.
- **If a new interactive role/pattern is added to the library** (e.g. a new
  primitive with its own trigger role) and it doesn't match any selector
  above, extend the shared selector list in `theme.css` rather than
  patching `cursor-pointer` onto that one new component. Update the copy of
  the list in this entry in the same change.
- **Verify it on every new or changed interactive component and layout:**
  hover each clickable element in Storybook and confirm the pointer cursor
  (and `not-allowed` when disabled) before calling the work done. A missing
  pointer means the element's role isn't in the selector list — fix the
  list, not the component.
- **Deliberate exceptions** keep their own cursor and are documented where
  they're set: `Sidebar`'s collapse rail uses `cursor-w-resize`/
  `cursor-e-resize`, and `Button`'s disabled state uses
  `cursor-not-allowed` alongside `pointer-events-none`.

✅ **Fixed (2026-09-23):** `role="tab"` was missing from the list, so
react-aria tabs (`MetricTab`, `TabButton`) showed the default cursor. Added
`[data-slot][role="tab"]` for the pointer, and its `aria-disabled` form for
`not-allowed`.


---

## Row hover — list rows use `hover-row`, standalone cards use `hover-card` (`src/styles/theme.css`)

**Rule:** The hover fill for a row in a list or table (`ApplicationCard`,
`MatchCard`, `OfferCard`, table rows) is always `--hover-row`
(`bg-hover-row`), Figma's `state/hover-row` — `neutral-700` at 2%. It is the
one row-hover token: don't give a row its own tint, and don't reach for
`--hover`.

A standalone card (`CalloutCard`, `NextStepCard`, `ContractCard`) doesn't
tint on hover. It lifts: a white fill, a `border/neutral/border` border, the
`--shadow-hover-card` shadow (`shadow-hover-card`, Figma's
`shadow/hover-card`: 0 4px 12px, ink at 6%), and the Lift motion (up 3px,
CLAUDE.md "Lift"). Added in Figma on 2026-09-24.

| Token          | Figma              | Value            | Use for                                                      |
| -------------- | ------------------ | ---------------- | ------------------------------------------------------------ |
| `--hover-row`  | `state/hover-row`  | neutral-700 @ 2% | List and table rows (Application/Match/Offer rows)           |
| `--shadow-hover-card` | `shadow/hover-card` | 0 4px 12px, ink @ 6% | Standalone card hover (Callout, Next Step, Contract)   |
| `--hover`      | `state/hover`      | neutral-700 @ 4% | Controls and list items: Button, AccountTrigger, Select/Menu items |
| `--icon-hover` | raw fill on `button` Type=Icon | neutral-700 @ 8% | Ghost/Neutral icon-only Button                    |

**Why:** Figma deliberately splits row hover (large surfaces, lighter) from
control hover (small targets, stronger). The two had previously collapsed
into one code token (`--row-hover`, bound to `state/hover`) and drifted
with it — a 2% → 4% change meant for controls silently darkened every card.
Keeping one code token per Figma variable means a change to one can't leak
into the other.

**How to apply:**

- **New list or table row:** `hover:bg-hover-row` (or `group-hover:` /
  `has-[…]:` when the row stays highlighted, e.g. while its menu is open —
  see `ApplicationCard`). Don't use `bg-hover`, `bg-neutral-*`, or an
  arbitrary `color-mix`.
- **New standalone card:** white fill + `border-border` +
  `shadow-hover-card` on hover, plus the Lift motion. Include `box-shadow`
  in the card's CSS transition (not `transition-all`, which would fight
  Motion's transform).
- **Adding a hover-ish token:** add it as its own variable mapped to its
  own Figma variable (`:root` + `@theme inline`), even when its value
  currently matches an existing one.

---

## Page shell responsiveness — one behavior for every layout (`src/layouts/`)

**Rule:** Every page layout uses the same shell and the same responsive
behavior. A sticky `Sidebar` sits on the left, and a canvas column fills the
rest. Don't give one page its own gutters, breakpoints, or sidebar logic.

| Width               | Sidebar        | Canvas padding (x), left / right                                    | Card grids              |
| ------------------- | -------------- | ------------------------------------------------------------------- | ----------------------- |
| below `lg` (1024)   | auto-collapsed | `px-12` (48 / 48)                                                   | 2-up                    |
| `lg` to below `xl`  | user's choice  | `px-12` (48 / 48)                                                   | 2-up                    |
| `xl` (1280) and up  | user's choice  | expanded: `xl:pl-16 xl:pr-40` (64 / 160); collapsed: `xl:pl-40 xl:pr-40` (160 / 160) | 3-up |
| `2xl` (1536) and up | user's choice  | same as `xl`                                                        | 3-up (Next Steps: 4-up) |

- **Canvas padding** comes from `layoutCanvasPaddingClassName(sidebarCollapsed)`
  in `src/layouts/shared/layout-canvas.ts`. From `xl` up, collapsing the
  sidebar widens the left gutter to match the right one, so the content sits
  evenly between the rail and the window edge. Below `xl` both gutters are
  already equal. Use it on the canvas column:
  `cn("flex min-w-px flex-1 flex-col items-center", layoutCanvasPaddingClassName(sidebarCollapsed))`.
- **Padding motion:** the left padding transitions with the same duration and
  curve as the sidebar's width (`enterTransition`: 500ms,
  `[0.16, 1, 0.3, 1]`), so the content glides instead of jumping, and the
  transition is off under reduced motion. These values are written as CSS
  classes because CSS can't read `src/lib/motion`, so if `enterTransition`
  changes, update `layout-canvas.ts` too.
- **Content column:** `w-full max-w-[1400px]`, centered by the canvas, with
  `pt-10 pb-[104px]` (40px top, 104px bottom).
- **Sidebar auto-collapse:** below `lg` the sidebar collapses on its own,
  including on first load at a narrow width. Crossing back above `lg`
  restores the earlier state, but only if the collapse was automatic. Once
  the user toggles the sidebar, their choice sticks. The logic and its full
  rationale live in `Dashboard` (`wasAutoCollapsedRef`).
- **Callout row** (Dashboards): one column at `lg` (1024px) and below,
  two side by side above it (`flex-col min-[1025px]:flex-row`), where
  `items-stretch` gives both cards the same height.
- **Card grids:** `grid-cols-2 xl:grid-cols-3`. The Next Steps grid adds
  `2xl:grid-cols-4`, and queues extra cards instead of wrapping them to a
  second row (see `NextStepsSection`).

**Why:** Each layout used to set its own canvas padding, and they drifted.
Dashboard started at a fixed `pr-[216px]`, later became `xl:pr-30` with a
left gutter that grew when the sidebar collapsed, while Engagements used
`xl:pr-40 xl:pl-16`. The pages didn't line up when you switched between
them. The Engagements gutters were chosen as the standard (2026-09-23) and
moved into one shared helper, so a change there reaches every page. On
2026-09-24 the collapsed state got equal left and right gutters (design
direction), replacing the fixed 64px left gutter in that state.

**How to apply:**

- **New layout:** copy the shell from an existing layout (sticky `Sidebar`,
  auto-collapse effect, canvas with `layoutCanvasPaddingClassName`, 1400px
  content column). Don't hand-write `px-*`/`pr-*`/`pl-*` on the canvas.
- **Changing the gutters:** edit `layoutCanvasPaddingClassName` and update
  the table above in the same change. Don't override it in one layout.
- **Verify:** check each changed layout in Storybook below `lg`, between
  `lg` and `xl`, and at `xl`+, with the sidebar both open and collapsed.

⚠️ **Gap:** the sidebar auto-collapse effect is copied into each layout
rather than shared. Extract it into a hook (e.g. `useAutoCollapseSidebar`)
before the next layout lands, so the copies can't drift.

✅ **Resolved (2026-09-24) — top padding:** every layout's content column
starts 40px from the top (`pt-10`). Engagements used `pt-14` (56px) until
its Figma frame was aligned with the Dashboard's.

---

## Custom radius roles must be registered with `cn()` (`src/lib/utils.ts`)

**Rule:** every component radius role in `theme.css` (`rounded-card`,
`rounded-select-content`, `rounded-button-md`, …) must also be listed in the
`extendTailwindMerge` radius config in `src/lib/utils.ts`.

**Why:** `tailwind-merge` only knows Tailwind's built-in radius names. For an
unknown one like `rounded-select-content`, a `className` override such as
`rounded-3xl` was kept next to it instead of replacing it, so the corner
radius depended on which rule the stylesheet happened to emit last. Found
2026-09-24 while building `AccountMenu` on `PopoverSurface`.

**How to apply:** when adding a `--radius-*` role to `theme.css`, add its name
to the list in `utils.ts` in the same change. `font-*` family overrides
(`font-display` → `font-sans`) already merge correctly.

---

## Global font rendering on `html` (`src/styles/theme.css`)

**Rule:** text rendering is set once, on `html` in `theme.css`'s `@layer base`,
and every element inherits it — including portaled overlays (menus, popovers)
and consuming apps that import `dist/styles.css`:

```css
html {
  font-optical-sizing: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
```

Alongside them, the same block sets `font-family: var(--font-sans)`,
`color: var(--foreground)` and `font-synthesis: none` (no faux bold/italic
when a weight isn't loaded).

**Why:** without antialiased smoothing, macOS renders Inter visibly heavier
than in Figma, so weights read one step bolder than designed. Optical sizing
lets Inter adjust its letterforms per size, and `optimizeLegibility` turns on
kerning and ligatures.

**How to apply:**

- Don't repeat these properties on components or in layouts; they already
  inherit from `html`.
- Don't add Tailwind's `antialiased`/`subpixel-antialiased` classes to a
  component. If one surface genuinely needs different smoothing (e.g. light
  text on a dark fill), document it here as an exception first.
- When comparing a component against Figma, check it in a browser with this
  stylesheet loaded. Text rendered without it looks heavier and isn't a fair
  comparison.

---

## Actions menus — no dividers unless asked (`src/components/overlays/menu/`)

**Rule:** a row's `···` actions menu (`MenuContent` + `MenuItem`s, e.g. an
application's View Details / Share / Withdraw, an offer's View details /
Decline) lists its items with no `MenuSeparator` — including before a
destructive item. The destructive tone (red label and icon) already sets it
apart.

**Why:** design direction (2026-09-24): dividers were removed from the offer
and application menus and are to be left out everywhere by default.

**How to apply:**

- **New actions menu:** no `MenuSeparator`. Add one only when a design or
  request explicitly calls for it for that menu.
- `MenuSeparator` stays available for those cases (see the `WithSeparator`
  story in Overlays/Menu). The account menu's divider before the prototype
  items was explicitly requested, so it stays.

## No `black` (900) font weight (`src/components/typography/`)

**Rule:** Typography's `weight` axis is `regular` / `medium` / `semibold` /
`bold` only. There is no `black` variant and no `--font-weight-black` token
in `theme.css`.

**Why:** Verita doesn't use the 900 weight (decided 2026-09-25). verita.ds
still ships `-black` text styles for every size (and some are mis-set, e.g.
`xs -black` is Regular), so a Figma resync would otherwise re-add the
variant. Skip `-black` styles when syncing; if a design binds one, flag it
rather than mapping it to `font-black`.

## Primary CTAs follow the next action, not clickability (`src/components/cards/`)

**Rule:** a card gets a persistent primary button only when the professional
owns the next action and that action is a meaningful step toward secured
work. `OfferCard` ("View offer"), `ContractCard` ("Open work"), and
`MatchCard` (its recommended action) have one. `ApplicationCard` has none:
the whole row opens the detail, and an action the professional owes shows
through its status and supporting text instead.

**Why:** every row is clickable, so "it can be opened" is not a reason for a
button (decided 2026-09-25). A button on every application would compete
with the few rows that really need the professional, and dilute the Offer's
"View offer", the step closest to securing work.

**How to apply:**

- Don't add a CTA to `ApplicationCard` because a design shows one, or to
  make the row "more clickable". Flag it instead. Rationale:
  `product-specs/offer-card.md` §4.1.
- Remove the CTA when the action goes away: a closed offer passes
  `showCta={false}`, and a paused contract suppresses its primary action.

## Lists of rows are one table list (`src/components/cards/`, `src/layouts/`)

**Rule:** row cards (`ApplicationCard`, `MatchCard`, `OfferCard`, and any
future row-shaped card) are always listed inside one bordered container,
with a divider between rows. They are never stacked as separate bordered
cards with gaps between them. This holds on every surface (Home modules,
Engagements views) and for any number of rows. A single row uses the same
container, so it looks the same as a standalone card.

**Why:** design direction (2026-09-25): a list of offers read differently
from the Applications and Matches lists next to it. One list pattern keeps
every row family consistent as items move between views and modules.

**Known-good shape:**

- Container: `flex w-full flex-col items-start overflow-hidden rounded-card
  border border-border shadow-[0px_2px_4px_0px_rgba(0,0,0,0.04)]`.
- Each row: `border-b border-border last:border-b-0`, on the row itself or
  on its motion wrapper when rows animate. The row card carries no border,
  radius, or shadow of its own.
- Removing a row in place (e.g. Decline): while other rows remain, the row
  leaves with `rowDismissVariants` (fade + height collapse, wrapper
  `overflow-hidden`). When it's the last row, the whole container leaves
  with `cardDismissVariants` instead, so an empty bordered box never shows.
  If an empty state replaces the list, it fades in after that exit
  (`AnimatePresence mode="wait"`).
- Grid cards are not rows: `ContractCard`, `NextStepCard`, and `CalloutCard`
  keep their own card treatment in a grid.

## Hide a `···` menu with only one item (`src/components/cards/`, `src/components/overlays/menu/`)

**Rule:** a row's `···` actions menu only shows when it holds 2 or more
items. With one item (or none), the trigger doesn't render at all. That one
action is either the row's own click (e.g. View details, when the whole row
already opens the detail) or belongs on the row itself.

**Why:** design direction (2026-09-25): a menu that opens to a single item
is an extra click that hides an action instead of offering a choice.

**How to apply:**

- `ApplicationCard` and `OfferCard` enforce it: they count `actionsMenu`
  with `countMenuItems` (from `@/components/overlays/menu`) and skip the
  trigger below 2 items. Keep passing the full, status-gated menu from the
  layout; don't add your own "only one item" branch.
- `countMenuItems` looks inside fragments, skips `false`/`null` from
  conditional items, and doesn't count `MenuSeparator`s.
- Any new card or row with a `···` menu must apply the same check. A
  consumer-owned menu opened through `onActionsPress` can't be counted, so
  that consumer applies the rule itself.
- `OfferCard` also drops its hover tint when a row has no click target and
  no menu, so a row that does nothing doesn't look clickable.

## Show section headings only when two sections have rows (`src/layouts/`)

**Rule:** a list split into labeled sections (e.g. `Action needed` /
`Last 15 days` / `Older`) shows its section headings only when at least two
sections have rows. With one section, the list renders on its own, with no
heading. Sections with no rows are always hidden. This applies to
Engagements → Applications (`Open`, `Not moving forward`), Engagements →
Offers → `Closed`, and any future list with the same layout.

**Why:** design direction (2026-09-25): a single heading above the only
list tells the professional nothing. It just pushes the list down. Grouping
only helps when there is something to tell apart.

**How to apply:**

- Render sectioned lists through `GroupedList` (in
  `src/layouts/engagements/engagements.tsx`). It takes every section with its
  rows and a `renderList` function, skips empty sections, and drops the
  headings when only one is left. Don't hand-roll the section loop.
- Section headings use `ListSection`: `sm` muted text, 8px above its list,
  32px between sections.
- Each section's list follows "Lists of rows are one table list".

## Hide search and filters when a view is empty (`src/layouts/`)

**Rule:** when a view has nothing under any of its filters (e.g.
Engagements → Talent Network with no memberships), it shows only the empty
state of its default filter: no search button and no filter row. The search
and filters come back as soon as any filter has an item.

**Why:** design direction (2026-09-25): search and filters over nothing are
controls with nothing to act on. They push the empty state down and suggest
there is content to narrow.

**How to apply:**

- Check the view's total across all filters, not the selected filter's.
  A view where only one filter is empty (e.g. `Closed` with no offers yet)
  keeps its search and filters, and that filter shows its own empty state.
- Show the default filter's empty state copy (e.g. Talent Network →
  `Active`), including its CTA.
- Engagements applies it to every filtered view: Applications, Offers,
  Contracts, and Talent Network. Assessments has no filters.

## Expanding search animates `width`, not `layout` (`src/components/forms/search-field/`)

**Rule:** `SearchField`'s expand/collapse animates the pill's `width`
directly with Motion (44px ↔ 240px), with `overflow-hidden` and
`rounded-full` on the same element. Don't switch it to a `layout`
animation.

**Why:** design direction (2026-09-25): the corners must stay fully round
while it expands and collapses. A `layout` size animation scales the
element with a transform, which squashes the radius and the border mid-way.
This is a documented exception to the Motion System's "prefer `layout`".

**Known-good shape:**

- Expand uses `standardTransition`, collapse the shorter `exitTransition`,
  both through `useMotionPreference().resolve` (instant under reduced
  motion).
- The 2px focused border is `border` + `inset-ring-1` in `input-ring`, so
  the icon and text never shift when focus arrives.
- Collapsed, an invisible React Aria `Button` covers the pill as the
  trigger, and the input sits in an `inert` wrapper so it can't be tabbed
  to. It collapses on blur only when empty.
