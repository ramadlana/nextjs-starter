# DashboardXIQC — minimal secure Next.js starter

This project is a minimal Next.js application with username/password auth (argon2), SQLite via Prisma, Tailwind CSS, and a simple Chart.js dashboard. It includes a Dockerfile and docker-compose for local development.

## Quick Start

### Using Test Data (Recommended for Development)

1. Install dependencies

```powershell
npm install
```

2. Set environment variable (create a .env file):

```powershell
DATABASE_URL=file:./app.db
JWT_SECRET=development_secret_key_change_me
```

3. Initialize the database:

```powershell
npx prisma generate
npx prisma migrate dev --name init
```

4. **Seed with test users:**

```powershell
npm run db:seed
```

This creates 3 test accounts:

- **admin** / admin123
- **testuser** / test123
- **demo** / demo123

5. Run in development:

```powershell
npm run dev
```

6. Open http://localhost:3000 and sign in with any test account!

### Manual Setup (Without Test Data)

1. Install dependencies

```powershell
npm ci
```

2. Set environment variable (create a .env file):

```powershell
setx DATABASE_URL "file:./dev.db"
setx JWT_SECRET "change-this-secret"
```

Or create a `.env` file with:

DATABASE_URL=file:./dev.db
JWT_SECRET=change-this-secret

3. Initialize the database and Prisma client:

```powershell
npx prisma generate
npx prisma migrate dev --name init --preview-feature
```

4. Run in development:

```powershell
npm run dev
```

Open http://localhost:3000 and register a user.

Docker (recommended for reproducible environments):

```powershell
docker compose up --build
```

Security notes and best practices applied:

- Passwords hashed with argon2 (a strong memory-hard algorithm).
- JWT stored in HTTP-only, SameSite=Strict cookie and Secure flag set in production.
- Reduced exposure of X-Powered-By via Next config.
- Short JWT expiry (1 hour).

Recommendations to harden further:

- Use HTTPS in production and set Secure cookie flag.
- Rotate and store `JWT_SECRET` in a secrets manager.
- Implement CSRF protections for state-changing POST requests (e.g., logout).
- Verify JWTs server-side in all protected APIs and periodically check revocation/blacklist.
- Add rate limiting on auth endpoints and account lockout.

How to modify:

- Pages under `pages/` — add API routes in `pages/api/`.
- Prisma schema under `prisma/schema.prisma`. After changes run: `npx prisma migrate dev`.
- Tailwind customization in `tailwind.config.js` and `styles/globals.css`.

This scaffold is intentionally small and focuses on secure defaults for username/password auth with SQLite. For production use, migrate to PostgreSQL or MySQL and add HTTPS, monitoring, and a stronger secrets setup.
