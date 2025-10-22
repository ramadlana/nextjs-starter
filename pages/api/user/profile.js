import { withAuth } from "../../../lib/auth";
import prisma from "../../../lib/prisma";

/**
 * Protected API route example
 * GET /api/user/profile - Get current user's profile
 */
async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // req.user is automatically populated by withAuth middleware
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Wrap the handler with authentication middleware
export default withAuth(handler);
