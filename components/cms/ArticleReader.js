/**
 * Medium-style article reader component.
 * Optimized typography and spacing for enjoyable reading.
 */
import { cn } from "@/lib/utils";

const proseClass =
  "prose prose-lg max-w-none dark:prose-invert " +
  "prose-headings:font-serif prose-headings:tracking-tight " +
  "prose-h1:text-4xl prose-h1:font-bold prose-h1:mt-12 prose-h1:mb-4 first:prose-h1:mt-0 " +
  "prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-10 prose-h2:mb-3 prose-h2:border-b prose-h2:border-border prose-h2:pb-2 " +
  "prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-2 " +
  "prose-p:text-foreground prose-p:leading-relaxed prose-p:mb-4 prose-p:text-[1.0625rem] " +
  "prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:transition-colors " +
  "prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-blockquote:my-6 " +
  "prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none " +
  "prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto prose-pre:my-6 " +
  "prose-ul:my-4 prose-ol:my-4 prose-li:my-1 " +
  "prose-img:rounded-lg prose-img:shadow-md prose-img:my-6 " +
  "[&_iframe]:rounded-lg [&_iframe]:my-6 [&_iframe]:max-w-full [&_iframe]:aspect-video " +
  "[&_.iframe-wrapper]:my-6 [&_.iframe-wrapper]:max-w-full [&_.iframe-wrapper_iframe]:w-full [&_.iframe-wrapper_iframe]:aspect-video";

export default function ArticleReader({ article, className }) {
  const { title, excerpt, content, coverImage, author, publishedAt } = article;

  return (
    <article
      className={cn("article-reader", className)}
      itemScope
      itemType="https://schema.org/Article"
    >
      <header className="mb-10">
        <h1
          className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
          itemProp="headline"
        >
          {title}
        </h1>
        {(author || publishedAt) && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-muted-foreground">
            {author && (
              <span itemProp="author" itemScope itemType="https://schema.org/Person">
                <span itemProp="name">{author.username}</span>
              </span>
            )}
            {author && publishedAt && <span aria-hidden>·</span>}
            {publishedAt && (
              <time dateTime={new Date(publishedAt).toISOString()} itemProp="datePublished">
                {new Date(publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
          </div>
        )}
        {excerpt && (
          <p className="mt-4 text-xl text-muted-foreground leading-relaxed" itemProp="description">
            {excerpt}
          </p>
        )}
      </header>

      {coverImage && (
        <div className="-mx-4 mb-10 overflow-hidden rounded-lg sm:mx-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverImage}
            alt=""
            className="w-full aspect-video object-cover"
            loading="eager"
          />
        </div>
      )}

      <div
        className={proseClass}
        dangerouslySetInnerHTML={{ __html: content }}
        itemProp="articleBody"
      />
    </article>
  );
}
