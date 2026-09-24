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

## Row hover — every card and table row uses `hover-row` (`src/styles/theme.css`)

**Rule:** The hover fill for a card or a table row is always
`--hover-row` (`bg-hover-row`), Figma's `state/hover-row` — `neutral-700`
at 2%. It is the one row-hover token: don't give a card or row its own
tint, and don't reach for `--hover`.

| Token          | Figma              | Value            | Use for                                                      |
| -------------- | ------------------ | ---------------- | ------------------------------------------------------------ |
| `--hover-row`  | `state/hover-row`  | neutral-700 @ 2% | Card hover states, table rows (when tables land)             |
| `--hover`      | `state/hover`      | neutral-700 @ 4% | Controls and list items: Button, AccountTrigger, Select/Menu items |
| `--icon-hover` | raw fill on `button` Type=Icon | neutral-700 @ 8% | Ghost/Neutral icon-only Button                    |

**Why:** Figma deliberately splits row hover (large surfaces, lighter) from
control hover (small targets, stronger). The two had previously collapsed
into one code token (`--row-hover`, bound to `state/hover`) and drifted
with it — a 2% → 4% change meant for controls silently darkened every card.
Keeping one code token per Figma variable means a change to one can't leak
into the other.

**How to apply:**

- **New card or table row:** `hover:bg-hover-row` (or `group-hover:` /
  `has-[…]:` when the row stays highlighted, e.g. while its menu is open —
  see `ApplicationCard`). Don't use `bg-hover`, `bg-neutral-*`, or an
  arbitrary `color-mix`.
- **Exception — Next Step card:** its hover is a different treatment (the
  dashed tile turns into a solid white card with a border), not a tint, so
  it doesn't use `hover-row`.
- **Adding a hover-ish token:** add it as its own variable mapped to its
  own Figma variable (`:root` + `@theme inline`), even when its value
  currently matches an existing one.

---

## Page shell responsiveness — one behavior for every layout (`src/layouts/`)

**Rule:** Every page layout uses the same shell and the same responsive
behavior. A sticky `Sidebar` sits on the left, and a canvas column fills the
rest. Don't give one page its own gutters, breakpoints, or sidebar logic.

| Width              | Sidebar                  | Canvas padding (x)       | Card grids |
| ------------------ | ------------------------ | ------------------------ | ---------- |
| below `lg` (1024)  | auto-collapsed           | `px-12` (48 / 48)        | 2-up       |
| `lg` to below `xl` | user's choice            | `px-12` (48 / 48)        | 2-up       |
| `xl` (1280) and up | user's choice            | `xl:pl-16 xl:pr-40` (64 / 160) | 3-up |
| `2xl` (1536) and up | user's choice           | same as `xl`             | 3-up (Next Steps: 4-up) |

- **Canvas padding** comes from `layoutCanvasPaddingClassName` in
  `src/layouts/shared/layout-canvas.ts`. It does not change when the sidebar
  collapses. Use it on the canvas column:
  `cn("flex min-w-px flex-1 flex-col items-center", layoutCanvasPaddingClassName)`.
- **Content column:** `w-full max-w-[1400px]`, centered by the canvas, with
  `pb-[104px]`.
- **Sidebar auto-collapse:** below `lg` the sidebar collapses on its own,
  including on first load at a narrow width. Crossing back above `lg`
  restores the earlier state, but only if the collapse was automatic. Once
  the user toggles the sidebar, their choice sticks. The logic and its full
  rationale live in `Dashboard` (`wasAutoCollapsedRef`).
- **Card grids:** `grid-cols-2 xl:grid-cols-3`. The Next Steps grid adds
  `2xl:grid-cols-4`, and queues extra cards instead of wrapping them to a
  second row (see `NextStepsSection`).

**Why:** Each layout used to set its own canvas padding, and they drifted.
Dashboard started at a fixed `pr-[216px]`, later became `xl:pr-30` with a
left gutter that grew when the sidebar collapsed, while Engagements used
`xl:pr-40 xl:pl-16`. The pages didn't line up when you switched between
them. The Engagements gutters were chosen as the standard (2026-09-23) and
moved into one shared constant, so a change there reaches every page.

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

⚠️ **Decision needed:** top padding still differs — both Dashboards use
`pt-10` (40px) and Engagements uses `pt-14` (56px). Pick one and add it to
the shared shell.
