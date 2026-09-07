<!--
Created: Sep 06, 2026
Created by: Julio Caunedo
Last updated: Sep 06, 2026
Scope: control size scale used by buttons, inputs, selects, and other form controls.
Purpose: document the shared 5-step height scale and its relationship to Untitled UI's own sizing.
-->

# Control Size Scale

**Applies to:** buttons, inputs, selects, search inputs, numeric inputs — and future controls: pills, button groups, toggles, segmented controls.

All interactive form controls share one 5-step height scale. Using a single scale across all controls keeps forms and toolbars visually aligned without per-component size negotiation.

## Scale

| Token | Height | Tailwind | Role                                         |
| ----- | ------ | -------- | -------------------------------------------- |
| `xs`  | 32 px  | `h-8`    | Very compact — dense toolbars, tags          |
| `sm`  | 36 px  | `h-9`    | **Default ★** — most surfaces in the product |
| `md`  | 40 px  | `h-10`   | Dense / default-small                        |
| `lg`  | 44 px  | `h-11`   | Large — prominent actions, emphasis rows     |
| `xl`  | 48 px  | `h-12`   | Large / emphasis — hero forms, onboarding    |

`sm` is the product default. Use it unless a specific density requirement forces otherwise. Never mix sizes within a single row/toolbar.

✅ **Confirmed 2026-09-06:** heights updated from 24/28/32/36/40px to 32/36/40/44/48px to match Untitled UI's own rendered button heights (measured directly from their component, not derived from their padding/text-size math — see the note below on why that derivation undercounted). Figma's `button` component set and `Button`/`theme.css` have both been updated to match.

ℹ️ Note: an earlier version of this doc stated Untitled UI's `Button` has no fixed per-size heights, reasoning from its padding/text-size classes alone (e.g. `xs`: `py-1.5` + `text-sm` line-height ⇒ ~32px). That arithmetic undercounted — Untitled UI's actual rendered heights are the 32/36/40/44/48px scale now adopted here. Derived-from-CSS math is not a substitute for the real rendered value.

✅ **Confirmed 2026-09-06:** the product default moved from `lg` to `sm`, now matching Untitled UI's own `Button` default exactly. This supersedes the prior decision on this page to keep Figma's `lg`-labeled "(Default)" variant authoritative over Untitled UI's convention. Figma's component set and `Button`'s `defaultVariants` have both been updated to `sm`.

## CSS custom properties

The scale is declared in `src/styles/theme.css` (`@theme inline` block) as `--control-h-{step}` and is available as CSS custom properties for consumers who need the raw values.

```css
--control-h-xs: 2rem; /* 32px */
--control-h-sm: 2.25rem; /* 36px */
--control-h-md: 2.5rem; /* 40px */
--control-h-lg: 2.75rem; /* 44px */
--control-h-xl: 3rem; /* 48px */
```

## Component support

| Component      | Sizes supported        | Default |
| -------------- | ---------------------- | ------- |
| `Button`       | xs · sm · md · lg · xl | `sm`    |
| `Input`        | xs · sm · md · lg · xl | `sm`    |
| `SearchInput`  | xs · sm · md · lg · xl | `sm`    |
| `NumericInput` | xs · sm · md · lg · xl | `sm`    |
| `Select`       | xs · sm · md · lg · xl | `sm`    |

> Future components (pill, toggle, button group, segmented control) must implement the same `size` prop with these five steps and the same `sm` default.

## Usage

```tsx
// Default (sm — 36 px)
<Button>Save</Button>
<Input placeholder="Email" />
<Select><SelectTrigger>…</SelectTrigger></Select>

// Compact row
<Button size="xs">Filter</Button>
<Input size="xs" placeholder="Search…" />

// Large / hero form
<Button size="xl">Get started</Button>
<Input size="xl" placeholder="Your email" />
```
