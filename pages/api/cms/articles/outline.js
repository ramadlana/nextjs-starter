import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/auth";

/**
 * Returns category tree > article outline for member-area sidebar.
 * Supports unlimited nesting: category > subcategory > subsubcategory > ...
 * Only private (member) articles.
 */
async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const all = await prisma.category.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: {
      articles: {
        where: { isPublic: false, publishedAt: { not: null } },
        orderBy: { title: "asc" },
        select: { id: true, title: true, slug: true },
      },
    },
  });

  function hasArticlesOrDescendants(cat) {
    if (cat.articles?.length > 0) return true;
    return cat.children?.some(hasArticlesOrDescendants) ?? false;
  }

  function buildOutline(parentId) {
    return all
      .filter((c) => (c.parentId ?? null) === parentId)
      .map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        articles: cat.articles,
        children: buildOutline(cat.id),
      }))
      .filter((cat) => hasArticlesOrDescendants(cat));
  }

  const outline = buildOutline(null);
  return res.json(outline);
}

export default withAuth(handler);
