import Head from "next/head";
import ArticleReader from "@/components/cms/ArticleReader";
import prisma from "@/lib/prisma";

export default function PublicArticlePage({ article, baseUrl }) {
  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Article not found</h1>
          <p className="text-muted-foreground mt-2">
            The article you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const metaTitle = article.title;
  const metaDescription = article.excerpt || article.title;
  const metaImage = article.coverImage
    ? article.coverImage.startsWith("http")
      ? article.coverImage
      : `${baseUrl}${article.coverImage}`
    : null;
  const canonicalUrl = `${baseUrl}/public/articles/${article.slug}`;

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        {metaImage && <meta property="og:image" content={metaImage} />}
        {article.publishedAt && (
          <meta
            property="article:published_time"
            content={new Date(article.publishedAt).toISOString()}
          />
        )}
        {article.author && (
          <meta property="article:author" content={article.author.username} />
        )}
      </Head>
      <div className="min-h-screen bg-background">
        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <ArticleReader article={article} />
        </article>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { slug } = context.params;
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    `http${context.req.headers["x-forwarded-proto"] === "https" ? "s" : ""}://${context.req.headers.host || "localhost:3000"}`;

  if (!slug) {
    return { props: { article: null, baseUrl } };
  }

  const article = await prisma.article.findFirst({
    where: {
      slug,
      isPublic: true,
      publishedAt: { not: null },
    },
    include: {
      author: { select: { id: true, username: true } },
      subcategory: { include: { category: true } },
    },
  });

  // Serialize for getServerSideProps (Dates and nested objects must be JSON-serializable)
  const serialized = article ? JSON.parse(JSON.stringify(article)) : null;

  return { props: { article: serialized, baseUrl } };
}
