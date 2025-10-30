## 🐳 **Dockerfile** (Production Build)

```dockerfile
# =========================================
# DashboardXIQC – Production Dockerfile
# =========================================
# 🧱 Base build stage
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# =========================================
# 🏁 Production stage
# =========================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy built files and deps
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Port for Next.js
EXPOSE 3000

# Run database migration automatically on start
CMD npx prisma migrate deploy && npm start
```

✅ **Usage**

```bash
# Build image
docker build -t dashboardxiqc:latest .

# Run container
docker run -d \
  -e DATABASE_URL="postgresql://USER:PASSWORD@ep-cluster.ap-southeast-1.aws.neon.tech/db?sslmode=require" \
  -e JWT_SECRET="your_production_secret" \
  -p 3000:3000 \
  dashboardxiqc:latest
```

---

## ⚙️ **.env.production.example**

```bash
# =========================================
# DashboardXIQC – Production Environment
# =========================================

# --- Prisma Database (Neon Cloud PostgreSQL) ---
DATABASE_URL="postgresql://neondb_owner:password@ep-xxxxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# --- JWT secret key for authentication ---
JWT_SECRET="replace_this_with_a_strong_secret"

# --- Optional: environment controls ---
NODE_ENV="production"
NEXT_PUBLIC_APP_NAME="DashboardXIQC"
NEXT_PUBLIC_SITE_URL="https://your-vercel-app.vercel.app"

# --- (Optional) Analytics / Monitoring ---
# NEXT_PUBLIC_GA_ID="G-XXXXXXX"
```

💡 **Tip:**
Keep this file local only. Copy variables into Vercel → **Settings → Environment Variables** for actual deployment.

---

## ▲ **vercel.json** (Vercel Configuration)

```json
{
  "$schema": "https://openapi.vercel.sh/config.json",
  "version": 2,
  "builds": [
    {
      "src": "next.config.js",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NODE_ENV": "production",
    "JWT_SECRET": "@jwt_secret",
    "DATABASE_URL": "@database_url"
  },
  "framework": "nextjs",
  "regions": ["sin1"],
  "buildCommand": "npx prisma generate && npx prisma migrate deploy && next build",
  "outputDirectory": ".next",
  "installCommand": "npm ci",
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

🧩 **What this does:**

- Builds your app using **Next.js 14 on Vercel**
- Ensures Prisma schema is generated before build
- Pulls secrets (`@jwt_secret`, `@database_url`) from Vercel dashboard
- Sets region to **Singapore (`sin1`)** — best for Asia-Pacific latency
  (change to `"iad1"` or `"fra1"` if deploying elsewhere)

---

## 🧠 **Deployment Recap**

| Step | Action                 | Command / UI                            |
| ---- | ---------------------- | --------------------------------------- |
| 1️⃣   | Create Neon PostgreSQL | [https://neon.tech](https://neon.tech)  |
| 2️⃣   | Copy connection string | Use `DATABASE_URL` in `.env.production` |
| 3️⃣   | Test locally           | `docker build && docker run`            |
| 4️⃣   | Push to GitHub         | `git push origin main`                  |
| 5️⃣   | Deploy to Vercel       | Import repo → set secrets → Deploy 🚀   |

---
