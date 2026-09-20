# wnnaFuk — agent conventions

Project conventions for all phases. Do not restate these in phase plans; reference this file.

## Stack

- **Next.js ≥16.3.3** (Active LTS security floor — never pin below 16.3.3; August 2026 security release)
- **React / react-dom:** whatever `create-next-app` resolved; do not hand-pin React versions
- **TypeScript ≥5.1**, strict mode
- **Node ≥20.9.0**
- **Tailwind CSS v4** — design tokens in `app/globals.css` via `@theme`, not a v3 `tailwind.config.ts`
- **pnpm** package manager

Resolved at scaffold (Phase 1): Next 16.3.5, React 19.2.8, TypeScript 5.9.3.

## Architecture

- **Static export only** (`output: 'export'`). No SSR, no Next.js API routes, no Route Handlers.
- All backend work in later phases goes through **Lambda + API Gateway + DynamoDB**, provisioned via the shared `static-site` module's `enable_api` flag (same-origin `/api/*` through CloudFront).
- **No PII in app data stores.** DynamoDB may store Cognito user IDs (opaque UUIDs) and self-authored profile text only. No emails, phone numbers, or file uploads. Cognito holds credentials on AWS's side of the line.

## Roles

Use the product vocabulary consistently:

- **Host** — creates and manages schedules (optional email for notifications in a later phase)
- **Dater** — username-only sign-in in a later phase

Do not use generic "user" / "admin" when the domain role applies.

## Code style

- App Router; `"use client"` only when needed (browser APIs, interactivity, hooks)
- Prefer server components for static layout shells
- shadcn/ui for UI primitives (initialized in Phase 1; add components as needed)
- No Workbox — hand-written service worker in `public/sw.js`

## Visual identity

90s comic book aesthetic — bold primary colors, halftone textures, heavy black outlines, `?` as the central motif. **Not** the robmclaughl.in CRT/lofi look (that belongs to the root site).

Design tokens live in `app/globals.css`. Display font via `@fontsource/bangers` (bundled to same origin at build time).

## Infrastructure

- Deploy apparatus follows the **deploy-to-prod** skill (Terraform wrapper → `static-site` module, one-time `scripts/bootstrap.sh`, Terraform-free CI).
- **Phase 2 CSP:** loosen Content-Security-Policy via the module's `csp_override` variable for the Cognito SDK. Do not edit the shared `security-headers-policy`.

## CI deploy cache-control

Two-pass S3 sync in `.github/workflows/deploy.yml` — do not collapse to a single sync:

1. `_next/static/*` first — immutable, no `--delete`
2. Everything else — `no-cache`, `--delete`, exclude `_next/static/*`

Order and flags are load-bearing for PWA service-worker updates.
