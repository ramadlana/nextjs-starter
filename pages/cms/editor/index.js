import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
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
import { ArrowLeft, Save, Loader2, Plus, FolderPlus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const ArticleEditor = dynamic(() => import("@/components/cms/ArticleEditor"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[320px] flex items-center justify-center bg-muted/30 rounded-lg">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-hidden />
    </div>
  ),
});

/** Flatten category tree to [{ id, path, pathLabel }] for select options */
function flattenCategories(tree, path = [], pathLabel = []) {
  const result = [];
  for (const node of tree) {
    const p = [...path, node.id];
    const label = [...pathLabel, node.name];
    result.push({ id: node.id, path: p, pathLabel: label.join(" › ") });
    if (node.children?.length) {
      result.push(...flattenCategories(node.children, p, label));
    }
  }
  return result;
}

function EditorPage({ user }) {
  const router = useRouter();
  const { id } = router.query;
  const isEdit = Boolean(id);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [slug, setSlug] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Category creation state
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

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      fetch(`/api/cms/articles/${id}`)
        .then((r) => r.json())
        .then((article) => {
          setTitle(article.title);
          setExcerpt(article.excerpt || "");
          setContent(article.content || "");
          setCoverImage(article.coverImage || "");
          setSlug(article.slug);
          setIsPublic(article.isPublic);
          setCategoryId(article.categoryId?.toString() || "");
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isEdit, id]);

  const flatCategories = flattenCategories(categories);

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        excerpt: excerpt.trim() || null,
        content,
        coverImage: coverImage.trim() || null,
        slug: slug.trim() || undefined,
        isPublic,
        categoryId: categoryId ? Number(categoryId) : null,
      };
      const url = isEdit ? `/api/cms/articles/${id}` : "/api/cms/articles";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      if (!isEdit) {
        router.push(`/cms/editor?id=${data.id}`);
      }
    } catch (err) {
      alert(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

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

  if (loading) {
    return (
      <Layout user={user}>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-hidden />
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/cms" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to CMS
          </Link>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" aria-hidden />
                {isEdit ? "Update" : "Publish"}
              </>
            )}
          </Button>
        </div>

        {/* Category management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderPlus className="h-5 w-5" aria-hidden />
              Manage Categories
            </CardTitle>
            <CardDescription>
              Create categories and subcategories. Supports unlimited nesting: category › subcategory › subsubcategory › ...
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
                disabled={creatingSubcategory || !newSubcategoryName.trim() || !newSubcategoryParentId}
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
          <CardHeader>
            <CardTitle>{isEdit ? "Edit Article" : "New Article"}</CardTitle>
            <CardDescription>
              Write your article with the rich editor. Use the toolbar for formatting, images, and
              video embeds.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Article title"
                className="text-lg"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="slug" className="block text-sm font-medium mb-1">
                  Slug (URL)
                </label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="article-slug"
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1">
                  Category
                </label>
                <select
                  id="category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                >
                  <option value="">None</option>
                  {flatCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.pathLabel}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium mb-1">
                Excerpt
              </label>
              <Input
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Short description for previews"
              />
            </div>

            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium mb-1">
                Cover Image URL
              </label>
              <Input
                id="coverImage"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="/api/uploads/your-image.jpg"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded border-input"
              />
              <label htmlFor="isPublic" className="text-sm font-medium">
                Public article (visible at /public/articles/...)
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Content</label>
              <ArticleEditor content={content} onChange={setContent} />
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

export default EditorPage;

export const getServerSideProps = withAuthPage(
  async (_context, user) => ({ props: { user } }),
  ["ADMIN", "EDITOR"]
);
