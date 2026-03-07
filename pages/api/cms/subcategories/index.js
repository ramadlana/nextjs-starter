import prisma from "@/lib/prisma";
import { withRole } from "@/lib/auth";

async function handler(req, res) {
  if (req.method === "POST") {
    const { name, categoryId, order } = req.body;
    if (!name || typeof name !== "string" || !categoryId) {
      return res.status(400).json({ error: "Name and categoryId are required" });
    }
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const subcategory = await prisma.subcategory.create({
      data: {
        name: name.trim(),
        slug,
        categoryId: Number(categoryId),
        order: Number.isFinite(Number(order)) ? Number(order) : 0,
      },
    });
    return res.json(subcategory);
  }

  return res.status(405).json({ error: "Method not allowed" });
}

export default withRole(handler, ["ADMIN", "EDITOR"]);
