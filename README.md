# Next Tail Starterkit — Next JS + Plain Tailwind CSS with Simple Auth

This project is a minimal **Next.js application** with username/password authentication (**Argon2**), **SQLite via Prisma**, **Tailwind CSS**, and a simple **Chart.js dashboard**.
It includes a `Dockerfile` and `docker-compose.yml` for reproducible local development.

## 🚀 Quick Start

Every database change between Neon(Postgresql) and Sqlite need to delete /prisma/migrations folder and run:

makesure its using correct database provider on `/prisma/schema.prisma`

```
npx prisma generate
npx prisma migrate dev --name init
```

### ⚙️ Manual Setup (Using SQLite)

1. **Install dependencies**

   ```bash
   npm ci
   ```

2. **Set environment variables**

   ```bash
   setx DATABASE_URL "file:./app.db"
   setx JWT_SECRET "change-this-secret"
   ```

   or create a `.env` file manually:

   ```bash
   DATABASE_URL=file:./app.db
   JWT_SECRET=change-this-secret
   ```

3. **Create empty database file**

   ```bash
   touch app.db
   ```

4. **Initialize Prisma**

   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. **Run application**

   ```bash
   npm run dev
   ```

   Then visit [http://localhost:3000](http://localhost:3000) and register your first user.

---

### ⚙️ Manual Setup (Using Neondb)

1. **Install dependencies**

   ```bash
   npm ci
   ```

2. **Set environment variables**

   ```bash
   DATABASE_URL='postgresql://xxxx'
   JWT_SECRET=development_secret_key_change_me
   ```

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
   DATABASE_URL=file:./app.db
   JWT_SECRET=development_secret_key_change_me
   ```

3. **Ensure database path exists**

   ```bash
   touch app.db
   ```

   > 💡 You can skip manual creation — the next command (`prisma migrate dev`) will automatically create `app.db` if it doesn’t exist.

4. **Initialize the database**

   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. **Seed test users**

   ```bash
   npm run db:seed
   ```

   This creates 3 demo accounts:

   | Username | Password |
   | -------- | -------- |
   | admin    | admin123 |
   | testuser | test123  |
   | demo     | demo123  |

6. **Run in development**

   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) and sign in with any test account.

---

## 🐳 Run with Docker (Recommended)

For a fully reproducible setup:

```bash
docker compose up --build
```

Prisma will automatically generate and initialize the SQLite `app.db` file within the container at `/app/prisma/app.db`.

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

## 🧠 Modifying the App

| Area          | Path                                        | Notes                                 |
| ------------- | ------------------------------------------- | ------------------------------------- |
| Pages & APIs  | `pages/`                                    | Add or modify routes and endpoints    |
| Prisma Schema | `prisma/schema.prisma`                      | After edits: `npx prisma migrate dev` |
| Styles        | `tailwind.config.js` & `styles/globals.css` | Customize UI / colors / fonts         |

---

## 🗄️ Database Notes

- Default local DB → `prisma/app.db` (SQLite)
- Automatically created by Prisma on `migrate dev`
- To migrate to **PostgreSQL (Neon)** or **MySQL**, just update:

  ```bash
  DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
  ```

  Then:

  ```bash
  npx prisma migrate deploy
  ```

---

## 📦 Summary

| Environment | Database          | Run Command                   | Purpose          |
| ----------- | ----------------- | ----------------------------- | ---------------- |
| Dev         | SQLite (`app.db`) | `npm run dev`                 | Local test       |
| Docker      | SQLite            | `docker compose up --build`   | Reproducible     |
| Prod        | Neon / PostgreSQL | `docker run` or Vercel Deploy | Cloud deployment |

---
