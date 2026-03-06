import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import SimpleChart from "../../components/SimpleChart";
import { withAuthPage } from "../../lib/auth";

export default function FetchPublic({ user }) {
  // Static chart (always available)
  const baseData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    values: [12, 19, 8, 15, 22],
  };

  // Weather chart state
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch weather data client-side (min loading time so spinner is visible — API is often very fast)
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
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="prose prose-sm max-w-none text-gray-700 border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Why this page uses useEffect
          </h3>
          <p className="mb-3">
            The weather data is loaded <strong>after</strong> the page appears in the browser (client-side). We use <code className="bg-gray-100 px-1 rounded">useEffect</code> so the fetch runs once when the component mounts. The server sends the initial page with your user info; the chart data is then requested by the browser and rendered when it arrives.
          </p>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Data flow
          </h3>
          <p className="mb-3">
            Your browser calls the external API <strong>directly</strong> (e.g. <code className="bg-gray-100 px-1 rounded">api.open-meteo.com</code>). There is no server in between: the request goes from the user&apos;s device straight to the public API. The response comes back to the browser and is displayed in the chart.
          </p>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Can this be used when we have an API key?
          </h3>
          <p className="mb-3">
            <strong>No.</strong> This pattern is only for <strong>public</strong> APIs that do not require a key or that allow key-in-URL (which is still unsafe). If the API requires a secret key or token, you must <strong>not</strong> call it from the browser—the key would be visible in the client. Use a private API route instead (like the &quot;Private Weather&quot; example), where the key stays on the server.
          </p>
          <p className="mb-3">
            <strong>If you move the call to your own API route</strong> (e.g. <code className="bg-gray-100 px-1 rounded">/api/weather</code>), then <strong>yes</strong>—you can use an API key. The browser would call only your API; your API route would call the external service and add the key from <code className="bg-gray-100 px-1 rounded">process.env</code> on the server. The key never reaches the client. That is the same pattern as the &quot;Private Weather&quot; example.
          </p>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Loading behavior (same as Private Weather)
          </h3>
          <p className="mb-3">
            In <strong>behavior</strong>, this page and the Private Weather example work the same: the page loads first (layout and text appear), then the browser fetches data. While fetching, we show &quot;Loading weather data...&quot; so the user knows data is on the way. When the response arrives, we show the chart. So: page → loading state → data. The difference is only <em>where</em> the request goes (external API directly here, our API on the Private page), not the loading experience.
          </p>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            How this differs from Private Weather
          </h3>
          <p>
            <strong>This page:</strong> the browser calls the external API <strong>directly</strong> (no backend in between). <strong>Private Weather:</strong> the browser calls <strong>our</strong> API route; our server then calls the external API. So the difference is <em>where</em> the external API is called—in the client (here) or on the server (Private). Use this pattern only for public, no-key APIs. When you need auth or an API key, use the Private pattern (or move this fetch into an API route).
          </p>
        </div>
        <h3 className="text-xl mb-2">Weekly Stats</h3>
        <SimpleChart data={baseData} />
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-xl mb-2">Weather Forecast (Hourly °C)</h3>

        {loading && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div
              className="w-10 h-10 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"
              aria-hidden
            />
            <p className="text-gray-500 italic">Loading weather data...</p>
          </div>
        )}

        {!loading && weather && <SimpleChart data={weather} />}

        {!loading && !weather && (
          <p className="text-red-500">Failed to load weather data</p>
        )}
      </div>
    </Layout>
  );
}

// Keep auth on server, no weather fetching here
export const getServerSideProps = withAuthPage(
  async (_context, user) => {
    return { props: { user } };
  },
  ["USER"]
);
