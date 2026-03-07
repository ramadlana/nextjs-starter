# AGENTS.md — AI Agent Guidelines

This document guides AI agents and developers working on this codebase. **This project prioritizes long-term stability, security, and proven engineering practices.**

---

## 1. Core Principles

| Principle | Meaning |
|-----------|---------|
| **Stability** | Prefer stable, well-maintained libraries. Avoid experimental or bleeding-edge packages. |
| **Proven** | Use widely adopted, production-tested 3rd party libraries. |
| **Security** | Follow security best practices. Never expose secrets. Validate inputs. |
| **UI/UX** | Follow accessibility, responsiveness, and usability best practices. |
| **Scalable** | Design for growth: clear separation of concerns, testable code, maintainable structure. |
| **Best practice** | Follow industry standards for the stack (Next.js, React, Prisma, etc.). |

---

## 2. Library Selection Policy

### Do

- **Use established libraries** with strong community, regular releases, and clear documentation.
- **Prefer libraries** that work with the current stack (React 19, Next.js 16) without peer dependency hacks.
- **Check compatibility** before adding a package: peer deps, maintenance status, license.
- **Prefer minimal dependencies** — avoid heavy meta-frameworks when a lighter alternative exists.

### Do Not

- **Avoid experimental packages** or those with `alpha`/`beta`/`rc` in version.
- **Avoid packages** that require `--legacy-peer-deps` or `--force` to install (indicates compatibility issues).
- **Avoid duplicate functionality** — if the stack already provides something (e.g. Tailwind for styling), don’t add another layer.
- **Avoid unmaintained packages** — check last publish date and issue/PR activity.

### Current Stack (Reference)

| Category | Library | Rationale |
|----------|---------|-----------|
| Framework | Next.js 16, React 19 | Industry standard, Vercel-backed |
| Styling | Tailwind CSS | Utility-first, widely adopted |
| UI Primitives | Radix UI | Accessible, unstyled, stable |
| Auth | jose (JWT), argon2 | Standards-based, secure |
| DB | Prisma + PostgreSQL | Type-safe ORM, migrations |
| Charts | Chart.js + react-chartjs-2 | Mature, widely used |
| Markdown | react-markdown, remark-gfm | Standard, extensible |
| Testing | Vitest, React Testing Library | Fast, React-focused |

---

## 3. Security Best Practices

### Authentication & Authorization

- **JWT in HTTP-only cookies** — tokens are not accessible to JavaScript; use `dashx-token` cookie.
- **`JWT_SECRET`** — must be set in production; never commit or hardcode.
- **Role-based access** — use `withAuthPage(..., ["ADMIN"])` for admin-only pages; `withRole(handler, ["ADMIN"])` for admin-only APIs.
- **Never trust client** — validate all inputs server-side; assume client data can be forged.

### API Keys & Secrets

- **Keep secrets on the server** — use the server-proxy pattern: client → your API → external service. Never send API keys from the browser.
- **Use `process.env`** — store keys in environment variables; document required vars (e.g. in README or `.env.example`).
- **Validate params** — e.g. lat/lon ranges for weather API; sanitize filenames for uploads.

### Input Validation & Output

- **Sanitize user input** — filenames, query params, request bodies.
- **Allowlist over blocklist** — e.g. allowed MIME types for uploads, not “disallowed” list.
- **Limit payload size** — e.g. 5MB for uploads; reject oversized requests early.

### References

- Auth helpers: `lib/auth.js` — `verifyAuth`, `withAuth`, `withRole`, `withAuthPage`
- See `pages/example/server-proxy.js` for server-proxy pattern; `pages/example/client-public-api.js` for public API (no key) pattern.

---

## 4. UI/UX Best Practices

### Layout & Responsiveness

- **Layout** — use `components/Layout.js` for authenticated pages (sidebar, navbar, user menu).
- **Mobile-first** — sidebar collapses to drawer on small screens; ensure touch targets are adequate.
- **Consistent spacing** — use Tailwind spacing scale (`p-4`, `gap-6`, etc.).

### Accessibility

- **Semantic HTML** — use `<button>`, `<nav>`, `<main>`, etc. appropriately.
- **ARIA** — add `aria-label` for icon-only buttons; `aria-hidden` for decorative elements.
- **Focus** — ensure interactive elements are keyboard-focusable; avoid `outline: none` without a visible focus style.
- **Color contrast** — use theme tokens (`text-foreground`, `text-muted-foreground`) that respect light/dark mode.

### Components

- **Use `@/components/ui/*`** — Card, Button, Input, Dropdown, etc. for consistency.
- **Use `cn()`** from `lib/utils.js` for conditional class merging.
- **Path alias** — `@/*` maps to project root (`jsconfig.json`).

### Charts

- **Fixed-height container** — Chart.js with `maintainAspectRatio: false` requires a parent with explicit height (e.g. `h-[220px]`). Without it, layout thrashing can make the page heavy.
- **Guard against empty data** — components like `SimpleChart` should handle `null`/empty `data` gracefully.

---

## 5. Scalability & Architecture

### Data Flow

| Pattern | Use Case | Example |
|---------|----------|---------|
| **SSR** | SEO, fast first paint, auth-gated data | `getServerSideProps` + `withAuthPage` |
| **CSR** | User-triggered, real-time, optional data | `useEffect` + `fetch` |
| **Server proxy** | API keys, server-only logic | Client → `/api/*` → external API |

### File Structure

```
pages/          # Routes (Pages Router)
  api/          # API routes
  example/      # Example/demo pages
  admin/        # Admin-only pages
components/     # Shared UI
  ui/           # Radix primitives (button, card, etc.)
lib/            # Shared logic (auth, prisma, utils)
  __tests__/    # Unit/integration tests
prisma/         # Schema, migrations, seed
styles/         # Global CSS
```

### Adding New Features

1. **New page** — add to `pages/`; use `withAuthPage` if auth required; add to `Layout.js` nav if needed.
2. **New API** — add to `pages/api/`; wrap with `withAuth` or `withRole` if protected.
3. **New component** — add to `components/`; use existing UI primitives when possible.
4. **New dependency** — verify it meets the Library Selection Policy; avoid peer conflicts.

---

## 6. Software Engineering Best Practices

### Code Quality

- **Single responsibility** — keep functions and components focused.
- **DRY** — extract shared logic (e.g. `EXAMPLE_LINKS` in Layout for nav items).
- **Explicit over implicit** — clear naming; avoid magic values.
- **Error handling** — catch and log; show user-friendly messages; never expose stack traces in production.

### Testing

- **Vitest** — run `npm test`; tests live in `lib/__tests__/`.
- **Cover critical paths** — auth, API handlers, shared utilities.
- **Mock external deps** — e.g. Prisma, fetch; keep tests fast and deterministic.

### Performance

- **Avoid unnecessary re-renders** — memoize when appropriate; keep state minimal.
- **Lazy load** — consider `dynamic()` for heavy components that aren’t above the fold.
- **Optimize images** — use Next.js `Image` with proper `sizes`; allow remote patterns in `next.config.mjs` if needed.

### Documentation

- **USER_GUIDE.md** — how to use auth, SSR, CSR, API patterns.
- **CODE_REVIEW.md** — known issues and fixes.
- **Comments** — explain *why*, not *what*; keep code self-explanatory.

---

## 7. Project-Specific Conventions

### Auth

- Cookie name: `dashx-token`
- Roles: `USER`, `ADMIN`
- `withAuthPage(getServerSideProps)` — any authenticated user
- `withAuthPage(getServerSideProps, ["ADMIN"])` — admin only

### API Routes

- `withAuth(handler)` — requires login; sets `req.user`
- `withRole(handler, ["ADMIN"])` — requires login + admin role
- Public routes (login, register, logout) — no auth wrapper

### Styling

- Tailwind + CSS variables in `styles/globals.css`
- Dark mode: `darkMode: "class"` in `tailwind.config.js`
- Theme tokens: `primary`, `muted`, `destructive`, `sidebar`, etc.

### Database

- Prisma with PostgreSQL
- Migrations: `npx prisma migrate dev`
- Seed: `npm run db:seed`; reset: `npm run db:reset`

---

## 8. What to Avoid

- **Adding packages** that conflict with React 19 or Next.js 16 (e.g. requiring `--legacy-peer-deps`)
- **Exposing secrets** in client bundles, logs, or error messages
- **Serving uploaded files** from `public/` without access control (see CODE_REVIEW.md)
- **Trusting client-supplied** filenames, redirect URLs, or role claims
- **Skipping input validation** on API routes
- **Charts without fixed-height containers** (causes layout thrashing)
- **Duplicate nav definitions** — use a single source (e.g. `EXAMPLE_LINKS`) for sidebar items

---

## 9. Quick Reference

| Task | Where to look |
|------|---------------|
| Auth patterns | `lib/auth.js`, USER_GUIDE.md |
| Layout & nav | `components/Layout.js` |
| API examples | `pages/example/server-proxy.js`, `pages/example/client-public-api.js` |
| UI components | `components/ui/` |
| Tests | `lib/__tests__/` |
| Known issues | CODE_REVIEW.md |
