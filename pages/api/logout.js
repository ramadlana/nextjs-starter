export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  res.setHeader(
    "Set-Cookie",
    "dashx-token=deleted; Path=/; Max-Age=0; HttpOnly; SameSite=Strict"
  );

  // Respond with success, let client handle redirect
  return res.status(200).json({ success: true });
}
