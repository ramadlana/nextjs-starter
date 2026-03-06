export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const cookieParts = [
    "dashx-token=deleted",
    "Path=/",
    "Max-Age=0",
    "HttpOnly",
    "SameSite=Strict",
  ];
  if (process.env.NODE_ENV === "production") cookieParts.push("Secure");
  res.setHeader("Set-Cookie", cookieParts.join("; "));

  // Respond with success, let client handle redirect
  return res.status(200).json({ success: true });
}
