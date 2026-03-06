import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { withAuthPage } from "../../lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ExampleCSR({ user }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        // Simulate API call (e.g. our own API route or public API)
        const res = await fetch("/api/user/profile");
        if (!res.ok) throw new Error("Fetch failed");
        const json = await res.json();
        if (!cancelled) {
          setData({ ...json, fetchedAt: new Date().toISOString(), source: "client" });
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, []);

  return (
    <Layout user={user}>
      <Card>
        <CardHeader>
          <CardTitle>Example: Client-Side Rendering (CSR)</CardTitle>
          <CardDescription>
            Data is fetched in the browser after the page loads, using useEffect + fetch.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Data appears after client fetch */}
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <h3 className="text-sm font-semibold text-foreground mb-2">Data from client (useEffect + fetch)</h3>
            {loading && (
              <div className="flex items-center gap-2 py-4 text-muted-foreground">
                <div className="h-4 w-4 rounded-full border-2 border-muted-foreground border-t-transparent animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            )}
            {error && (
              <p className="text-sm text-destructive py-2">{error}</p>
            )}
            {!loading && data && (
              <pre className="text-xs text-muted-foreground overflow-auto max-h-40">
                {JSON.stringify(data, null, 2)}
              </pre>
            )}
          </div>

          <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 border-t border-border pt-6">
            <h3 className="text-base font-semibold text-foreground">What is CSR?</h3>
            <p>
              <strong>Client-Side Rendering</strong> means the page shell is sent first; data is then requested and rendered in the browser. We use <code className="rounded bg-muted px-1.5 py-0.5 text-sm">useEffect</code> to run a <code className="rounded bg-muted px-1.5 py-0.5 text-sm">fetch</code> when the component mounts. Until the request completes, we show a loading state.
            </p>

            <h3 className="text-base font-semibold text-foreground">How it works here</h3>
            <p>
              1. User gets the page HTML (with layout, no data yet) → 2. React hydrates → 3. <code className="rounded bg-muted px-1.5 py-0.5 text-sm">useEffect</code> runs → 4. We call <code className="rounded bg-muted px-1.5 py-0.5 text-sm">fetch(&quot;/api/user/profile&quot;)</code> (cookie sent automatically) → 5. When the response arrives, we set state and re-render with the data.
            </p>

            <h3 className="text-base font-semibold text-foreground">When to use CSR</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Data is only needed after the page is visible (dashboards, user-specific panels).</li>
              <li>Content doesn’t need to be in the first HTML for SEO (e.g. behind login).</li>
              <li>You want to avoid blocking the initial response on slow server fetches.</li>
              <li>Data updates in response to user actions (filters, pagination, real-time).</li>
            </ul>

            <h3 className="text-base font-semibold text-foreground">Best practices</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><strong>Show loading and error states</strong> — never leave the user with a blank area; use a spinner or skeleton and handle fetch errors.</li>
              <li><strong>Cancel on unmount</strong> — use a flag or AbortController in useEffect cleanup so you don’t set state after unmount (avoids warnings and bugs).</li>
              <li><strong>Use your API routes for secrets</strong> — call your own <code className="rounded bg-muted px-1 py-0.5 text-xs">/api/*</code> from the client so API keys stay on the server; don’t call third-party APIs with keys from the browser.</li>
              <li><strong>Prefer SSR for SEO-critical content</strong> — if crawlers or social previews need the data, fetch it in getServerSideProps (or getStaticProps) instead.</li>
            </ul>
          </div>
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
