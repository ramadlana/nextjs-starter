import Layout from "../../components/Layout";
import { withAuthPage } from "../../lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ExampleSSR({ user, serverData }) {
  return (
    <Layout user={user}>
      <Card>
        <CardHeader>
          <CardTitle>Example: Server-Side Rendering (SSR)</CardTitle>
          <CardDescription>
            Data is fetched on the server per request and sent in the initial HTML.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Rendered data — available on first paint */}
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <h3 className="text-sm font-semibold text-foreground mb-2">Data from server (getServerSideProps)</h3>
            <pre className="text-xs text-muted-foreground overflow-auto max-h-40">
              {JSON.stringify(serverData, null, 2)}
            </pre>
          </div>

          <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 border-t border-border pt-6">
            <h3 className="text-base font-semibold text-foreground">What is SSR?</h3>
            <p>
              <strong>Server-Side Rendering</strong> means the page content is built on the server for each request.
              Data is fetched in <code className="rounded bg-muted px-1.5 py-0.5 text-sm">getServerSideProps</code>.
              The server sends HTML that already contains the data — no loading spinner for that content.
            </p>

            <h3 className="text-base font-semibold text-foreground">How it works here</h3>
            <p>
              1. User requests this page → 2. Next.js runs <code className="rounded bg-muted px-1.5 py-0.5 text-sm">getServerSideProps</code> on the server → 3. We fetch or compute <code className="rounded bg-muted px-1.5 py-0.5 text-sm">serverData</code> (e.g. from DB or API) → 4. The page component receives it as <code className="rounded bg-muted px-1.5 py-0.5 text-sm">props</code> → 5. The server renders HTML with that data and sends it to the browser.
            </p>

            <h3 className="text-base font-semibold text-foreground">When to use SSR</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Content must be in the first HTML (SEO, social previews, no flash of empty state).</li>
              <li>Data depends on the request (cookies, headers, URL) or must be fresh every time.</li>
              <li>You need server-only secrets (DB, API keys) and don’t want to expose an API to the client.</li>
              <li>First-load performance matters: user sees content without waiting for a client fetch.</li>
            </ul>

            <h3 className="text-base font-semibold text-foreground">Best practices</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><strong>Keep getServerSideProps fast</strong> — slow server work blocks the response. Use DB indexes, caching, or parallel fetches where possible.</li>
              <li><strong>Return only what the page needs</strong> — avoid over-fetching; smaller props mean faster serialization and smaller HTML.</li>
              <li><strong>Handle errors</strong> — use try/catch, return <code className="rounded bg-muted px-1 py-0.5 text-xs">redirect</code> or custom status when appropriate.</li>
              <li><strong>Don’t use for static content</strong> — if data rarely changes, prefer <code className="rounded bg-muted px-1 py-0.5 text-xs">getStaticProps</code> + revalidate for better performance.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
}

export const getServerSideProps = withAuthPage(
  async (_context, user) => {
    // Simulate server-only data fetch (DB, internal API, etc.)
    const serverData = {
      source: "getServerSideProps",
      timestamp: new Date().toISOString(),
      message: "This data was computed on the server for this request.",
      items: [
        { id: 1, label: "Item A", value: 42 },
        { id: 2, label: "Item B", value: 128 },
        { id: 3, label: "Item C", value: 7 },
      ],
    };

    return {
      props: {
        user,
        serverData,
      },
    };
  }
);
