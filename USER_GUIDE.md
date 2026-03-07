# User Guide — Next.js Starterkit

This guide explains how to use this boilerplate: auth-required pages, role-based access, SSR vs client-side rendering, and API protection. Written for beginners — every example includes full imports so you can copy-paste without forgetting anything.

---

## Table of contents

1. [Before you start](#1-before-you-start)
2. [Quick reference](#2-quick-reference)
3. [Auth-required pages](#3-auth-required-pages)
4. [Role-limited pages](#4-role-limited-pages)
5. [Protecting API routes](#5-protecting-api-routes)
6. [SSR (Server-Side Rendering)](#6-ssr-server-side-rendering)
7. [Client-side rendering (CSR)](#7-client-side-rendering-csr)
8. [Public vs protected pages](#8-public-vs-protected-pages)
9. [File structure](#9-file-structure)
10. [Step-by-step: new page and API](#10-step-by-step-new-page-and-api)
11. [Common mistakes & tips](#11-common-mistakes--tips)

---

## 1. Before you start

### Import paths

This project supports two ways to import:


| Path style   | Example                   | When to use                                   |
| ------------ | ------------------------- | --------------------------------------------- |
| **Relative** | `../components/Layout`    | From `pages/dashboard.js` (one level down)    |
| **Relative** | `../../components/Layout` | From `pages/example/ssr.js` (two levels down) |
| **Alias**    | `@/components/Layout`     | Works from any file — no need to count `../`  |


**Tip:** Use `@/` when in doubt — it always works. Example: `import Layout from "@/components/Layout"`.

### What you'll need

- **Layout** — wraps your page with sidebar, navbar, and user menu. Always pass `user={user}` for auth pages.
- **withAuthPage** — protects pages; redirects to `/login` if not logged in.
- **withAuth** / **withRole** — protects API routes; returns 401/403 if unauthorized.

---

## 2. Quick reference


| Goal                      | Page                                         | API                                           | What to use                            |
| ------------------------- | -------------------------------------------- | --------------------------------------------- | -------------------------------------- |
| Login required (any role) | `getServerSideProps = withAuthPage(fn)`      | `export default withAuth(handler)`            | —                                      |
| Only certain roles        | `withAuthPage(fn, ["ADMIN"])`                | `export default withRole(handler, ["ADMIN"])` | User model has `role`: `USER`, `ADMIN` |
| Public page (no auth)     | No `getServerSideProps` or no `withAuthPage` | —                                             | e.g. `pages/about.js`                  |
| Data on server (SSR)      | Fetch in `getServerSideProps`                | —                                             | Pass as `props`                        |
| Data in browser (CSR)     | `useEffect` + `fetch`                        | —                                             | Use protected API or public API        |


**Auth helpers** (from `lib/auth.js`):

- `verifyAuth(req)` — returns `{ id, username, role }` or `null`
- `withAuth(handler)` — API: 401 if not logged in; sets `req.user`
- `withRole(handler, ["ADMIN"])` — API: 401 if not logged in, 403 if role not allowed
- `withAuthPage(getServerSidePropsFn, allowedRoles?)` — Page: redirect to `/login` or `/restricted`

---

## 3. Auth-required pages

Any logged-in user can access the page. If not logged in, redirect to `/login`.

**Checklist:** Layout ✓ | withAuthPage ✓ | user prop ✓

```js
// pages/my-page.js
import Layout from "@/components/Layout";
import { withAuthPage } from "@/lib/auth";

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

- `pages/dashboard.js` — auth required (any role), optional server data
- `pages/profile.js`, `pages/settings.js` — auth required (any role)
- `pages/example/ssr.js` — SSR example
- `pages/example/csr.js` — CSR example
- `pages/example/server-proxy.js` — client calls your API route; server calls external API with key
- `pages/example/client-public-api.js` — client calls public external API directly (no key)
- `pages/example/uploadfiles.js` — auth + file upload to protected API
- `pages/example/markdown.js` — markdown rendering example

**Notes:**

- `withAuthPage()` with one argument = "any authenticated user".
- The second argument (array of roles) is optional; omit it for "any role".

---

## 4. Role-limited pages

Only users whose `role` is in the allowed list can access the page. Others are redirected to `/restricted`.

**Checklist:** Layout ✓ | withAuthPage(..., ["ADMIN"]) ✓ | user prop ✓

```js
// pages/admin/my-admin-page.js
import Layout from "@/components/Layout";
import { withAuthPage } from "@/lib/auth";

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

**Examples in this repo:**

- `pages/example/role-based-route.js` — only `ADMIN` can see it
- `pages/admin/users.js`, `pages/admin/logs.js` — admin placeholders (ADMIN only)

**Roles:** Defined in `prisma/schema.prisma` (`User.role`). Default is `"USER"`. Set `ADMIN` in DB or seed for admin users.

---

## 5. Protecting API routes

### Any logged-in user

Use `withAuth`. The handler receives `req.user` (`id`, `username`, `role`).

**Checklist:** withAuth ✓ | req.user ✓

```js
// pages/api/my-api.js
import { withAuth } from "@/lib/auth";

async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  res.json({ user: req.user.username });
}

export default withAuth(handler);
```

**Examples:** `pages/api/upload.js`, `pages/api/weatherprivate.js`, `pages/api/user/profile.js`.

### Only certain roles (e.g. admin)

Use `withRole(handler, ["ADMIN"])`. Returns 403 if role is not allowed.

**Checklist:** withRole ✓ | roles array ✓

```js
// pages/api/admin/stats.js
import { withRole } from "@/lib/auth";

async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  res.json({ message: "Admin only data" });
}

export default withRole(handler, ["ADMIN"]);
```

**Example:** `pages/api/admin/stats.js`.

---

## 6. SSR (Server-Side Rendering)

Data is fetched on the server per request and passed as props. Good for SEO, first-load performance, and keeping secrets on the server.

**Checklist:** Layout ✓ | withAuthPage ✓ | getServerSideProps ✓ | props returned ✓

```js
// pages/my-ssr-page.js
import Layout from "@/components/Layout";
import { withAuthPage } from "@/lib/auth";

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

**Example:** `pages/example/ssr.js` — builds `serverData` in `getServerSideProps` and passes it as props.

**When to use SSR:**

- Data must be visible on first HTML (SEO, no flash).
- You need request context (cookies, headers) or server-only secrets.
- You want to avoid exposing internal APIs to the client.

---

## 7. Client-side rendering (CSR)

Data is fetched in the browser (e.g. in `useEffect`). Good for user-specific or dynamic data after the page has loaded.

**Checklist:** Layout ✓ | withAuthPage ✓ | useState ✓ | useEffect ✓ | fetch ✓

```js
// pages/my-csr-page.js
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { withAuthPage } from "@/lib/auth";

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

  if (loading) return <Layout user={user}><p>Loading...</p></Layout>;
  return (
    <Layout user={user}>
      <pre>{JSON.stringify(data)}</pre>
    </Layout>
  );
}

export const getServerSideProps = withAuthPage(async (_c, user) => {
  return { props: { user } };
});
```

**Examples:**

- `pages/example/csr.js` — calls `/api/user/profile` from the client
- `pages/example/server-proxy.js` — calls `/api/weatherprivate` (cookie sent automatically; server holds API key)
- `pages/example/client-public-api.js` — calls public external API (e.g. Open-Meteo) from the browser

**When to use CSR:**

- Data is only needed after interaction or after mount.
- You don't need the data in the initial HTML for SEO.

---

## 8. Public vs protected pages


| Type               | Example                                | How                                                                                     |
| ------------------ | -------------------------------------- | --------------------------------------------------------------------------------------- |
| **Public**         | Landing, about, pricing                | No `getServerSideProps`, or use it without `withAuthPage`. No `user` prop required.     |
| **Login required** | Dashboard, profile, settings, examples | `getServerSideProps = withAuthPage(...)` (no second argument = any authenticated user). |
| **Role-only**      | Admin panel                            | `getServerSideProps = withAuthPage(..., ["ADMIN"])`.                                    |


**Public page example:**

```js
// pages/about.js — no auth, no getServerSideProps
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Link href="/login">
        <Button>Go to login</Button>
      </Link>
    </div>
  );
}
```

**Protected:** `pages/dashboard.js`, `pages/example/`*.

**Redirect at root:** `pages/index.js` sends `/` to `/login` so the app feels "login-first".

---

## 9. File structure

```
lib/
  auth.js       # verifyAuth, withAuth, withRole, withAuthPage
  prisma.js     # Prisma singleton

pages/
  index.js      # Redirects to /login
  login.js      # Public
  register.js   # Public
  about.js      # Public (example)
  dashboard.js  # Auth required (any role)
  profile.js    # Auth required (any role)
  settings.js   # Auth required (any role)
  restricted.js # Shown when role is not allowed

  admin/
    users.js    # ADMIN only (placeholder)
    logs.js     # ADMIN only (placeholder)

  example/
    ssr.js              # SSR example
    csr.js              # CSR example
    role-based-route.js # ADMIN only
    server-proxy.js     # Auth required; client → your API → external API (key on server)
    client-public-api.js# Auth required; client → public external API (no key)
    uploadfiles.js      # Auth required, file upload
    markdown.js         # Auth required, markdown rendering

  api/
    login.js
    register.js
    logout.js
    upload.js           # withAuth
    weatherprivate.js   # withAuth
    user/profile.js     # withAuth
    admin/stats.js      # withRole(..., ["ADMIN"])
    uploads/[filename].js # Serves uploaded files
```

---

## 10. Step-by-step: new page and API

### Add an "auth required" page

1. Create `pages/my-page.js`.
2. Import `Layout` and `withAuthPage`.
3. Use `Layout` and accept `user` from props.
4. Export `getServerSideProps = withAuthPage(async (context, user) => ({ props: { user } }))`.

### Add a "role-only" page (e.g. admin)

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

## 11. Common mistakes & tips

### Forgot to import Layout

```js
// ❌ Page renders without sidebar/navbar
export default function MyPage({ user }) {
  return <h1>Hello</h1>;
}

// ✅ Correct
import Layout from "@/components/Layout";
export default function MyPage({ user }) {
  return (
    <Layout user={user}>
      <h1>Hello</h1>
    </Layout>
  );
}
```

### Forgot to import withAuthPage

```js
// ❌ Page is unprotected — anyone can access
export const getServerSideProps = async (context) => {
  return { props: { user: null } };
};

// ✅ Correct
import { withAuthPage } from "@/lib/auth";
export const getServerSideProps = withAuthPage(async (context, user) => {
  return { props: { user } };
});
```

### Wrong import path for auth

```js
// ❌ From pages/example/ssr.js — wrong path
import { withAuthPage } from "../lib/auth";  // goes to pages/lib/auth (doesn't exist!)

// ✅ Use relative from file location, or use alias
import { withAuthPage } from "../../lib/auth";  // from pages/example/
import { withAuthPage } from "@/lib/auth";      // alias — works everywhere
```

### API route: forgot to wrap with withAuth

```js
// ❌ Anyone can call this API
export default async function handler(req, res) {
  res.json({ user: req.user });  // req.user is undefined!
}

// ✅ Correct
import { withAuth } from "@/lib/auth";
async function handler(req, res) {
  res.json({ user: req.user.username });
}
export default withAuth(handler);
```

### CSR: forgot to pass user to Layout

```js
// ❌ Layout shows "Guest" even when logged in
export default function Page({ user }) {
  const [data, setData] = useState(null);
  return (
    <Layout>  {/* missing user */}
      <pre>{JSON.stringify(data)}</pre>
    </Layout>
  );
}

// ✅ Correct
return <Layout user={user}>...</Layout>;
```

### Adding a new sidebar link

To add a new item to the sidebar, edit `components/Layout.js` and add to `EXAMPLE_LINKS` or `ADMIN_LINKS`:

```js
{
  href: "/example/my-new-page",
  label: "My New Page (full title)",
  short: "Short",
  Icon: SomeLucideIcon,  // e.g. FileText, Upload, etc.
}
```

Then import the icon from `lucide-react` at the top of `Layout.js`.

---

## Production checklist

- Set `JWT_SECRET` in production (no fallback).
- Use HTTPS; cookies use `Secure` in production.
- Consider rate limiting on `/api/login` and `/api/register`.
- Run Prisma migrations and seed (or manage roles in your admin flow).
- Ensure Node version matches (e.g. Node 20+) — see README.

