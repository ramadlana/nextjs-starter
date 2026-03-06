import Layout from "../../components/Layout";
import SimpleChart from "../../components/SimpleChart";
import { withAuthPage } from "../../lib/auth";
import { useEffect, useState } from "react";

export default function FetchPrivate({ user }) {
  const [weatherData, setWeatherData] = useState({
    labels: [],
    values: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      try {
        // Fetch from our private weather API, and we can save the API key on server-side (on /api/weatherprivate route file), don't expose it here
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
      <div className="bg-white p-4 rounded shadow space-y-4">
        <div className="prose prose-sm max-w-none text-gray-700 border-b pb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Why this page uses useEffect
          </h3>
          <p className="mb-3">
            The weather data is loaded <strong>after</strong> the page is shown in the browser (client-side). We use <code className="bg-gray-100 px-1 rounded">useEffect</code> so that the fetch runs once when the component mounts. The server only sends the initial HTML with your user info; the chart data is requested by the browser and then displayed.
          </p>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Data flow
          </h3>
          <p className="mb-3">
            Your browser calls <strong>our</strong> API route <code className="bg-gray-100 px-1 rounded">/api/weatherprivate</code>. The request automatically includes your auth cookie. Our server checks the cookie, then calls the external weather API (e.g. Open-Meteo or a paid API). The response is sent back to the browser. The external API URL and any secrets never leave the server.
          </p>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Can this be used when we have an API key?
          </h3>
          <p className="mb-3">
            <strong>Yes.</strong> This pattern is the right one when you have an API key or other secrets. The key is stored and used only in the API route file (e.g. <code className="bg-gray-100 px-1 rounded">pages/api/weatherprivate.js</code>). The browser only talks to your API; your API adds the key when calling the third-party service, so the key is never exposed to the client.
          </p>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Loading behavior (same as Public Weather)
          </h3>
          <p className="mb-3">
            In <strong>behavior</strong>, this page and the Public Weather example work the same: the page loads first (layout and text appear), then the browser fetches data. While fetching, we show &quot;Loading weather data...&quot; so the user knows data is on the way. When the response arrives, we show the chart. So: page → loading state → data. The difference is only <em>where</em> the request goes (our API here, external API on the Public page), not the loading experience.
          </p>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            How this differs from Public Weather
          </h3>
          <p>
            <strong>This page:</strong> the browser calls <strong>our</strong> API route; our server calls the external API (with optional API key and auth). <strong>Public Weather:</strong> the browser calls the external API <strong>directly</strong>—no backend. Use this (Private) pattern when you need to hide an API key or require login for the data. Use the Public pattern only for APIs that need no secrets and are safe to call from the client.
          </p>
        </div>
        <div>
          <h3 className="text-xl mb-2">Weather (from private API)</h3>
          {loading ? (
            <p className="text-center text-gray-500">Loading weather data...</p>
          ) : (
            <SimpleChart data={weatherData} />
          )}
        </div>
      </div>
    </Layout>
  );
}

// ✅ Page protected via SSR authentication
export const getServerSideProps = withAuthPage(
  async (_context, user) => {
    return { props: { user } };
  },
  ["USER"]
);
