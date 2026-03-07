import prisma from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

/**
 * Fetch article by slug.
 * Query params: slug, public (true|false)
 * - public=true: no auth (for /public/articles)
 * - public=false: requires auth (for /member-area)
 */
async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { slug, public: isPublicParam } = req.query;
  if (!slug || typeof slug !== "string") {
    return res.status(400).json({ error: "Slug is required" });
  }

  const isPublic = isPublicParam === "true";

  if (!isPublic) {
    const user = await verifyAuth(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });
  }

  const article = await prisma.article.findFirst({
    where: {
      slug: slug.trim(),
      isPublic,
      publishedAt: { not: null },
    },
    include: {
      author: { select: { id: true, username: true } },
      subcategory: { include: { category: true } },
    },
  });

  if (!article) return res.status(404).json({ error: "Article not found" });

  return res.json(article);
}

export default handler;
