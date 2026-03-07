import prisma from "@/lib/prisma";
import { withRole } from "@/lib/auth";

async function handler(req, res) {
  if (req.method === "GET") {
    const { public: isPublicParam } = req.query;
    const where = {};
    if (isPublicParam === "true") where.isPublic = true;
    else if (isPublicParam === "false") where.isPublic = false;

    const articles = await prisma.article.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      include: {
        author: { select: { id: true, username: true } },
        category: { include: { parent: true } },
      },
    });
    return res.json(articles);
  }

  if (req.method === "POST") {
    const { title, excerpt, content, coverImage, isPublic, categoryId } = req.body;
    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "Title is required" });
    }
    const slug =
      req.body.slug?.trim() ||
      title
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const article = await prisma.article.create({
      data: {
        title: title.trim(),
        slug,
        excerpt: excerpt?.trim() || null,
        content: content || "",
        coverImage: coverImage?.trim() || null,
        isPublic: Boolean(isPublic),
        publishedAt: new Date(), // Both public and member articles are published on create
        authorId: Number(req.user.id),
        categoryId: categoryId ? Number(categoryId) : null,
      },
      include: {
        author: { select: { id: true, username: true } },
        category: { include: { parent: true } },
      },
    });
    return res.json(article);
  }

  return res.status(405).json({ error: "Method not allowed" });
}

export default withRole(handler, ["ADMIN", "EDITOR"]);
