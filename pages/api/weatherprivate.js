import { withAuth } from "../../lib/auth";

async function handler(req, res) {
  // User is already verified by withAuth()
  const user = req.user;

  // Example: fetch data from public weather API
  const lat = "-6.2"; // Jakarta
  const lon = "106.8";
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    // Simplify chart data
    const hours = data.hourly.time.slice(0, 5);
    const temps = data.hourly.temperature_2m.slice(0, 5);

    return res.status(200).json({
      user: user.username,
      labels: hours.map((h) => h.split("T")[1]), // get time part
      values: temps,
    });
  } catch (error) {
    console.error("Weather API Error:", error);
    return res.status(500).json({ error: "Failed to fetch weather data" });
  }
}

// ✅ Protect the API route with JWT auth
export default withAuth(handler);
