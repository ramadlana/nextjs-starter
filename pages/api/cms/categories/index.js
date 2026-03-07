import prisma from "@/lib/prisma";
import { withRole } from "@/lib/auth";

async function handler(req, res) {
  if (req.method === "GET") {
    const categories = await prisma.category.findMany({
      orderBy: [{ order: "asc" }, { name: "asc" }],
      include: {
        subcategories: {
          orderBy: [{ order: "asc" }, { name: "asc" }],
        },
      },
    });
    return res.json(categories);
  }

  if (req.method === "POST") {
    const { name, description, order } = req.body;
    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Name is required" });
    }
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug,
        description: description?.trim() || null,
        order: Number.isFinite(Number(order)) ? Number(order) : 0,
      },
    });
    return res.json(category);
  }

  return res.status(405).json({ error: "Method not allowed" });
}

export default withRole(handler, ["ADMIN", "EDITOR"]);
