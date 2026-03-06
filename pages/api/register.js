import prisma from "../../lib/prisma";
import argon2 from "argon2";

const USERNAME_MIN = 3;
const USERNAME_MAX = 64;
const PASSWORD_MIN = 8;
const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const raw = req.body || {};
  const username = typeof raw.username === "string" ? raw.username.trim() : "";
  const password = typeof raw.password === "string" ? raw.password : "";

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }
  if (username.length < USERNAME_MIN || username.length > USERNAME_MAX) {
    return res
      .status(400)
      .json({ error: `Username must be ${USERNAME_MIN}-${USERNAME_MAX} characters` });
  }
  if (!USERNAME_REGEX.test(username)) {
    return res
      .status(400)
      .json({ error: "Username may only contain letters, numbers, underscore, hyphen" });
  }
  if (password.length < PASSWORD_MIN) {
    return res
      .status(400)
      .json({ error: `Password must be at least ${PASSWORD_MIN} characters` });
  }

  try {
    const hash = await argon2.hash(password);
    const user = await prisma.user.create({
      data: { username, password: hash },
    });
    return res.status(201).json({ id: user.id, username: user.username });
  } catch (e) {
    if (e.code === "P2002") {
      return res.status(400).json({ error: "Username already exists" });
    }
    console.error("Register error:", e);
    return res.status(500).json({ error: "Registration failed" });
  }
}
