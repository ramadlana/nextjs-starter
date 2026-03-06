# Senior Engineer Code Review

**Focus:** Bugs, security, performance. **Date:** March 2025.

---

## Critical bugs

### 1. **User profile API: `id` type mismatch (Prisma)**

- **Where:** `pages/api/user/profile.js` line 16.
- **Issue:** JWT `payload.sub` is set as `String(user.id)` in login, so `req.user.id` is a **string**. Prisma schema defines `User.id` as `Int`. Passing a string can cause Prisma to throw or behave inconsistently across runtimes.
- **Fix:** Coerce to integer before querying:

```js
where: { id: parseInt(req.user.id, 10) }
```

Add a guard for invalid values (e.g. `NaN`).

---

### 2. **Logout cookie not cleared in production**

- **Where:** `pages/api/logout.js`.
- **Issue:** Login sets the cookie with `Secure` in production, but logout sets `Max-Age=0` **without** `Secure`. Browsers may not clear the cookie when the attributes don’t match the original.
- **Fix:** Use the same cookie attributes as login (e.g. add `Secure` in production when clearing).

---

### 3. **Wrong router in `pages/restricted.js`**

- **Where:** `pages/restricted.js` line 2.
- **Issue:** Uses `useRouter` from `next/navigation` (App Router). This app uses the **Pages Router** (`pages/`). `next/navigation` is for `app/`; in `pages/` it can behave incorrectly or break `router.back()`.
- **Fix:** Use `next/router`:

```js
import { useRouter } from "next/router";
```

---

### 4. **Upload API: no response if body never ends**

- **Where:** `pages/api/upload.js`.
- **Issue:** Response is sent only inside `req.on("end")`. If the client never sends the full body (e.g. disconnect, slowloris), the request can hang and no response is sent.
- **Fix:** Add a timeout that responds with 408/413 and destroy the request, and/or enforce a max body size at the edge. Ensure a single response path (e.g. guard with `if (res.headersSent) return` before sending).

---

## Security issues

### 5. **JWT secret fallback in production**

- **Where:** `lib/auth.js` line 31–32, `pages/api/login.js` line 15–16.
- **Issue:** `process.env.JWT_SECRET || "dev-secret"` allows the app to run in production without a real secret if `JWT_SECRET` is missing, weakening or breaking auth.
- **Fix:** In production, require `JWT_SECRET` and fail fast at startup or on first use (e.g. throw or return 503) if it’s missing. Use the fallback only in development.

---

### 6. **No rate limiting on login/register**

- **Where:** `pages/api/login.js`, `pages/api/register.js`.
- **Issue:** No rate limiting enables brute-force and credential stuffing on login and abuse (e.g. mass signups) on register.
- **Fix:** Add rate limiting (e.g. per-IP and per-username) with a store (in-memory, Redis, or Vercel KV). Consider lockout after N failed logins and optional CAPTCHA.

---

### 7. **Register: no input validation**

- **Where:** `pages/api/register.js`.
- **Issue:** Only checks presence of `username` and `password`. No length, character set, or password strength checks. Long or malicious strings can stress DB or lead to DoS.
- **Fix:** Validate `username` (e.g. length 3–64, alphanumeric/underscore); enforce password length (e.g. ≥ 8) and optional complexity; trim and sanitize. Reject invalid input with 400.

---

### 8. **Uploaded files in `public/uploads`**

- **Where:** `pages/api/upload.js` writes to `public/uploads`.
- **Issue:** Files are publicly accessible at `/uploads/<filename>`. No access control; anyone with the URL can view them.
- **Fix:** If uploads must be private, serve them via a protected API route that checks auth and uses `req.user.id` (and optionally file ownership in DB), and stream the file instead of putting it under `public/`.

---

### 9. **Weather API: unvalidated query params**

- **Where:** `pages/api/weatherprivate.js` — `lat`, `lon` from `req.query`.
- **Issue:** Values are interpolated into the URL without validation. Non-numeric or extreme values could cause unexpected behavior or abuse.
- **Fix:** Parse as numbers, validate ranges (e.g. lat -90–90, lon -180–180), and use a allowlist or safe defaults on invalid input.

---

## Performance and robustness

### 10. **Prisma client singleton**

- **Where:** `lib/prisma.js`.
- **Status:** Correct pattern: single client reused in dev to avoid exhausting connections. No change needed; keep as-is for production.

---

### 11. **Upload: loading full body into memory**

- **Where:** `pages/api/upload.js` — `req.on("data", (chunk) => (raw += chunk))`.
- **Issue:** Entire body is buffered as a string. Large payloads (e.g. 5 MB) increase memory and can be abused.
- **Fix:** Enforce a content-length limit early (e.g. 5 MB) and reject with 413 if exceeded. Consider streaming + size check for future scalability; for current 5 MB limit, at least fail fast on oversized `Content-Length`.

---

### 12. **Register: generic error message**

- **Where:** `pages/api/register.js` catch block.
- **Issue:** Any Prisma error (e.g. unique violation, connection error) returns “username already exists”, which can leak that the username exists and hides real failures.
- **Fix:** Check error code (e.g. `P2002` for unique constraint) and return “username already exists” only for that case; otherwise log and return a generic “Registration failed” (e.g. 500).

---

## Summary of recommended fixes

| Priority | Item | Action |
|----------|------|--------|
| P0 | Profile `id` type | Use `parseInt(req.user.id, 10)` and validate |
| P0 | Logout cookie | Add `Secure` in production when clearing |
| P0 | Restricted page router | Use `next/router` instead of `next/navigation` |
| P1 | JWT secret | Require in production; no fallback |
| P1 | Login/register | Rate limiting + input validation |
| P1 | Upload | Timeout + single response path; optional private serving |
| P2 | Weather API | Validate and bound `lat`/`lon` |
| P2 | Register errors | Map Prisma errors; avoid leaking “username exists” |

---

*Concrete code changes for P0 items and selected P1 items are applied in the codebase where indicated.*
