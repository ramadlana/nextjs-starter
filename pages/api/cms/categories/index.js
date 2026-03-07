import prisma from "@/lib/prisma";
import { withRole } from "@/lib/auth";

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function handler(req, res) {
  if (req.method === "GET") {
    const all = await prisma.category.findMany({
      orderBy: [{ order: "asc" }, { name: "asc" }],
    });
    function buildTree(parentId) {
      return all
        .filter((c) => (c.parentId ?? null) === parentId)
        .map((c) => ({ ...c, children: buildTree(c.id) }));
    }
    const tree = buildTree(null);
    return res.json(tree);
  }

  if (req.method === "POST") {
    const { name, description, order, parentId } = req.body;
    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Name is required" });
    }
    const nameSlug = slugify(name);
    let slug = nameSlug;
    if (parentId) {
      const parent = await prisma.category.findUnique({
        where: { id: Number(parentId) },
      });
      if (!parent) return res.status(400).json({ error: "Parent category not found" });
      slug = `${parent.slug}-${nameSlug}`;
    }
    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug,
        description: description?.trim() || null,
        order: Number.isFinite(Number(order)) ? Number(order) : 0,
        parentId: parentId ? Number(parentId) : null,
      },
    });
    return res.json(category);
  }

  return res.status(405).json({ error: "Method not allowed" });
}

export default withRole(handler, ["ADMIN", "EDITOR"]);
