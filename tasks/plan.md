# Implementation Plan: Portfolio clone of achint.vercel.app (4lph7.me)

## Overview
Rebuild 4lph7.me as a functional and visual clone of https://achint.vercel.app/ with Arul's content. Supersedes `IMPLEMENTATION_PLAN.md` and the lime palette in `DESIGN.md` (decided with the user: exact clone). Original assets only: no reference copy, images, mp3s or model files are reused.

## Reference teardown (live-inspected)
- Stack: Vite + React + react-router, GSAP + ScrollTrigger, Lenis, three / R3F / drei (+ physics), React Bits pieces (StaggeredMenu, Lanyard), web3forms contact, 4 mp3 tracks, 3 canvases.
- Look: black `#000`, white text, blue `#3b82f6` / `#1d4ed8`, grid dots `#ffffff17`; light theme `rgb(244,247,252)`. Fonts: Supreme (body), Instrument (serif headings 60-72px), Aftersick (name), Oleana/Avocado/Quilon accents, ~17 display fonts for skill bubbles.
- Sections: Home, About, Projects, Education, Skills, Stats, Contact, Footer (details in tasks below). Global: StaggeredMenu overlay nav, Lenis smooth scroll, dark/light toggle.
- Unconfirmed (treat as unknown, verify in browser, do not invent): exact hover/cursor behaviour, preloader, page transitions.

## Architecture Decisions
- Keep Next 16 static export (GitHub Pages, CNAME, `/resume`, sitemap, robots). Read `node_modules/next/dist/docs/` before Next code (AGENTS.md).
- GSAP/Lenis/R3F/audio only in `"use client"` components; R3F via `next/dynamic({ ssr:false })`.
- Add deps: `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/rapier`, `meshline`. Remove `chart.js`/`react-chartjs-2` if unused after the rewrite.
- One animation loop: Lenis driven by GSAP ticker, `lagSmoothing(0)`, `lenis.on('scroll', ScrollTrigger.update)`. Honour `prefers-reduced-motion`.
- Fonts: free look-alikes (Instrument Serif, Satoshi/General Sans, Google display set).
- All content in typed `src/data/profile.ts`. Never publish DOB, phone, home address, family, ID numbers.
- Contact: web3forms via `NEXT_PUBLIC_WEB3FORMS_KEY`; `mailto:` fallback when unset.
- Content gaps flagged `TODO` in data: hobbies, GitHub counts/latest push, photo, lanyard texture, 4 royalty-free tracks, projects beyond PortfolioIQ / FPOLink TN / OmniRoute, web3forms key, social URLs.

## Dependency graph
```
tokens/fonts/theme + data/profile.ts
        -> shell (Lenis+GSAP provider, StaggeredMenu, theme toggle, footer)
        -> Hero -> About -> Projects -> Education
        -> Skills (physics) -> Stats (widgets, player, lanyard, globe) -> Contact
        -> cleanup -> audit/deploy
```

## Task List

### Phase 1: Foundation
- [x] Task 1: Tokens, fonts, theme toggle, data model
- [x] Task 2: Shell (Lenis/GSAP provider, StaggeredMenu nav, footer, back-to-top)

### Checkpoint A
- [ ] lint, typecheck, build, `verify:export` pass; shell matches reference at 375/768/1440

### Phase 2: Core sections
- [x] Task 3: Hero
- [x] Task 4: About
- [x] Task 5: Projects carousel
- [x] Task 6: Education

### Checkpoint B
- [ ] Top to Education parity with `REFERENCE.md` at 3 widths; console clean

### Phase 3: Interactive showpieces (highest risk)
- [x] Task 7a: Skills physics bubbles
- [x] Task 7b: Skills tabs, counts, tap hint, marquee
- [x] Task 8: Stats cards and runtime/hardware/location flip cards
- [x] Task 9: Vinyl music player
- [x] Task 10a: Lanyard 3D card
- [x] Task 10b: Theme globe

### Checkpoint C
- [ ] Static export builds with R3F; no console errors; smooth scroll; bundle size recorded

### Phase 4: Contact and ship
- [x] Task 11: Contact form and cursor visual
- [x] Task 12: Preserve `/resume`, metadata, sitemap; remove old components/CSS
- [ ] Task 13: Audit and deploy readiness

### Checkpoint D
- [ ] All acceptance criteria met; human review before pushing

## Tasks in detail

### Task 1: Tokens, fonts, theme toggle, data model (S)
Acceptance: black/blue tokens in `globals.css`/`tokens.css`; dark default; light theme toggles and persists (try/catch storage); `profile.ts` typed with `TODO` flags and no private details.
Verify: `npm run typecheck`, `npm run lint`.
Deps: none. Files: `src/app/{globals.css,tokens.css,layout.tsx}`, `src/data/profile.ts`.

### Task 2: Shell (M)
Acceptance: StaggeredMenu opens/closes, links Home/About/Projects/Education/Skills/Contact + GitHub/LinkedIn/X; anchors scroll smoothly; back-to-top works; reduced-motion disables smoothing; footer has blurb, nav, socials, copyright.
Verify: build; browser 375/768/1440; console clean.
Deps: 1. Files: `components/site/{SmoothScroll,StaggeredMenu,Footer,ThemeToggle}.tsx`, `app/page.tsx`.

### Task 3: Hero (M)
Acceptance: full-viewport, name treatment, tagline, location + live IST clock, "Available" badge, "Email me" mailto.
Verify: visual parity; clock ticks; no layout shift. Deps: 2.

### Task 4: About (M)
Acceptance: ScrollTrigger scrubbed word-reveal paragraph; 3 chapter cards; "Off the keyboard" cards (TODO-flagged); CTA + "Connect with me" marquee.
Verify: reduced-motion shows static text; 375px no overflow. Deps: 2.

### Task 5: Projects carousel (M)
Acceptance: full-screen carousel; prev/next buttons, arrow keys, swipe; shows title, summary, tags, repo link; counter "PROJECT n / N"; accessible names.
Verify: keyboard-only pass; links open. Deps: 2.

### Task 6: Education (S)
Acceptance: 3 stage cards (SSLC, HSC, B.E. CSE-Data Science, Annamalai University 2022-2026) with years and 2016-2026 timeline.
Verify: parity at 3 widths. Deps: 2.

### Task 7a/7b: Skills (L split)
Acceptance: physics bubbles (canvas) with 17+ items; tap/click interaction; tabs All/Frontend/Backend/Tools with counts and `aria-selected`; touch hint text; marquee.
Verify: tab filter updates bubbles; 60fps-ish; no console errors. Deps: 2.

### Task 8: Stats and widgets (M)
Acceptance: Hireable, open-source count (flagged), latest push (static, no live API dependency), runtime/hardware/location flip cards (tap on touch, hover on desktop).
Verify: keyboard reachable. Deps: 2.

### Task 9: Vinyl player (M)
Acceptance: 4 original/royalty-free tracks, play/pause, next/prev, seek, volume, mute; starts only on user gesture; labelled controls.
Verify: no autoplay; works after track end. Deps: 8.

### Task 10a/10b: Lanyard and globe (L split)
Acceptance: lanyard card with physics and Arul's texture, lazy-loaded with static fallback for reduced-motion/low-end; globe canvas reflects theme.
Verify: `next build` export succeeds; client-only. Deps: 1, 8.

### Task 11: Contact (M)
Acceptance: required labelled name/email/message, validation, polite live status region, web3forms POST or mailto fallback, cursor-reactive visual (disabled on touch).
Verify: invalid submit blocked; success and failure messages. Deps: 2.

### Task 12: Preserve and clean (S)
Acceptance: `/resume`, not-found, metadata, sitemap, robots still build; unused components/deps removed.
Verify: `verify:export`. Deps: 3-11.

### Task 13: Audit and deploy readiness (M)
Acceptance: lint/typecheck/build/export pass; Lighthouse scores measured and reported; keyboard, focus, contrast, reduced-motion checks; Actions workflow and `CNAME` confirmed.
Verify: report only measured results. Deps: 12.

## Risks and Mitigations
| Risk | Impact | Mitigation |
|---|---|---|
| R3F/rapier with static export | High | `ssr:false`, build early in Task 10 |
| Heavy bundle hurts LCP | Med | lazy-load 3D/audio, static fallbacks |
| Font look mismatch | Med | free look-alikes, one tuning pass |
| Missing personal content | Med | TODO flags, content checklist at each checkpoint |
| Unconfirmed reference details | Low | verify in browser, do not invent |

## Open Questions
- web3forms access key (or other form backend)?
- Photo, lanyard texture and 4 music tracks to use?
- Confirm social URLs and the project list (up to 11).
