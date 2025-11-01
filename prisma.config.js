// prisma.config.js
import { defineConfig } from "@prisma/config";
import dotenv from "dotenv";
import fs from "fs";

const isProd = process.env.VERCEL || process.env.NODE_ENV === "production";

// Load .env locally
if (!isProd && fs.existsSync(".env")) dotenv.config();

export default defineConfig({
  schema: isProd ? "prisma/schema.prisma" : "prisma/schema.dev.prisma",
});
