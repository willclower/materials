# Challenges Catalog

Client-specific landing pages for the Mediterranean Wellness challenges catalog. Each page is a thin branded wrapper around a self-hosted flipbook + downloadable PDF.

## Structure

```
challenges_catalog/
├── index.html                       → generic Mediterranean Wellness version
├── concentra/
│   ├── index.html                   → /concentra
│   └── flipbook/                    → upload FlipHTML5 files here
├── hcs/
│   ├── index.html                   → /hcs
│   └── flipbook/
├── onetoonehealth/
│   ├── index.html                   → /onetoonehealth
│   └── flipbook/
├── flipbook/                        → flipbook for the root /index.html
├── assets/
│   ├── challenges-catalog.pdf       → ⚠️ ADD THIS FILE
│   └── logos/
│       ├── medwell.png
│       ├── concentra.png
│       ├── onetoonehealth.png
│       └── hcs.jpg
└── shared/
    └── styles.css                   → all styling lives here
```

## URLs (after GitHub Pages is enabled)

- `https://willclower.github.io/challenges_catalog/concentra/`
- `https://willclower.github.io/challenges_catalog/hcs/`
- `https://willclower.github.io/challenges_catalog/onetoonehealth/`
- `https://willclower.github.io/challenges_catalog/` (generic)

Each is `noindex, nofollow` — won't appear in Google. Only people with the direct link will find them.

## Setup checklist

Before pushing to GitHub:

1. **Upload the FlipHTML5 files** for each client into their `flipbook/` folder. The downloaded FlipHTML5 zip contains an `index.html` plus a bunch of supporting folders (`files/`, `mobile/`, etc.) — drop them all in. The placeholder index.html currently there will be overwritten.
   - For now, the simplest move: use the same flipbook files for every client. Same content, just different wrappers.
   - Later you can swap in client-specific flipbooks (e.g. with a custom cover page) if it makes sense.

2. **Drop the PDF** at `/assets/challenges-catalog.pdf`. All "Download PDF" buttons point here.

3. **Push to GitHub** and enable Pages: Repo Settings → Pages → Source: `main` branch, root folder.

## Brand palettes (extracted from logo files)

| Client | Primary | Accent |
|---|---|---|
| Mediterranean Wellness | `#1e96b4` cyan | `#a0c832` lime |
| Concentra | `#00508c` navy | `#f28936` orange |
| One-to-One Health | `#004664` deep teal | `#90bf47` sage |
| HCS Healthcare Strategies | `#3c6e8c` dusty blue | `#8c8278` warm taupe |

## Typography

The site uses **Jost** (Google Fonts) — a geometric sans inspired by Futura, very close in feel to Century Gothic. Century Gothic itself is set as a fallback for browsers that have it installed (most Windows machines). This means:

- The site looks consistent across all browsers and devices
- Users with Century Gothic installed will see Century Gothic
- Everyone else sees Jost (visually nearly identical)

## Adding a new client page

1. Copy any existing client folder (e.g. `concentra/`) and rename it.
2. In the new `index.html`, change:
   - **Brand colors** in the `:root` block at the top of the `<style>` tag
   - **Client name** wherever it appears (top bar logo, hero, footer)
   - **Logo image** in the top bar (add a new file to `/assets/logos/`)
   - **Intro copy** — the `<p class="hero-intro">` paragraph
3. Drop the client's flipbook files into the new folder's `flipbook/` subfolder.
4. Commit and push. New page is live.

## Contact

Default contact email throughout: `admin@mymedwellness.com`

## Tracking (optional, later)

If you want per-client engagement data, add a lightweight analytics snippet (Plausible, Fathom, or PostHog) to `shared/styles.css`'s sibling — or drop the script tag at the bottom of each `index.html`. Each client folder is a separate URL so you'll get clean per-client metrics for free.
