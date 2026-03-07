import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/auth";

/**
 * Returns category > subcategory > article outline for member-area sidebar.
 * Only private (member) articles.
 */
async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const categories = await prisma.category.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: {
      subcategories: {
        orderBy: [{ order: "asc" }, { name: "asc" }],
        include: {
          articles: {
            where: { isPublic: false, publishedAt: { not: null } },
            orderBy: { title: "asc" },
            select: { id: true, title: true, slug: true },
          },
        },
      },
    },
  });

  const outline = categories
    .map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      subcategories: cat.subcategories
        .filter((sub) => sub.articles.length > 0)
        .map((sub) => ({
          id: sub.id,
          name: sub.name,
          slug: sub.slug,
          articles: sub.articles,
        })),
    }))
    .filter((cat) => cat.subcategories.length > 0);

  return res.json(outline);
}

export default withAuth(handler);
