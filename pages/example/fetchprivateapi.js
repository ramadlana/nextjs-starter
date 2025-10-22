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
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl">
          Welcome to private weather, {user?.username}
        </h2>
        <form method="POST" action="/api/logout">
          <button className="px-3 py-1 border rounded">Sign out</button>
        </form>
      </div>

      <div className="bg-white p-4 rounded shadow">
        {loading ? (
          <p className="text-center text-gray-500">Loading weather data...</p>
        ) : (
          <SimpleChart data={weatherData} />
        )}
      </div>
    </Layout>
  );
}

// ✅ Page protected via SSR authentication
export const getServerSideProps = withAuthPage(null, ["USER"]);
