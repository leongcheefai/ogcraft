# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

OGCraft — an instant Open Graph (1200×630) image generator. Users configure title, description, slug, background (gradient/solid + grid overlay), and logo, then export as PNG.

## Commands

```bash
pnpm dev          # Start dev server (Turbopack)
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # ESLint
```

## Tech Stack

- **Next.js 16** (App Router, RSC) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** via `@tailwindcss/postcss` (no tailwind.config — config in `globals.css`)
- **shadcn/ui** (New York style, Radix UI primitives) — components in `components/ui/`
- **Satori + @resvg/resvg-wasm** for server-side HTML→SVG→PNG rendering
- **next-themes** for dark/light mode
- Package manager: **pnpm**

## Architecture

**Single-page app** (`app/page.tsx`) with client-side state. No database, no auth.

### Data Flow
```
LeftPanel (user input) → setConfig() in page.tsx → OGPreview (live CSS preview)
                                                  → ExportButton → renderOGImage() → PNG
```

### Rendering Pipeline (`lib/render-og.ts`)
1. Fetches Inter font via `/api/font` proxy (forces TTF from Google Fonts)
2. Satori renders React JSX elements to SVG
3. Resvg WASM converts SVG to PNG (loaded from unpkg CDN, cached globally)
4. Returns `Uint8Array` for download or clipboard

### Key Types (`lib/og-types.ts`)
- `OGConfig` — top-level config (title, description, slug, background, logo)
- `BackgroundConfig` — mode, colors, gradient direction, grid overlay
- `GridOverlayConfig` — pattern (none/grid/graph/dots), color, opacity, blur

### Color System (`lib/color-utils.ts`)
Uses WCAG 2.0 luminance to auto-select dark/light text over any background. `bg-presets.ts` has 28 gradient + 28 solid presets.

## Path Aliases

`@/*` maps to project root (e.g., `@/components/ui/button`, `@/lib/utils`).

## Conventions

- Kebab-case filenames for all components and utilities
- Functional components with hooks; no class components
- Default exports for page/layout components; named exports for utilities
- shadcn/ui components use CVA for variants — add new UI primitives via `npx shadcn@latest add`
- Tailwind v4 theme tokens defined as CSS variables in `app/globals.css`
