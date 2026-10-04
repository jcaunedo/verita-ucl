# Verita AI UCL (Unified Content Library)

Shared React component library for Verita AI frontend applications.

## Tech Stack

- React 19
- TypeScript (strict mode)
- Tailwind CSS 4
- Untitled UI
- React Aria (accessible component primitives)
- Storybook 10
- tsup (ESM bundling)

## Getting Started

```bash
npm install
npm run storybook
```

Storybook launches on [http://localhost:6009](http://localhost:6009) where you can browse all components, variants, and the color palette.

## Commands

| Command                   | Description                             |
| ------------------------- | ---------------------------------------- |
| `npm run storybook`       | Launch Storybook dev server (port 6009) |
| `npm run build`           | Build library to `dist/`                |
| `npm run dev`             | Build in watch mode                     |
| `npm run lint`            | Type-check with TypeScript              |
| `npm run build-storybook` | Build static Storybook site             |

## Retrying a Failed Netlify Deploy

The Storybook site deploys to Netlify on every push to `main` (see `netlify.toml`). If a deploy fails before the build
starts, for example with "Failed during stage 'preparing repo'" or "Host key verification failed", Netlify couldn't
fetch the repo and the code isn't at fault. Push an empty commit to trigger a fresh deploy:

```bash
git commit --allow-empty -m "chore: retry Netlify deploy"
git push
```

If it fails the same way again, re-link the repository in Netlify (Project configuration → Build & deploy → Continuous
deployment → Manage repository → Link to a different repository).

## Using in an App

This package is not yet published to a registry. For now, consume it locally
(e.g. `npm link`, a workspace reference, or a git dependency) until a
registry/org is set up.

Import the theme in your app's global CSS:

```css
@import "tailwindcss";
@import "verita-ai-ucl/styles";
@source "../node_modules/verita-ai-ucl/dist";
```

Use components:

```tsx
import { Typography } from "verita-ai-ucl";
```

## Project Structure

```
src/
  index.ts                  # Public API exports
  lib/
    utils.ts                # cn() class merge utility
    motion/                 # Motion tokens, transitions, variants, patterns
  styles/
    theme.css               # Design tokens (shipped to consumers)
    globals.css             # Storybook internal CSS
  components/
    typography/              # Typography component (template for new components)
    colors/                 # Color palette stories
  layouts/                  # Full-page reference layouts assembled from components
product-specs/              # Product specs (PRDs) for Verita AI
```

## Product Specs

`product-specs/` holds the product specs for Verita AI. Every doc there follows
the status-label and creation-header conventions in `CLAUDE.md` →
"product-specs writing conventions".

## Design Tokens

`src/styles/theme.css` is seeded with a stock neutral palette as an
unbranded starting point (see the `:root` / `.dark` primitive blocks). Swap in
real brand tokens once a design system exists — the semantic token
architecture (`@theme inline` role mappings) is meant to stay stable across
that change.

## AI-Assisted Development

This repo includes a `CLAUDE.md` file that provides context for
[Claude Code](https://docs.anthropic.com/en/docs/claude-code) when working on
this codebase. It documents component patterns, how to add or update
components, and the library architecture. You can safely ignore this file for
normal development.
