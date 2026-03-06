import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import SimpleChart from "../../components/SimpleChart";
import { withAuthPage } from "../../lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ClientPublicApiExample({ user }) {
  const baseData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    values: [12, 19, 8, 15, 22],
  };

  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=-6.2&longitude=106.8&hourly=temperature_2m"
        );
        const data = await res.json();
        const hourly = data?.hourly || { time: [], temperature_2m: [] };
        setWeather({
          labels: hourly.time.slice(0, 12),
          values: hourly.temperature_2m.slice(0, 12),
        });
      } catch (err) {
        console.error("Weather fetch failed:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
  }, []);

  return (
    <Layout user={user}>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Example: Client calls public API directly</CardTitle>
          <CardDescription>
            The browser calls the external API with no server in between. Only for public APIs that do not require a key.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose prose-sm max-w-none text-muted-foreground border-b border-border pb-4 space-y-3">
            <h3 className="text-base font-semibold text-foreground">Pattern</h3>
            <p>
              The page runs a <code className="rounded bg-muted px-1.5 py-0.5 text-sm">fetch</code> from the browser to the external API (e.g. <code className="rounded bg-muted px-1.5 py-0.5 text-sm">api.open-meteo.com</code>). There is no API route in the middle. The request goes directly from the client to the third-party domain.
            </p>
            <h3 className="text-base font-semibold text-foreground">When to use</h3>
            <p>
              Use this only for <strong>public</strong>, <strong>no-key</strong> APIs. If the service requires an API key or secret, use the <strong>server proxy</strong> pattern instead so the key stays on the server.
            </p>
            <h3 className="text-base font-semibold text-foreground">Best practices</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Check the API&apos;s terms and CORS policy; not all APIs allow browser requests.</li>
              <li>Handle loading and error states; the user sees the request in progress.</li>
              <li>If you later need a key or server-side logic, switch to the server-proxy example.</li>
            </ul>
          </div>
          <h3 className="text-lg font-medium">Weekly stats (static)</h3>
          <SimpleChart data={baseData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weather forecast (from public API)</CardTitle>
          <CardDescription>Live data from Open-Meteo, requested by the browser</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-10 h-10 border-2 border-muted border-t-primary rounded-full animate-spin" aria-hidden />
              <p className="text-muted-foreground italic">Loading…</p>
            </div>
          )}
          {!loading && weather && <SimpleChart data={weather} />}
          {!loading && !weather && (
            <p className="text-destructive text-center py-8">Failed to load weather data</p>
          )}
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
