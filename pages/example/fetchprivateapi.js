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

export default function FetchPrivate({ user }) {
  const [weatherData, setWeatherData] = useState({
    labels: [],
    values: [],
  });
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
          <CardTitle>Private Weather API</CardTitle>
          <CardDescription>
            Data is loaded client-side via our API route (API key stays on server).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose prose-sm max-w-none text-muted-foreground border-b border-border pb-4 space-y-3">
            <h3 className="text-base font-semibold text-foreground">
              Why this page uses useEffect
            </h3>
            <p>
              The weather data is loaded <strong>after</strong> the page is shown in the browser (client-side). We use <code className="rounded bg-muted px-1.5 py-0.5 text-sm">useEffect</code> so that the fetch runs once when the component mounts. The server only sends the initial HTML with your user info; the chart data is requested by the browser and then displayed.
            </p>
            <h3 className="text-base font-semibold text-foreground">
              Data flow
            </h3>
            <p>
              Your browser calls <strong>our</strong> API route <code className="rounded bg-muted px-1.5 py-0.5 text-sm">/api/weatherprivate</code>. The request automatically includes your auth cookie. Our server checks the cookie, then calls the external weather API. The response is sent back to the browser. The external API URL and any secrets never leave the server.
            </p>
            <h3 className="text-base font-semibold text-foreground">
              Can this be used when we have an API key?
            </h3>
            <p>
              <strong>Yes.</strong> This pattern is the right one when you have an API key or other secrets. The key is stored and used only in the API route file. The browser only talks to your API; your API adds the key when calling the third-party service.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Weather (from private API)</h3>
            {loading ? (
              <p className="text-center text-muted-foreground py-8">
                Loading weather data...
              </p>
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
  },
  ["USER"]
);
