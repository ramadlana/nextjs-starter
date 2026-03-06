import Layout from "../../components/Layout";
import SimpleChart from "../../components/SimpleChart";
import { withAuthPage } from "../../lib/auth";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ServerProxyExample({ user }) {
  const [weatherData, setWeatherData] = useState({ labels: [], values: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch("/api/weatherprivate");
        if (!res.ok) throw new Error("Unauthorized or fetch failed");
        const data = await res.json();
        setWeatherData({ labels: data.labels, values: data.values });
      } catch (err) {
        console.error("Fetch weather error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
  }, []);

  return (
    <Layout user={user}>
      <Card>
        <CardHeader>
          <CardTitle>Example: Server as API proxy</CardTitle>
          <CardDescription>
            Client calls your API route; the server calls the external API with a secret (e.g. API key). The key never leaves the server.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose prose-sm max-w-none text-muted-foreground border-b border-border pb-4 space-y-3">
            <h3 className="text-base font-semibold text-foreground">Pattern</h3>
            <p>
              The browser only talks to <strong>your</strong> API route (<code className="rounded bg-muted px-1.5 py-0.5 text-sm">/api/weatherprivate</code>). That route runs on the server, where it can use env vars or API keys to call the third-party service (e.g. Open-Meteo or a paid API). The response is sent back to the client. The external API URL and any secrets stay on the server.
            </p>
            <h3 className="text-base font-semibold text-foreground">When to use</h3>
            <p>
              Use this pattern whenever you have an <strong>API key</strong>, <strong>secret token</strong>, or <strong>private endpoint</strong>. Never send keys from the browser. The client sends the auth cookie to your API; your API adds the key when calling the external service.
            </p>
            <h3 className="text-base font-semibold text-foreground">Best practices</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Store the key in <code className="rounded bg-muted px-1 py-0.5 text-xs">process.env</code> (e.g. <code className="rounded bg-muted px-1 py-0.5 text-xs">WEATHER_API_KEY</code>) and never commit it.</li>
              <li>Protect the route with <code className="rounded bg-muted px-1 py-0.5 text-xs">withAuth</code> so only logged-in users can trigger the proxy.</li>
              <li>Validate and limit request params (e.g. lat/lon range) to avoid abuse.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Weather (via API route)</h3>
            {loading ? (
              <p className="text-center text-muted-foreground py-8">Loading…</p>
            ) : (
              <SimpleChart data={weatherData} />
            )}
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
