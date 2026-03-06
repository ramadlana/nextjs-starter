# Next Tail Starterkit — Next JS + Plain Tailwind CSS with Simple Auth

This project is a minimal **Next.js application** with username/password authentication (**Argon2**), **PostgreSQL via Prisma** (Neon, Supabase, or self-hosted), **Tailwind CSS**, and a simple **Chart.js dashboard**.
It includes a `Dockerfile` and `docker-compose.yml` for reproducible local development with PostgreSQL.

## 🚀 Quick Start

Ensure `prisma/schema.prisma` uses `provider = "postgresql"` (default in this repo). Then:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

---

### ⚙️ Manual Setup (PostgreSQL)

Use any PostgreSQL provider: **Neon**, **Supabase**, **Railway**, **Render**, or **self-hosted PostgreSQL**.

1. **Install dependencies**

   ```bash
   npm ci
   ```

2. **Set environment variables**

   Create a `.env` file:

   ```bash
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
   JWT_SECRET=change-this-secret
   ```

   Examples:

   - **Neon:** `postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`
   - **Supabase:** `postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres`
   - **Local:** `postgresql://postgres:postgres@localhost:5432/app`

3. **Initialize Prisma**

   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. **Run application**

   ```bash
   npm run dev
   ```

   Then visit [http://localhost:3000](http://localhost:3000) and register your first user.

---

### 🧩 Using Test Data (Recommended for Development)

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create environment file**

   ```bash
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
   JWT_SECRET=development_secret_key_change_me
   ```

3. **Initialize the database**

   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. **Seed test users**

   ```bash
   npm run db:seed
   ```

   This creates 3 demo accounts:

   | Username | Password |
   | -------- | -------- |
   | admin    | admin123 |
   | testuser | test123  |
   | demo     | demo123  |

5. **Run in development**

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) and sign in with any test account.

---

## 🐳 Run with Docker (Recommended)

Docker Compose starts the app and a **PostgreSQL** container. No cloud DB required for local dev.

```bash
docker compose up --build
```

The app will run migrations and listen on [http://localhost:3000](http://localhost:3000). Use the same test accounts after seeding (run `npm run db:seed` inside the container if the DB is fresh).

---

## 🔒 Security Notes and Best Practices

- Passwords hashed using **Argon2** (strong memory-hard algorithm).
- JWT stored as **HTTP-only + SameSite=Strict** cookies (Secure in production).
- Reduced exposure of `X-Powered-By` header.
- Short JWT expiry (1 hour).

### Recommended Hardening

- Enforce **HTTPS** and Secure cookie flags.
- Rotate `JWT_SECRET` regularly (store in secrets manager).
- Implement **CSRF** protection for POST actions (logout, update, etc.).
- Verify JWTs server-side for all protected APIs.
- Add **rate limiting + lockout** for failed logins.

---

## 📖 User Guide

See **[USER_GUIDE.md](./USER_GUIDE.md)** for how to:

- Create auth-required and role-limited pages
- Protect API routes (`withAuth`, `withRole`)
- Use SSR vs client-side rendering
- Add public pages and admin-only APIs

---

## 🧠 Modifying the App

| Area          | Path                                        | Notes                                 |
| ------------- | ------------------------------------------- | ------------------------------------- |
| Pages & APIs  | `pages/`                                    | Add or modify routes and endpoints    |
| Prisma Schema | `prisma/schema.prisma`                      | After edits: `npx prisma migrate dev` |
| Styles        | `tailwind.config.js` & `styles/globals.css` | Customize UI / colors / fonts         |

---

## 🗄️ Database Notes

- This project uses **PostgreSQL only** (Neon, Supabase, self-hosted, or Docker).
- Set `DATABASE_URL` to your Postgres connection string. For cloud providers (Neon, Supabase), add `?sslmode=require` when required.
- After changing the schema, run:

  ```bash
  npx prisma migrate dev --name your_migration_name
  ```

  For production:

  ```bash
  npx prisma migrate deploy
  ```

---

## 📦 Summary

| Environment | Database   | Run Command                 | Purpose          |
| ----------- | ---------- | --------------------------- | ---------------- |
| Dev         | PostgreSQL | `npm run dev`               | Local / cloud DB |
| Docker      | PostgreSQL | `docker compose up --build` | Local Postgres   |
| Prod        | PostgreSQL | Vercel / `docker run`       | Neon, Supabase, etc. |

---
