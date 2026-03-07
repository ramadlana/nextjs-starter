import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { withAuthPage } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Plus,
  Edit,
  ExternalLink,
  Lock,
  Search,
  ChevronLeft,
  ChevronRight,
  Globe,
  Loader2,
  FolderPlus,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

function getCategoryPath(category) {
  if (!category) return "—";
  const parts = [];
  let c = category;
  while (c) {
    parts.unshift(c.name);
    c = c.parent;
  }
  return parts.join(" › ");
}

/** Flatten category tree to [{ id, pathLabel }] for select options */
function flattenCategories(tree, pathLabel = []) {
  const result = [];
  for (const node of tree) {
    const label = [...pathLabel, node.name];
    result.push({ id: node.id, pathLabel: label.join(" › ") });
    if (node.children?.length) {
      result.push(...flattenCategories(node.children, label));
    }
  }
  return result;
}

function CmsPage({ user }) {
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState("all"); // all | public | member

  const [page, setPage] = useState(1);

  // Manage Categories state
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [newSubcategoryParentId, setNewSubcategoryParentId] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [creatingSubcategory, setCreatingSubcategory] = useState(false);

  const refreshCategories = () => {
    fetch("/api/cms/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(console.error);
  };

  useEffect(() => {
    refreshCategories();
  }, []);

  const flatCategories = flattenCategories(categories);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setCreatingCategory(true);
    try {
      const res = await fetch("/api/cms/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create");
      setNewCategoryName("");
      refreshCategories();
    } catch (err) {
      alert(err.message || "Failed to create category");
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleCreateSubcategory = async (e) => {
    e.preventDefault();
    if (!newSubcategoryName.trim()) {
      alert("Name is required");
      return;
    }
    if (!newSubcategoryParentId) {
      alert("Please select a parent category");
      return;
    }
    setCreatingSubcategory(true);
    try {
      const res = await fetch("/api/cms/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newSubcategoryName.trim(),
          parentId: Number(newSubcategoryParentId),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create");
      setNewSubcategoryName("");
      setNewSubcategoryParentId("");
      refreshCategories();
    } catch (err) {
      alert(err.message || "Failed to create subcategory");
    } finally {
      setCreatingSubcategory(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", "20");
    if (search.trim()) params.set("search", search.trim());
    if (visibilityFilter === "public") params.set("public", "true");
    else if (visibilityFilter === "member") params.set("public", "false");

    fetch(`/api/cms/articles?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setArticles(data.articles || []);
        setPagination(data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, search, visibilityFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const handleFilterChange = (value) => {
    setVisibilityFilter(value);
    setPage(1);
  };

  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) setPage(newPage);
  };

  return (
    <Layout user={user}>
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Content Management</h1>
            <p className="text-muted-foreground mt-1 text-sm">
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

        {/* Manage Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderPlus className="h-5 w-5" aria-hidden />
              Manage Categories
            </CardTitle>
            <CardDescription>
              Create categories and subcategories. Supports unlimited nesting: category › subcategory
              › subsubcategory › ...
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleCreateCategory} className="flex gap-2 items-end">
              <div className="flex-1 min-w-0">
                <label htmlFor="newCategory" className="block text-sm font-medium mb-1">
                  New root category
                </label>
                <Input
                  id="newCategory"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Category name"
                  disabled={creatingCategory}
                />
              </div>
              <Button type="submit" disabled={creatingCategory || !newCategoryName.trim()}>
                {creatingCategory ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <Plus className="h-4 w-4" aria-hidden />
                )}
                Add
              </Button>
            </form>

            <form onSubmit={handleCreateSubcategory} className="flex flex-wrap gap-2 items-end">
              <div className="min-w-[140px]">
                <label htmlFor="parentCategory" className="block text-sm font-medium mb-1">
                  Parent
                </label>
                <select
                  id="parentCategory"
                  value={newSubcategoryParentId}
                  onChange={(e) => setNewSubcategoryParentId(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  disabled={creatingSubcategory}
                >
                  <option value="">Select parent...</option>
                  {flatCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.pathLabel}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[140px]">
                <label htmlFor="newSubcategory" className="block text-sm font-medium mb-1">
                  New subcategory
                </label>
                <Input
                  id="newSubcategory"
                  value={newSubcategoryName}
                  onChange={(e) => setNewSubcategoryName(e.target.value)}
                  placeholder="Subcategory name"
                  disabled={creatingSubcategory}
                />
              </div>
              <Button
                type="submit"
                disabled={
                  creatingSubcategory || !newSubcategoryName.trim() || !newSubcategoryParentId
                }
              >
                {creatingSubcategory ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <Plus className="h-4 w-4" aria-hidden />
                )}
                Add subcategory
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Articles</CardTitle>
            <CardDescription>
              Search, filter, and manage articles. Public articles at /public/articles/[slug], member
              articles at /member-area/articles/[slug].
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search + Filter */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                  <Input
                    type="search"
                    placeholder="Search by title, slug, or excerpt..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-9"
                    aria-label="Search articles"
                  />
                </div>
                <Button type="submit" variant="secondary" size="sm">
                  Search
                </Button>
                {search && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearch("");
                      setSearchInput("");
                      setPage(1);
                    }}
                  >
                    Clear
                  </Button>
                )}
              </form>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Filter:</span>
                <div className="flex rounded-md border border-input overflow-hidden">
                  <button
                    type="button"
                    onClick={() => handleFilterChange("all")}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors",
                      visibilityFilter === "all"
                        ? "bg-primary text-primary-foreground"
                        : "bg-background hover:bg-muted"
                    )}
                    aria-pressed={visibilityFilter === "all"}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFilterChange("public")}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors border-l border-input",
                      visibilityFilter === "public"
                        ? "bg-primary text-primary-foreground"
                        : "bg-background hover:bg-muted"
                    )}
                    aria-pressed={visibilityFilter === "public"}
                  >
                    <Globe className="h-3.5 w-3.5" aria-hidden />
                    Public
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFilterChange("member")}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors border-l border-input",
                      visibilityFilter === "member"
                        ? "bg-primary text-primary-foreground"
                        : "bg-background hover:bg-muted"
                    )}
                    aria-pressed={visibilityFilter === "member"}
                  >
                    <Lock className="h-3.5 w-3.5" aria-hidden />
                    Member
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-hidden />
              </div>
            ) : articles.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No articles found. Create one with &quot;New Article&quot;.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto rounded-md border">
                  <table className="w-full text-sm" role="grid">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-3 py-2.5 text-left font-medium text-foreground">Title</th>
                        <th className="px-3 py-2.5 text-left font-medium text-foreground hidden md:table-cell">
                          Slug
                        </th>
                        <th className="px-3 py-2.5 text-left font-medium text-foreground w-24">
                          Type
                        </th>
                        <th className="px-3 py-2.5 text-left font-medium text-foreground hidden lg:table-cell">
                          Category
                        </th>
                        <th className="px-3 py-2.5 text-left font-medium text-foreground hidden sm:table-cell w-24">
                          Author
                        </th>
                        <th className="px-3 py-2.5 text-left font-medium text-foreground hidden xl:table-cell w-28">
                          Updated
                        </th>
                        <th className="px-3 py-2.5 text-right font-medium text-foreground w-24">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {articles.map((a) => (
                        <tr
                          key={a.id}
                          className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-3 py-2">
                            <span className="font-medium truncate max-w-[200px] sm:max-w-none block">
                              {a.title}
                            </span>
                            <span className="text-xs text-muted-foreground md:hidden">{a.slug}</span>
                          </td>
                          <td className="px-3 py-2 text-muted-foreground truncate max-w-[120px] hidden md:table-cell">
                            {a.slug}
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium",
                                a.isPublic
                                  ? "bg-primary/10 text-primary"
                                  : "bg-muted text-muted-foreground"
                              )}
                            >
                              {a.isPublic ? (
                                <>
                                  <Globe className="h-3 w-3" aria-hidden />
                                  Public
                                </>
                              ) : (
                                <>
                                  <Lock className="h-3 w-3" aria-hidden />
                                  Member
                                </>
                              )}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-muted-foreground truncate max-w-[140px] hidden lg:table-cell">
                            {getCategoryPath(a.category)}
                          </td>
                          <td className="px-3 py-2 text-muted-foreground hidden sm:table-cell">
                            {a.author?.username ?? "—"}
                          </td>
                          <td className="px-3 py-2 text-muted-foreground text-xs hidden xl:table-cell">
                            {a.updatedAt
                              ? new Date(a.updatedAt).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "—"}
                          </td>
                          <td className="px-3 py-2 text-right">
                            <div className="flex items-center justify-end gap-0.5">
                              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                <Link href={`/cms/editor?id=${a.id}`} aria-label={`Edit ${a.title}`}>
                                  <Edit className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                <Link
                                  href={a.isPublic ? `/public/articles/${a.slug}` : `/member-area/articles/${a.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={`View ${a.title}`}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between gap-4 pt-2">
                    <p className="text-sm text-muted-foreground">
                      Showing {(pagination.page - 1) * pagination.limit + 1}–
                      {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                      {pagination.total}
                    </p>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(pagination.page - 1)}
                        disabled={pagination.page <= 1}
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="h-4 w-4" aria-hidden />
                      </Button>
                      <span className="px-3 text-sm text-muted-foreground">
                        Page {pagination.page} of {pagination.totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages}
                        aria-label="Next page"
                      >
                        <ChevronRight className="h-4 w-4" aria-hidden />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm">Quick Links</CardTitle>
            <CardDescription className="text-xs">
              Public articles are SEO-optimized. Member articles use the course outline sidebar.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4 pt-0">
            <Link
              href="/public/articles/hello-world"
              className="text-sm text-primary hover:underline"
            >
              View sample public article →
            </Link>
            <Link href="/member-area/articles" className="text-sm text-primary hover:underline">
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
  ["ADMIN", "EDITOR", "admin"]
);
