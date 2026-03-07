/**
 * Generate URL-safe slug from string
 */
export function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
