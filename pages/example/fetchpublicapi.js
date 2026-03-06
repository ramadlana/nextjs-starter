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

export default function FetchPublic({ user }) {
  const baseData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    values: [12, 19, 8, 15, 22],
  };

  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const start = Date.now();
    async function fetchWeather() {
      try {
        const latitude = -6.2;
        const longitude = 106.8;
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`
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
        setTimeout(() => setLoading(false), 1000);
      }
    }

    fetchWeather();
  }, []);

  return (
    <Layout user={user}>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Public Weather API</CardTitle>
          <CardDescription>
            Browser calls the external API directly (no API key).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose prose-sm max-w-none text-muted-foreground border-b border-border pb-4 space-y-3">
            <h3 className="text-base font-semibold text-foreground">
              Why this page uses useEffect
            </h3>
            <p>
              The weather data is loaded <strong>after</strong> the page appears in the browser (client-side). We use <code className="rounded bg-muted px-1.5 py-0.5 text-sm">useEffect</code> so the fetch runs once when the component mounts.
            </p>
            <h3 className="text-base font-semibold text-foreground">
              Data flow
            </h3>
            <p>
              Your browser calls the external API <strong>directly</strong> (e.g. <code className="rounded bg-muted px-1.5 py-0.5 text-sm">api.open-meteo.com</code>). There is no server in between. Use this pattern only for public, no-key APIs.
            </p>
          </div>
          <h3 className="text-lg font-medium">Weekly Stats</h3>
          <SimpleChart data={baseData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weather Forecast (Hourly °C)</CardTitle>
          <CardDescription>Live data from Open-Meteo</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div
                className="w-10 h-10 border-2 border-muted border-t-primary rounded-full animate-spin"
                aria-hidden
              />
              <p className="text-muted-foreground italic">
                Loading weather data...
              </p>
            </div>
          )}

          {!loading && weather && <SimpleChart data={weather} />}

          {!loading && !weather && (
            <p className="text-destructive text-center py-8">
              Failed to load weather data
            </p>
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
