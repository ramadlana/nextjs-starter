import jwt from "jsonwebtoken";
import * as cookie from "cookie";

/**
 * Verify JWT token from cookie or header
 */
export function verifyAuth(req) {
  try {
    let token;
    const cookies = cookie.parse(req.headers.cookie || "");

    if (cookies["dashx-token"]) {
      token = cookies["dashx-token"];
    } else if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp <= now) return null;

    return {
      id: decoded.sub,
      username: decoded.username,
      role: decoded.role || "USER",
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("JWT verification failed:", error.message);
    }
    return null;
  }
}

// | Component             | Example            | Function                                      |
// | --------------------- | ------------------ | --------------------------------------------- |
// | API – General         | `/api/upload`      | `withAuth(handler)`                           |
// | API – Admin Only      | `/api/admin/stats` | `withRole(handler, ["ADMIN"])`                |
// | Page – Login required | `/dashboard`       | `withAuthPage(getServerSideProps)`            |
// | Page – Admin only     | `/admin`           | `withAuthPage(getServerSideProps, ["ADMIN"])` |

/**
 * Protect API routes
 */
export function withAuth(handler) {
  return async (req, res) => {
    const user = verifyAuth(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    req.user = user;
    return await handler(req, res);
  };
}

/**
 * Protect API routes with role-based access
 */
export function withRole(handler, allowedRoles = []) {
  return withAuth(async (req, res) => {
    if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    return await handler(req, res);
  });
}

/**
 * Protect SSR pages (getServerSideProps)
 */
export function withAuthPage(getServerSidePropsFunc, allowedRoles = []) {
  return async (context) => {
    const user = verifyAuth(context.req);

    if (!user) {
      return { redirect: { destination: "/login", permanent: false } };
    }

    if (allowedRoles.length && !allowedRoles.includes(user.role)) {
      return { redirect: { destination: "/", permanent: false } };
    }

    if (getServerSidePropsFunc) {
      const result = await getServerSidePropsFunc(context, user);
      if (result.props) {
        return { ...result, props: { ...result.props, user } };
      }
      return result;
    }

    return { props: { user } };
  };
}
