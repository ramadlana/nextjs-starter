# Senior Engineer Code Review

**Focus:** Bugs, security, performance, redundant packages. **Date:** March 2026.

**Status:** All P0 fixes below have been **applied** in the codebase. P1/P2 items remain as recommendations.

---

## 1. Bugs

### 1.1 **withAuthPage(..., ["USER"]) blocks ADMIN users (P0)** ✅ Fixed

- **Where:** `pages/dashboard.js`, `pages/profile.js`, `pages/settings.js`, `pages/example/server-proxy.js`, `pages/example/client-public-api.js`, `pages/example/uploadfiles.js`.
- **Issue:** These pages used `withAuthPage(getServerSideProps, ["USER"])`, so ADMIN users were redirected to `/restricted`.
- **Fix applied:** All use `withAuthPage(getServerSideProps)` with no second argument so any authenticated user (including ADMIN) can access them.

---

### 1.2 **Seed does not set role for admin user** ✅ Fixed

- **Where:** `prisma/seed.js`.
- **Issue:** The seeded `"admin"` user was never given `role: "ADMIN"`, so admin routes could not be tested.
- **Fix applied:** Seed now sets `role: "ADMIN"` for the admin user and `role: "USER"` for testuser and demo in both `create` and `update`.

---

### 1.3 **Layout links to non-existent admin pages (404)** ✅ Fixed

- **Where:** `components/Layout.js` — links to `/admin/users` and `/admin/logs`.
- **Issue:** Those pages did not exist; ADMIN users saw 404.
- **Fix applied:** Placeholder pages added: `pages/admin/users.js` and `pages/admin/logs.js`, both protected with `withAuthPage(..., ["ADMIN"])`.

---

### 1.4 **SimpleChart can throw on missing/invalid data** ✅ Fixed

- **Where:** `components/SimpleChart.js` — `data.labels` and `data.values` were used directly.
- **Issue:** Missing or invalid `data` could throw and break the page.
- **Fix applied:** Component now defaults `labels` and `values` to empty arrays when missing or not arrays.

---

### 1.5 **Nav search input is non-functional**

- **Where:** `components/Layout.js` — search `<Input type="search" />`.
- **Issue:** No `value` or `onChange`; the input does nothing. Misleading UX.
- **Fix:** Either wire to state and a search handler (e.g. client-side filter or route to a search page), or remove the control until search is implemented.

---

## 2. Security

### 2.1 **Uploaded files are public** ✅ Fixed

- **Where:** `pages/api/upload.js` wrote to `public/uploads/`. Next.js served `public/` at `/`.
- **Issue:** Any file under `public/uploads/<filename>` was publicly accessible; no auth or ownership check.
- **Fix applied:** Files now stored in `uploads/` (project root, outside `public/`). Served via protected `GET /api/uploads/[filename]` with `withAuth`; only authenticated users can access. Added Content-Length check (413) before buffering. See AGENTS.md.

---

### 2.2 **No rate limiting on login/register**

- **Where:** `pages/api/login.js`, `pages/api/register.js`.
- **Issue:** Enables brute-force on login and mass signups on register.
- **Fix:** Add rate limiting (e.g. per IP and optionally per username) using a store (in-memory, Redis, or Vercel KV). Consider lockout after N failed logins and optional CAPTCHA for sensitive envs.

---

### 2.3 **JWT secret in development**

- **Where:** `lib/auth.js` — `getJwtSecret()` uses `secret || "dev-secret"` when not in production.
- **Status:** Production correctly throws if `JWT_SECRET` is missing. Dev fallback is acceptable; ensure production never deploys without `JWT_SECRET` set.

---

### 2.4 **Register validation**

- **Where:** `pages/api/register.js`.
- **Status:** Username length, regex, and password minimum length are validated. No change required for basic security; optional: add password complexity rules if needed.

---

## 3. Performance and robustness

### 3.1 **Upload API: full body in memory**

- **Where:** `pages/api/upload.js` — `req.on("data", (chunk) => (raw += chunk))`.
- **Issue:** Entire body is buffered as a string. Large payloads increase memory.
- **Status:** You already have a 30s timeout and 5 MB limit. For stricter behavior, reject with 413 when `Content-Length` exceeds 5 MB before reading the body.

---

### 3.2 **Chart.js registration on every mount**

- **Where:** `components/SimpleChart.js` — `ChartJS.register(...)` runs when the component mounts.
- **Issue:** Registration is global; doing it in every instance is redundant and can cause warnings in strict mode.
- **Fix:** Move `ChartJS.register(...)` to a single place (e.g. a small `lib/chartjs.js` that you import once in `_app.js` or at the top of `SimpleChart.js` and guard so it runs only once).

---

### 3.3 **Prisma client singleton**

- **Where:** `lib/prisma.js`.
- **Status:** Correct pattern for dev/prod. No change needed.

---

## 4. Redundant packages and CSS

### 4.1 **Dependencies**

- **Checked:** `clsx`, `tailwind-merge` (used in `lib/utils.js` for `cn()`); `class-variance-authority` (button, alert); `@radix-ui/react-slot` and `@radix-ui/react-dropdown-menu` (Layout, dropdowns); `chart.js` + `react-chartjs-2` (SimpleChart); `jose`, `argon2`, `@prisma/client`. All are used; **no redundant npm packages** identified.

### 4.2 **CSS**

- **Single global stylesheet:** `styles/globals.css` with Tailwind; no duplicate CSS frameworks.
- **Unused variables:** `globals.css` defines `--chart-1` … `--chart-5` and sidebar variables. `SimpleChart.js` uses hardcoded `rgb()` colors. You can optionally use the CSS variables in the chart for theming, or leave as-is for future use.

---

## 5. Summary of recommended fixes

| Priority | Item | Status |
|----------|------|--------|
| P0 | withAuthPage(["USER"]) blocks ADMIN | ✅ Fixed — use `withAuthPage(fn)` for dashboard, profile, settings, example pages |
| P0 | Seed admin role | ✅ Fixed — `admin` user has `role: "ADMIN"` in seed |
| P0 | Layout admin links 404 | ✅ Fixed — `pages/admin/users.js` and `pages/admin/logs.js` added |
| P0 | SimpleChart crash | ✅ Fixed — guard `data` / default `labels` and `values` to `[]` |
| P1 | Nav search | Recommended — implement or remove search input |
| P1 | Uploads public | Recommended — serve via protected route if private |
| P1 | Login/register | Recommended — add rate limiting |
| P2 | Chart.js register | Optional — register once (e.g. in _app) |
| P2 | Upload body size | Optional — reject with 413 when `Content-Length` > 5 MB |
