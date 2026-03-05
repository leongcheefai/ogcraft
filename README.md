# OGCraft

Generate professional Open Graph images in seconds. No design skills needed.

## Features

- **Live Preview** - See your OG image update in real-time as you edit
- **8 Themes** - Midnight, Praxor, Volt, Aurora, Sunrise, Forest, Zinc, and Paper
- **Custom Logo** - Upload your own logo to brand your OG images
- **PNG Export** - Export OG images at the standard 1200x630 resolution
- **Responsive** - Works on desktop and mobile

## Tech Stack

- [Next.js](https://nextjs.org) 16 (App Router)
- [React](https://react.dev) 19
- [Tailwind CSS](https://tailwindcss.com) 4
- [Satori](https://github.com/vercel/satori) + [@resvg/resvg-wasm](https://github.com/nicbarker/resvg-wasm) for server-side OG image rendering
- [shadcn/ui](https://ui.shadcn.com) components

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

1. Configure your OG image using the left panel (title, description, URL slug, theme, logo)
2. Preview the result in real-time on the right
3. Export as a 1200x630 PNG

## License

MIT
