# Todo: Portfolio clone of achint.vercel.app

Plan: `tasks/plan.md`

## Phase 1: Foundation
- [x] 1. Tokens, fonts, theme toggle, data model (data lives in src/data/site.ts; lint+build not run in sandbox, run locally)
- [x] 2. Shell: Lenis/GSAP provider, StaggeredMenu, footer, back-to-top (needs local browser check; #projects anchor works after Task 5)
- [ ] Checkpoint A: lint, typecheck, build, verify:export; shell parity at 375/768/1440

## Phase 2: Core sections
- [x] 3. Hero (needs local browser check)
- [x] 4. About (needs local browser check)
- [x] 5. Projects carousel (needs local browser check)
- [x] 6. Education (needs local browser check)
- [ ] Checkpoint B: top to Education parity; console clean

## Phase 3: Interactive showpieces
- [x] 7a. Skills physics bubbles (needs local browser check)
- [x] 7b. Skills tabs, counts, hint, marquee (needs local browser check)
- [x] 8. Stats and flip cards (needs local browser check)
- [x] 9. Vinyl music player (needs mp3s in public/music + local browser check)
- [x] 10a. Lanyard 3D card (needs local build + visual tuning)
- [x] 10b. Theme globe (needs local browser check)
- [ ] Checkpoint C: export builds with R3F; no console errors; bundle size noted

## Phase 4: Contact and ship
- [x] 11. Contact form and cursor visual (needs web3forms key + local browser check)
- [x] 12. Preserve /resume, metadata, sitemap; cleanup (old files parked in _to_delete/; run npm uninstall chart.js react-chartjs-2)
- [ ] 13. Audit and deploy readiness (code-side done; run lint, build, verify:export and Lighthouse locally and report scores)
- [ ] Checkpoint D: human review before pushing

## Inputs needed from Arul
- [ ] web3forms key
- [ ] Photo and lanyard texture
- [ ] 4 royalty-free tracks
- [ ] Social URLs and project list

## 2026-10-21 rebuild pass
- [x] Rebuilt every section to match the reference layout and motion with original copy, mascot and code
- [x] Verified in headless Chrome at 1440 and 375: no console errors, no load jump, menu/Escape, theme, carousel (buttons + arrows), skill tabs, form validation
- [x] typecheck, lint, 70 tests, static export build pass (build needs NODE_ENV=production; the shell had it set to development)
- [ ] Add the three remaining music tracks and the web3forms key check on the live domain
