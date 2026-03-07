import prisma from "@/lib/prisma";
import { withRole } from "@/lib/auth";

async function handler(req, res) {
  const id = Number(req.query.id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: "Invalid article ID" });
  }

  if (req.method === "GET") {
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, username: true } },
        category: { include: { parent: true } },
      },
    });
    if (!article) return res.status(404).json({ error: "Article not found" });
    return res.json(article);
  }

  if (req.method === "PUT") {
    const { title, excerpt, content, coverImage, isPublic, categoryId, slug } = req.body;
    const article = await prisma.article.findUnique({ where: { id } });
    if (!article) return res.status(404).json({ error: "Article not found" });

    const updateData = {};
    if (typeof title === "string") updateData.title = title.trim();
    if (typeof excerpt === "string") updateData.excerpt = excerpt.trim() || null;
    if (typeof content === "string") updateData.content = content;
    if (typeof coverImage === "string") updateData.coverImage = coverImage.trim() || null;
    if (typeof isPublic === "boolean") {
      updateData.isPublic = isPublic;
      if (!article.publishedAt) updateData.publishedAt = new Date(); // Publish on save (public or member)
    }
    if (categoryId !== undefined)
      updateData.categoryId = categoryId ? Number(categoryId) : null;
    if (typeof slug === "string" && slug.trim()) {
      updateData.slug = slug
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    const updated = await prisma.article.update({
      where: { id },
      data: updateData,
      include: {
        author: { select: { id: true, username: true } },
        category: { include: { parent: true } },
      },
    });
    return res.json(updated);
  }

  if (req.method === "DELETE") {
    await prisma.article.delete({ where: { id } });
    return res.json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}

export default withRole(handler, ["ADMIN", "EDITOR"]);
