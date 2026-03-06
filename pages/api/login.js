import prisma from "../../lib/prisma";
import argon2 from "argon2";
import { SignJWT } from "jose";
import { getJwtSecret } from "../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { username, password } = req.body || {};
  if (!username || !password)
    return res.status(400).json({ error: "username and password required" });
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await argon2.verify(user.password, password);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  let secret;
  try {
    secret = getJwtSecret();
  } catch (err) {
    return res.status(503).json({ error: "Server configuration error" });
  }
  const token = await new SignJWT({
    sub: String(user.id),
    username: user.username,
    role: user.role, // <- include role
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1h")
    .sign(secret);
  // Set HTTP-only cookie
  const cookieParts = [
    `dashx-token=${token}`,
    "HttpOnly",
    "Path=/",
    "SameSite=Strict",
  ];
  if (process.env.NODE_ENV === "production") cookieParts.push("Secure");
  // Max-Age equivalent to 1 hour
  cookieParts.push("Max-Age=3600");
  res.setHeader("Set-Cookie", cookieParts.join("; "));
  return res.json({ ok: true });
}
