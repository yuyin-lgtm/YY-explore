# Reacher DS v2 Storybook

Clickable catalog for Reacher Design System v2. Tokens, components, and the example page live in this folder and do not change the rest of the app.

Published site: https://yuyin-lgtm.github.io/YY-explore/

## Run

```bash
cd ds-v2-storybook
npm install
npm run dev
```

Open http://localhost:6006/YY-explore/ — the dev server uses the same `/YY-explore/` base path as GitHub Pages.

```bash
npm run typecheck
npm test          # Storybook stories + play functions, Chromium via Vitest
npm run build     # static site in storybook-static/
```

The first test run needs a Playwright browser:

```bash
npx playwright install chromium
```

## Add a component

1. Add `src/components/<name>.tsx`. Style with Tailwind utilities that point at the CSS variables (`bg-accent`, `h-control`, `rounded-panel`, `font-body`). Use `motion` and `motionTokens` for movement, and `useReducedMotion` so reduced motion is a short fade with no travel.
2. Add `<name>.stories.tsx` with `tags: ["autodocs"]`, args for each variant and state, and a `play` function for the interaction.
3. Export it from `src/index.ts`.
4. Run `npm test`.

Icons are `lucide-react` at stroke 1.5. Controls stay 32px tall (28px small). Buttons are pills. There is no header or top nav.

## How tokens map

Source of truth: `src/styles/tokens.css`, loaded with `data-accent="reacher"` on `<html>`.

| CSS variable | Tailwind |
| --- | --- |
| `--accent`, `--foreground`, `--danger`, status colors | `bg-accent`, `text-foreground`, `text-danger`, `bg-success-subtle`, … via `@theme inline` |
| `--radius-control` 14, `--radius-item` 12, `--radius-panel` 26, `--radius-surface` 34, `--radius-pill` | `rounded-control`, `rounded-item`, `rounded-panel`, `rounded-surface`, `rounded-pill` |
| `--shadow-resting`, `--shadow-raised`, `--shadow-floating` | `shadow-resting`, `shadow-raised`, `shadow-floating` |
| `--size-control` 32 / `--size-control-sm` 28 | `h-control`, `h-control-sm` |
| `--text-title` 24/32 600, `--text-heading` 16/24 600, `--text-body` 14/20 400, `--text-caption` 12/16 | `font-title`, `font-heading`, `font-body`, `font-caption` |
| `--foreground` `#27272A`, `--text-secondary` `#6B6B73` | `text-foreground`, `text-secondary`. Hover and pressed tints mix this foreground at 4% and 6%. |
| `--focus-ring` `0 0 0 3px rgb(53 89 233 / 0.22)` | Keyboard focus only (`:focus-visible`). No outline. Neutral and outline controls also switch their border to `--accent-border`. |
| `--surface-hover` 4%, `--surface-pressed` 6% | `bg-hover`, `bg-pressed` |
| Motion durations and easings | `src/lib/motion.ts` (`motionTokens`) and `--duration-*` / `--ease-*` |

Page layout uses only the six spacing steps (`--space-tight` through `--space-spacious`). Grids are 12 / 8 / 4 columns at desktop / tablet / phone. Dialogs are one style: 560 or 400 wide; `destructive` only changes the primary button.

UI Arc (https://uiarc.dev) free registry items are the interaction reference (MIT © 2026 Elia Kuratli). Motion presets match `@uiarc/arc-motion-tokens`. Pro components are not included. Spinner and Paywall are Reacher-only.

## GitHub Pages

`.github/workflows/deploy-ds-v2-storybook.yml` runs the interaction tests, then on `main` uploads `storybook-static` with the Pages actions. The Storybook `base` is `/YY-explore/`.

Pages has to use **GitHub Actions** as the source. See the pull request for the exact settings click if the site is not live yet.
