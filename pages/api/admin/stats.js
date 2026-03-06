import { withRole } from "../../../lib/auth";
import prisma from "../../../lib/prisma";

/**
 * Admin-only API example.
 * GET /api/admin/stats — returns basic stats (admin role required).
 */
async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const totalUsers = await prisma.user.count();
    return res.json({
      totalUsers,
      message: "Admin stats (role-based API example)",
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return res.status(500).json({ error: "Failed to load stats" });
  }
}

export default withRole(handler, ["ADMIN"]);
