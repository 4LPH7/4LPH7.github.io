# 4LPH7.me

Personal engineering portfolio for ARUL G, built with Next.js and exported as static files for GitHub Pages.

## Requirements

- Node.js 24 (see `.nvmrc`)
- npm

## Local development

```sh
npm ci
npm run dev
```

## Checks and production build

```sh
npm run lint
npx tsc --noEmit
npm run build
npm run verify:export
```

The static export is generated in `out/`. GitHub Actions deploys it to Pages on pushes to `main`. Configure `4lph7.me` under the repository's **Settings → Pages → Custom domain**; the existing `CNAME` is retained for reference.

## Portfolio content

Edit `src/data/portfolio.ts`. Only publish claims that have a source attached. Repository documentation is evidence that the repository says something, not independent validation of security, performance, or impact. Contact uses the public GitHub profile until a verified email address is added. FPOLink and PortfolioIQ descriptions summarize their linked repository READMEs; each claim links to its source and is labeled self-reported rather than independently audited. The hero's CSS cursor-ring interaction is an original lightweight adaptation inspired by OriginKit's interactive component catalog.