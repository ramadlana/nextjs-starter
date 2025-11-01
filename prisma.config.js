// prisma.config.js
import { defineConfig } from "@prisma/config";
import dotenv from "dotenv";
import fs from "fs";

// ✅ Only load .env locally (Vercel already injects process.env)
if (process.env.VERCEL || process.env.NODE_ENV === "production") {
  console.log("⚙️ Using environment variables from Vercel");
} else {
  const hasEnv = fs.existsSync(".env");
  if (hasEnv) {
    dotenv.config({ path: ".env" });
    console.log("⚙️ Loaded local .env file");
  } else {
    console.warn("⚠️ No .env found for local dev");
  }
}

// Log which DB is being used
if (process.env.DATABASE_URL?.startsWith("postgres")) {
  console.log("🟢 Using PostgreSQL database");
} else {
  console.log("🟣 Using SQLite database");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  seed: "node prisma/seed.js", // JS seed file
});
