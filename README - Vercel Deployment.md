### **1️⃣ Prepare Your Next.js + Prisma Project**

This project uses **PostgreSQL only** (Neon, Supabase, or any Postgres provider). No SQLite.

Create a `vercel.json` in project root:

```json
{
  "buildCommand": "npx prisma migrate deploy && npx prisma generate && next build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

This ensures Vercel always runs the full DB + Prisma pipeline, even if you change build presets.

- `migrate deploy` → ensures your Neon DB schema is in sync
- `generate` → ensures Prisma Client matches schema
- `next build` → compiles your app

---

### **2️⃣ Register a Cloud Postgres (Neon)**

1. Go to [https://neon.tech](https://neon.tech)
2. Sign in with GitHub or Google
3. Create a project → choose region near your users (e.g., Singapore for Indonesia)
4. Copy your connection string:

   ```
   postgresql://<user>:<password>@<host>/<dbname>?sslmode=require
   ```

🧠 Tip: Neon uses **serverless Postgres** — ideal for Vercel (auto-sleep, free tier).

---

### **3️⃣ Push Code to GitHub**

Make sure your Prisma schema and migrations are committed:

```bash
git add .
git commit -m "Initial commit with Prisma + Next.js"
git push
```

---

### **4️⃣ Deploy to Vercel**

1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. It will detect **Next.js** automatically
4. In **Environment Variables**, add:

| Key                   | Value                | Notes                  |
| --------------------- | -------------------- | ---------------------- |
| `DATABASE_URL`        | `postgresql://xxxxx` | from Neon              |
| `JWT_SECRET`          | `supersecret_123456` | use long random string |
| `NEXT_PUBLIC_API_URL` | _(optional)_         | for client calls       |

Click **Deploy** 🎉

---

### **5️⃣ Verify Build Logs**

You should see:

```
Running "prisma migrate deploy"
Running "prisma generate"
Prisma Client generated successfully
Next.js build completed
```

Then:

```
✅ Deployment ready! → https://yourapp.vercel.app
```

---

## Check project log is there any error?

Project -> logs

---

## 🧪 **Troubleshooting**

| Symptom                            | Cause                  | Fix                                |
| ---------------------------------- | ---------------------- | ---------------------------------- |
| ❌ `Error: P1001`                  | DB connection refused  | Add `?sslmode=require` in Neon URL |
| ❌ `Prisma Client outdated`        | Cached node_modules    | Clear build cache in Vercel        |
| ❌ `Build fails: prisma not found` | Not installed globally | Use `npx prisma ...`               |
| ⚠️ API timeout                     | Neon autosleep         | Neon auto-wakes within seconds     |

---

## ✅ **Final Working Example**

### `.env`

```env
DATABASE_URL="postgresql://user:password@ep-neon-db.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="supersecret_random_key"
```

### `package.json`

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma migrate deploy && prisma generate && next build",
    "start": "next start"
  }
}
```

---
