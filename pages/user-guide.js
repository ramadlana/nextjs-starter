import fs from "fs";
import path from "path";
import Layout from "@/components/Layout";
import { withAuthPage } from "@/lib/auth";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BookOpen } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const markdownComponents = {
  h1: ({ node, ...props }) => <h1 className="text-2xl font-bold text-foreground mt-8 mb-4 first:mt-0 scroll-mt-20" {...props} />,
  h2: ({ node, ...props }) => <h2 className="text-xl font-semibold text-foreground mt-8 mb-3 border-b border-border pb-2 scroll-mt-20" {...props} />,
  h3: ({ node, ...props }) => <h3 className="text-lg font-semibold text-foreground mt-6 mb-2 scroll-mt-20" {...props} />,
  p: ({ node, ...props }) => <p className="text-foreground text-sm leading-relaxed mb-3" {...props} />,
  ul: ({ node, ...props }) => <ul className="list-disc list-inside text-foreground text-sm mb-4 space-y-1 pl-2" {...props} />,
  ol: ({ node, ...props }) => <ol className="list-decimal list-inside text-foreground text-sm mb-4 space-y-1 pl-2" {...props} />,
  li: ({ node, ...props }) => <li className="text-foreground" {...props} />,
  a: ({ node, href, ...props }) => (
    <a href={href} className="text-primary underline hover:no-underline" {...(href?.startsWith("#") ? {} : { target: "_blank", rel: "noreferrer" })} {...props} />
  ),
  code: ({ node, ...props }) => (
    <code className="bg-muted text-foreground px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
  ),
  pre: ({ node, ...props }) => (
    <pre className="bg-muted border border-border rounded-lg p-4 overflow-x-auto mb-4 text-sm font-mono" {...props} />
  ),
  blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-primary pl-4 my-4 text-muted-foreground text-sm italic" {...props} />,
  table: ({ node, ...props }) => <div className="overflow-x-auto mb-4"><table className="w-full text-sm text-foreground border-collapse" {...props} /></div>,
  thead: ({ node, ...props }) => <thead className="bg-muted" {...props} />,
  th: ({ node, ...props }) => <th className="border border-border px-3 py-2 text-left font-semibold" {...props} />,
  td: ({ node, ...props }) => <td className="border border-border px-3 py-2" {...props} />,
  tbody: ({ node, ...props }) => <tbody {...props} />,
  hr: ({ node, ...props }) => <hr className="my-6 border-border" {...props} />,
};

export default function UserGuidePage({ user, content }) {
  return (
    <Layout user={user}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" aria-hidden />
            <CardTitle>User Guide</CardTitle>
          </div>
          <CardDescription>
            How to use this boilerplate: auth, roles, SSR vs CSR, API protection, and common patterns.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <article className="prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {content}
            </ReactMarkdown>
          </article>
        </CardContent>
      </Card>
    </Layout>
  );
}

export const getServerSideProps = withAuthPage(async (_context, user) => {
  const filePath = path.join(process.cwd(), "USER_GUIDE.md");
  let content = "";
  try {
    content = fs.readFileSync(filePath, "utf-8");
  } catch (err) {
    console.error("Failed to read USER_GUIDE.md:", err.message);
    content = "# User Guide\n\nUnable to load the guide. Ensure `USER_GUIDE.md` exists in the project root.";
  }
  return { props: { user, content } };
});
