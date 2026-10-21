# 4LPH7.me

Interactive portfolio for Arul G. Next.js 16 static export, deployed to GitHub Pages at https://4lph7.me.

## Stack

Next.js 16 (`output: "export"`), React 19, TypeScript, GSAP + ScrollTrigger, Lenis smooth scroll, React Three Fiber + Rapier (lanyard card), canvas 2D (skills physics, globe), Biome for linting.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run lint` | Biome lint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Unit tests for `src/lib` and `src/data` |
| `npm run build` | Static export to `out/` |
| `npm run verify:export` | Checks the exported site |

## Editing content

All copy lives in `src/data/site.ts` (name, projects, skills, education, tracks). Unfilled items are listed in its `todo` array. `/resume` renders from the same file.

## Contact form

Set `NEXT_PUBLIC_WEB3FORMS_KEY` in `.env` (see [web3forms](https://web3forms.com)). Without it the form reports an error and the visible email link is the fallback.

## Music

Drop four tracks at `public/music/track-1.mp3` … `track-4.mp3` and update titles/artists in `site.tracks`.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml` (install, lint, typecheck, test, build, verify, publish). `CNAME` holds the custom domain.
