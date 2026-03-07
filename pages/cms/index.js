import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { withAuthPage } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, FileText, Edit, ExternalLink, Lock } from "lucide-react";
import Link from "next/link";

function CmsPage({ user }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cms/articles")
      .then((r) => r.json())
      .then(setArticles)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const publicArticles = articles.filter((a) => a.isPublic);
  const privateArticles = articles.filter((a) => !a.isPublic);

  return (
    <Layout user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Content Management</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage public and member-only articles.
            </p>
          </div>
          <Button asChild>
            <Link href="/cms/editor">
              <Plus className="h-4 w-4" aria-hidden />
              New Article
            </Link>
          </Button>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Loading articles...
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-primary" aria-hidden />
                  Public Articles
                </CardTitle>
                <CardDescription>
                  Visible at /public/articles/[slug]
                </CardDescription>
              </CardHeader>
              <CardContent>
                {publicArticles.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No public articles yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {publicArticles.map((a) => (
                      <li
                        key={a.id}
                        className="flex items-center justify-between gap-2 rounded-lg border p-3"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{a.title}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {a.author?.username} · {a.slug}
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-1">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/cms/editor?id=${a.id}`} aria-label={`Edit ${a.title}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link
                              href={`/public/articles/${a.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`View ${a.title}`}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" aria-hidden />
                  Member Articles
                </CardTitle>
                <CardDescription>
                  Visible at /member-area/articles/[slug]
                </CardDescription>
              </CardHeader>
              <CardContent>
                {privateArticles.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No member articles yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {privateArticles.map((a) => (
                      <li
                        key={a.id}
                        className="flex items-center justify-between gap-2 rounded-lg border p-3"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{a.title}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {a.author?.username} · {a.slug}
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-1">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/cms/editor?id=${a.id}`} aria-label={`Edit ${a.title}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link
                              href={`/member-area/articles/${a.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`View ${a.title}`}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" aria-hidden />
              Quick Links
            </CardTitle>
            <CardDescription>
              Public articles are SEO-optimized. Member articles use the course outline sidebar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href="/public/articles/hello-world"
              className="block text-sm text-primary hover:underline"
            >
              View sample public article →
            </Link>
            <Link
              href="/member-area/articles"
              className="block text-sm text-primary hover:underline"
            >
              Browse member articles →
            </Link>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

export default CmsPage;

export const getServerSideProps = withAuthPage(
  async (_context, user) => ({ props: { user } }),
  ["ADMIN", "EDITOR","admin"]
);
