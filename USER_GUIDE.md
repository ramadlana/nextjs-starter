# User Guide — Next.js Starter (DashX)

This guide explains how to use this boilerplate: auth-required pages, role-based access, SSR vs client-side rendering, and API protection.

---

## Table of contents

1. [Quick reference](#1-quick-reference)
2. [Auth-required pages](#2-auth-required-pages)
3. [Role-limited pages](#3-role-limited-pages)
4. [Protecting API routes](#4-protecting-api-routes)
5. [SSR (Server-Side Rendering)](#5-ssr-server-side-rendering)
6. [Client-side rendering (CSR)](#6-client-side-rendering-csr)
7. [Public vs protected pages](#7-public-vs-protected-pages)
8. [File structure](#8-file-structure)
9. [Step-by-step: new page and API](#9-step-by-step-new-page-and-api)

---

## 1. Quick reference

| Goal | Page | API | What to use |
|------|------|-----|-------------|
| Login required (any role) | `getServerSideProps = withAuthPage(fn)` | `export default withAuth(handler)` | — |
| Only certain roles | `withAuthPage(fn, ["ADMIN"])` | `export default withRole(handler, ["ADMIN"])` | User model has `role`: `USER`, `ADMIN` |
| Public page (no auth) | No `getServerSideProps` or no `withAuthPage` | — | e.g. `pages/about.js` |
| Data on server (SSR) | Fetch in `getServerSideProps` | — | Pass as `props` |
| Data in browser (CSR) | `useEffect` + `fetch` | — | Use protected API or public API |

**Auth helpers** (from `lib/auth.js`):

- `verifyAuth(req)` — returns `{ id, username, role }` or `null`
- `withAuth(handler)` — API: 401 if not logged in; sets `req.user`
- `withRole(handler, ["ADMIN"])` — API: 401 if not logged in, 403 if role not allowed
- `withAuthPage(getServerSidePropsFn, allowedRoles?)` — Page: redirect to `/login` or `/restricted`

---

## 2. Auth-required pages

Any logged-in user can access the page. If not logged in, redirect to `/login`.

**Pattern:**

```js
import Layout from "../components/Layout";
import { withAuthPage } from "../lib/auth";

export default function MyPage({ user }) {
  return (
    <Layout user={user}>
      <h1>Hello, {user.username}</h1>
    </Layout>
  );
}

export const getServerSideProps = withAuthPage(async (context, user) => {
  return { props: { user } };
});
```

**Examples in this repo:**

- `pages/dashboard.js` — auth required, optional server data
- `pages/example/fetchprivateapi.js` — auth + client-side fetch to protected API
- `pages/example/uploadfiles.js` — auth + file upload to protected API

**Notes:**

- `withAuthPage()` with one argument = “any authenticated user”.
- The second argument (array of roles) is optional; omit it for “any role”.

---

## 3. Role-limited pages

Only users whose `role` is in the allowed list can access the page. Others are redirected to `/restricted`.

**Pattern:**

```js
import Layout from "../components/Layout";
import { withAuthPage } from "../lib/auth";

export default function AdminPage({ user }) {
  return (
    <Layout user={user}>
      <h1>Admin only</h1>
    </Layout>
  );
}

export const getServerSideProps = withAuthPage(
  async (_context, user) => {
    return { props: { user } };
  },
  ["ADMIN"]
);
```

**Example in this repo:**

- `pages/example/role-based-route.js` — only `ADMIN` can see it.

**Roles:** Defined in `prisma/schema.prisma` (`User.role`). Default is `"USER"`. Set `ADMIN` in DB or seed for admin users.

---

## 4. Protecting API routes

### Any logged-in user

Use `withAuth`. The handler receives `req.user` (`id`, `username`, `role`).

```js
// pages/api/my-api.js
import { withAuth } from "../../lib/auth";

async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  res.json({ user: req.user.username });
}

export default withAuth(handler);
```

**Examples:** `pages/api/upload.js`, `pages/api/weatherprivate.js`, `pages/api/user/profile.js`.

### Only certain roles (e.g. admin)

Use `withRole(handler, ["ADMIN"])`. Returns 403 if role is not allowed.

```js
// pages/api/admin/stats.js
import { withRole } from "../../../lib/auth";

async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  res.json({ message: "Admin only data" });
}

export default withRole(handler, ["ADMIN"]);
```

**Example:** `pages/api/admin/stats.js`.

---

## 5. SSR (Server-Side Rendering)

Data is fetched on the server per request and passed as props. Good for SEO, first-load performance, and keeping secrets on the server.

**Pattern:**

```js
export default function Page({ user, serverData }) {
  return (
    <Layout user={user}>
      <pre>{JSON.stringify(serverData)}</pre>
    </Layout>
  );
}

export const getServerSideProps = withAuthPage(async (context, user) => {
  // Fetch on server (DB, internal API, etc.)
  const serverData = await fetchSomething();
  return {
    props: {
      user,
      serverData,
    },
  };
});
```

**Example:** `pages/dashboard.js` — builds `chartData` in `getServerSideProps` and passes it as props.

**When to use SSR:**

- Data must be visible on first HTML (SEO, no flash).
- You need request context (cookies, headers) or server-only secrets.
- You want to avoid exposing internal APIs to the client.

---

## 6. Client-side rendering (CSR)

Data is fetched in the browser (e.g. in `useEffect`). Good for user-specific or dynamic data after the page has loaded.

**Pattern:**

```js
import { useEffect, useState } from "react";

export default function Page({ user }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/weatherprivate");
      const json = await res.json();
      setData(json);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p>Loading...</p>;
  return <pre>{JSON.stringify(data)}</pre>;
}

export const getServerSideProps = withAuthPage(async (_c, user) => {
  return { props: { user } };
});
```

**Examples:**

- `pages/example/fetchprivateapi.js` — calls protected `/api/weatherprivate` (cookie sent automatically).
- `pages/example/fetchpublicapi.js` — calls public external API from the client.

**When to use CSR:**

- Data is only needed after interaction or after mount.
- You don't need the data in the initial HTML for SEO.

---

## 7. Public vs protected pages

| Type | Example | How |
|------|---------|-----|
| **Public** | Landing, about, pricing | No `getServerSideProps`, or use it without `withAuthPage`. No `user` prop required. |
| **Login required** | Dashboard, profile | `getServerSideProps = withAuthPage(...)` (no second argument or `["USER", "ADMIN"]`). |
| **Role-only** | Admin panel | `getServerSideProps = withAuthPage(..., ["ADMIN"])`. |

**Public page example:** `pages/about.js`.

**Protected:** `pages/dashboard.js`, `pages/example/*`.

**Redirect at root:** `pages/index.js` sends `/` to `/login` so the app feels “login-first”.

---

## 8. File structure

```
lib/
  auth.js       # verifyAuth, withAuth, withRole, withAuthPage
  prisma.js     # Prisma singleton

pages/
  index.js      # Redirects to /login
  login.js      # Public
  register.js   # Public
  about.js      # Public (example)
  dashboard.js  # Auth required (USER)
  restricted.js # Shown when role is not allowed

  example/
    role-based-route.js   # ADMIN only
    fetchprivateapi.js   # USER, CSR + protected API
    fetchpublicapi.js    # USER, CSR + public API
    uploadfiles.js       # USER, file upload

  api/
    login.js
    register.js
    logout.js
    upload.js           # withAuth
    weatherprivate.js   # withAuth
    user/profile.js     # withAuth
    admin/stats.js      # withRole(..., ["ADMIN"])
```

---

## 9. Step-by-step: new page and API

### Add an “auth required” page

1. Create `pages/my-page.js`.
2. Use `Layout` and accept `user` from props.
3. Export `getServerSideProps = withAuthPage(async (context, user) => ({ props: { user } }))`.

### Add a “role-only” page (e.g. admin)

1. Same as above, but pass roles: `withAuthPage(fn, ["ADMIN"])`.
2. Ensure the user's `role` in the DB is `ADMIN` (e.g. via seed or admin update).

### Add a protected API (any logged-in user)

1. Create `pages/api/my-route.js`.
2. Define `async function handler(req, res)` and use `req.user`.
3. `export default withAuth(handler)`.

### Add an admin-only API

1. Create `pages/api/admin/my-admin-route.js`.
2. `export default withRole(handler, ["ADMIN"])`.

### Add a public page

1. Create e.g. `pages/about.js`.
2. Do **not** use `withAuthPage`. Optionally use `Layout` without `user` (or pass `user: null` and handle in Layout).

---

## Production checklist

- Set `JWT_SECRET` in production (no fallback).
- Use HTTPS; cookies use `Secure` in production.
- Consider rate limiting on `/api/login` and `/api/register`.
- Run Prisma migrations and seed (or manage roles in your admin flow).
- Ensure Node version matches (e.g. Node 20+) — see README.
