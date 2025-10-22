import prisma from "../../lib/prisma";
import argon2 from "argon2";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { username, password } = req.body || {};
  if (!username || !password)
    return res.status(400).json({ error: "username and password required" });
  try {
    const hash = await argon2.hash(password);
    const user = await prisma.user.create({
      data: { username, password: hash },
    });
    return res.status(201).json({ id: user.id, username: user.username });
  } catch (e) {
    return res.status(400).json({ error: "username already exists" });
  }
}
