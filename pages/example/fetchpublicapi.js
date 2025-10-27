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

  // Fetch weather data client-side
  useEffect(() => {
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
        setLoading(false);
      }
    }

    fetchWeather();
  }, []);

  return (
    <Layout user={user}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl">Welcome, {user?.username}</h2>
        <form method="POST" action="/api/logout">
          <button className="px-3 py-1 border rounded">Sign out</button>
        </form>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-xl mb-2">Weekly Stats</h3>
        <SimpleChart data={baseData} />
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-xl mb-2">Weather Forecast (Hourly °C)</h3>

        {loading && (
          <p className="text-gray-500 italic">Loading weather data...</p>
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
