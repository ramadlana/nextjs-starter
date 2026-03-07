import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { withAuthPage } from "@/lib/auth";
import ArticleReader from "@/components/cms/ArticleReader";
import { Loader2, BookOpen, ChevronRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function OutlineNode({ node, articleSlug, onNavClose, depth = 0 }) {
  const { id, name, articles = [], children = [] } = node;
  const pl = depth * 8 + 8;
  return (
    <div key={id}>
      <h3
        className="text-sm font-semibold text-foreground mb-2"
        style={depth > 0 ? { paddingLeft: pl, fontSize: "0.8125rem" } : {}}
      >
        {name}
      </h3>
      {articles.length > 0 && (
        <ul className="space-y-0.5" style={depth > 0 ? { paddingLeft: pl } : {}}>
          {articles.map((a) => (
            <li key={a.id}>
              <Link
                href={`/member-area/articles/${a.slug}`}
                onClick={onNavClose}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                  articleSlug === a.slug
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <ChevronRight
                  className={cn(
                    "h-4 w-4 shrink-0",
                    articleSlug === a.slug ? "opacity-100" : "opacity-50"
                  )}
                  aria-hidden
                />
                <span className="truncate">{a.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {children.length > 0 && (
        <div className="mt-2">
          {children.map((child) => (
            <OutlineNode
              key={child.id}
              node={child}
              articleSlug={articleSlug}
              onNavClose={onNavClose}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MemberAreaArticlesPage({ user }) {
  const router = useRouter();
  const slug = router.query.slug;
  const articleSlug = Array.isArray(slug) ? slug[0] : slug;

  const [article, setArticle] = useState(null);
  const [outline, setOutline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/cms/articles/outline", { credentials: "include" }).then((r) => r.json()),
      articleSlug
        ? fetch(
            `/api/cms/articles/by-slug?slug=${encodeURIComponent(articleSlug)}&public=false`,
            { credentials: "include" }
          ).then((r) => {
            if (!r.ok) throw new Error("Not found");
            return r.json();
          })
        : Promise.resolve(null),
    ])
      .then(([outlineData, articleData]) => {
        setOutline(Array.isArray(outlineData) ? outlineData : []);
        setArticle(articleData);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [articleSlug]);

  const showSidebar = outline.length > 0;

  return (
    <Layout user={user} fullWidth>
      <div className="flex min-h-[calc(100vh-3.5rem)]">
        {/* Sidebar - course outline: Category > Subcategory > Article */}
        {showSidebar && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden fixed bottom-4 right-4 z-50 shadow-lg"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open article outline"
            >
              <Menu className="h-4 w-4" aria-hidden />
              Contents
            </Button>
            {mobileNavOpen && (
              <div
                className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                onClick={() => setMobileNavOpen(false)}
                aria-hidden
              />
            )}
            <aside
              className={cn(
                "w-64 shrink-0 flex-col border-r border-border bg-muted/30 bg-background",
                "hidden lg:flex",
                mobileNavOpen && "flex fixed inset-y-0 left-0 z-50 lg:relative"
              )}
              aria-label="Article outline"
            >
            <div className="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto p-4 flex flex-col">
              {mobileNavOpen && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden self-end mb-2"
                  onClick={() => setMobileNavOpen(false)}
                  aria-label="Close outline"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                <BookOpen className="h-4 w-4" aria-hidden />
                Contents
              </h2>
              <nav className="space-y-4">
                {outline.map((category) => (
                  <OutlineNode
                    key={category.id}
                    node={category}
                    articleSlug={articleSlug}
                    onNavClose={() => setMobileNavOpen(false)}
                  />
                ))}
              </nav>
            </div>
            </aside>
          </>
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-hidden />
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <h2 className="text-xl font-semibold text-foreground">Article not found</h2>
              <p className="text-muted-foreground mt-2">
                {error === "Unauthorized"
                  ? "Please log in to view member articles."
                  : "The article you're looking for doesn't exist or you don't have access."}
              </p>
              <Link
                href="/member-area/articles"
                className="mt-4 inline-block text-primary hover:underline"
              >
                Browse all articles
              </Link>
            </div>
          ) : article ? (
            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
              <ArticleReader article={article} />
            </div>
          ) : (
            <div className="p-8 text-center">
              <h2 className="text-xl font-semibold text-foreground">Member Articles</h2>
              <p className="text-muted-foreground mt-2">
                Select an article from the sidebar to start reading.
              </p>
              {outline.length === 0 && (
                <p className="text-sm text-muted-foreground mt-4">
                  No articles are available yet. Check back later.
                </p>
              )}
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
}

export default MemberAreaArticlesPage;

export const getServerSideProps = withAuthPage(
  async (_context, user) => ({ props: { user } })
);
