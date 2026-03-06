# Senior Engineer Code Review

**Focus:** Bugs, security, performance, redundant packages. **Date:** March 2026.

---

## 1. Bugs

### 1.1 **withAuthPage(..., ["USER"]) blocks ADMIN users (P0)**

- **Where:** `pages/dashboard.js`, `pages/profile.js`, `pages/settings.js`, `pages/example/fetchprivateapi.js`, `pages/example/fetchpublicapi.js`, `pages/example/uploadfiles.js`.
- **Issue:** These pages use `withAuthPage(getServerSideProps, ["USER"])`. When `allowedRoles` is non-empty, only those roles are allowed. So **ADMIN** users are redirected to `/restricted` when visiting Dashboard, Profile, Settings, and Example pages. ADMIN should be able to access all of these.
- **Fix:** Use `withAuthPage(getServerSideProps)` with **no second argument** for “any authenticated user”. Reserve `["ADMIN"]` only for routes that are admin-only (e.g. `role-based-route.js`, future admin panels).

---

### 1.2 **Seed does not set role for admin user**

- **Where:** `prisma/seed.js`.
- **Issue:** All users are created with Prisma default `role: "USER"`. The user `"admin"` is never given `role: "ADMIN"`, so Admin menu and role-based routes cannot be tested with seeded data.
- **Fix:** In the seed, set `role: "ADMIN"` when creating/upserting the `"admin"` user (e.g. in `create`/`update` for that entry).

---

### 1.3 **Layout links to non-existent admin pages (404)**

- **Where:** `components/Layout.js` — links to `/admin/users` and `/admin/logs`.
- **Issue:** There are no `pages/admin/users.js` or `pages/admin/logs.js`. ADMIN users see broken links.
- **Fix:** Either (a) add minimal placeholder pages under `pages/admin/` (e.g. `users.js`, `logs.js`) that use `withAuthPage(..., ["ADMIN"])`, or (b) remove these menu items until the pages exist.

---

### 1.4 **SimpleChart can throw on missing/invalid data**

- **Where:** `components/SimpleChart.js` — `data.labels` and `data.values` are used directly.
- **Issue:** If `data` is `undefined` or missing `labels`/`values`, the component throws and can break the page (e.g. after a failed API call).
- **Fix:** Guard at the start: ensure `data` is an object and default `labels` and `values` to empty arrays when missing.

---

### 1.5 **Nav search input is non-functional**

- **Where:** `components/Layout.js` — search `<Input type="search" />`.
- **Issue:** No `value` or `onChange`; the input does nothing. Misleading UX.
- **Fix:** Either wire to state and a search handler (e.g. client-side filter or route to a search page), or remove the control until search is implemented.

---

## 2. Security

### 2.1 **Uploaded files are public**

- **Where:** `pages/api/upload.js` writes to `public/uploads/`. Next.js serves `public/` at `/`.
- **Issue:** Any file under `public/uploads/<filename>` is publicly accessible; no auth or ownership check.
- **Fix:** If uploads must be private: (1) store files outside `public/` (e.g. `uploads/` in project root or cloud storage), and (2) serve via a protected API route that checks auth (and optionally file ownership in DB) and streams the file.

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

| Priority | Item | Action |
|----------|------|--------|
| P0 | withAuthPage(["USER"]) blocks ADMIN | Use `withAuthPage(fn)` for dashboard, profile, settings, example pages |
| P0 | Seed admin role | Set `role: "ADMIN"` for `"admin"` user in seed |
| P0 | Layout admin links 404 | Add placeholder admin pages or remove links |
| P0 | SimpleChart crash | Guard `data` / default `labels` and `values` to `[]` |
| P1 | Nav search | Implement or remove search input |
| P1 | Uploads public | Serve via protected route and store outside `public/` if private |
| P1 | Login/register | Add rate limiting |
| P2 | Chart.js register | Register once (e.g. in _app or guarded in SimpleChart) |
| P2 | Upload body size | Reject with 413 when `Content-Length` > 5 MB |

---

*Concrete code changes for P0 items are applied in the codebase below.*
