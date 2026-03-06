// /pages/api/weather.js
import { withAuth } from "../../lib/auth";

async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const user = req.user;
  const latNum = parseFloat(req.query.lat, 10);
  const lonNum = parseFloat(req.query.lon, 10);
  const lat = Number.isFinite(latNum) && latNum >= -90 && latNum <= 90
    ? latNum
    : -6.2;
  const lon = Number.isFinite(lonNum) && lonNum >= -180 && lonNum <= 180
    ? lonNum
    : 106.8;
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`API Error: ${response.status}`);

    const data = await response.json();
    if (!data.hourly || !data.hourly.time) {
      return res.status(500).json({ error: "Invalid API response" });
    }

    const hours = data.hourly.time.slice(0, 5);
    const temps = data.hourly.temperature_2m.slice(0, 5);

    return res.status(200).json({
      user: user.username,
      labels: hours.map((h) => h.split("T")[1]),
      values: temps,
    });
  } catch (error) {
    console.error("Weather API Error:", error);
    return res.status(500).json({ error: "Failed to fetch weather data" });
  }
}

export default withAuth(handler);
