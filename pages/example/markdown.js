import Layout from "../../components/Layout";
import { withAuthPage } from "../../lib/auth";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Write your markdown here — it will be rendered below.
const MARKDOWN = `
# Hello from Markdown

This page renders **markdown** that you define in the page. Edit the \`MARKDOWN\` constant in \`pages/example/markdown.js\` to change the content.

## Features

- **Bold** and *italic* text
- [Links](https://example.com)
- \`inline code\` and code blocks
- Lists (ordered and unordered)
- Tables (GitHub Flavored Markdown)

## Code block

\`\`\`js
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

## Table example

| Feature   | Supported |
| --------- | --------- |
| Headings  | Yes       |
| Tables    | Yes       |
| Strikethrough | Yes   |

## Blockquote

> Keep your content in the \`MARKDOWN\` string and it will be rendered as HTML.
`;

const markdownComponents = {
  h1: ({ node, ...props }) => <h1 className="text-2xl font-bold text-foreground mt-6 mb-2 first:mt-0" {...props} />,
  h2: ({ node, ...props }) => <h2 className="text-xl font-semibold text-foreground mt-6 mb-2 border-b border-border pb-1" {...props} />,
  h3: ({ node, ...props }) => <h3 className="text-lg font-semibold text-foreground mt-4 mb-2" {...props} />,
  p: ({ node, ...props }) => <p className="text-foreground text-sm leading-relaxed mb-3" {...props} />,
  ul: ({ node, ...props }) => <ul className="list-disc list-inside text-foreground text-sm mb-3 space-y-1" {...props} />,
  ol: ({ node, ...props }) => <ol className="list-decimal list-inside text-foreground text-sm mb-3 space-y-1" {...props} />,
  li: ({ node, ...props }) => <li className="text-foreground" {...props} />,
  a: ({ node, ...props }) => <a className="text-primary underline hover:no-underline" target="_blank" rel="noreferrer" {...props} />,
  code: ({ node, ...props }) => (
    <code className="bg-muted text-foreground px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
  ),
  pre: ({ node, ...props }) => (
    <pre className="bg-muted border border-border rounded-lg p-4 overflow-x-auto mb-3 text-sm font-mono" {...props} />
  ),
  blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-primary pl-4 my-3 text-muted-foreground text-sm italic" {...props} />,
  table: ({ node, ...props }) => <div className="overflow-x-auto mb-3"><table className="w-full text-sm text-foreground border-collapse" {...props} /></div>,
  thead: ({ node, ...props }) => <thead className="bg-muted" {...props} />,
  th: ({ node, ...props }) => <th className="border border-border px-3 py-2 text-left font-semibold" {...props} />,
  td: ({ node, ...props }) => <td className="border border-border px-3 py-2" {...props} />,
  tbody: ({ node, ...props }) => <tbody {...props} />,
};

export default function MarkdownExample({ user }) {
  return (
    <Layout user={user}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" aria-hidden />
            <CardTitle>Markdown render</CardTitle>
          </div>
          <CardDescription>
            Content is defined in the page as a string and rendered with react-markdown. Edit the MARKDOWN constant in this file.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <article className="max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {MARKDOWN.trim()}
            </ReactMarkdown>
          </article>
        </CardContent>
      </Card>
    </Layout>
  );
}

export const getServerSideProps = withAuthPage(
  async (_context, user) => {
    return { props: { user } };
  }
);
