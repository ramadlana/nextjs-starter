import { jwtVerify, SignJWT } from "jose";

/**
 * Get JWT secret; in production, missing secret throws to avoid insecure fallback.
 * Returns value suitable for jose (TextEncoder-encoded).
 */
export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (process.env.NODE_ENV === "production" && !secret) {
    throw new Error("JWT_SECRET must be set in production");
  }
  return new TextEncoder().encode(secret || "dev-secret");
}

/**
 * Parse cookies from request header
 */
function parseCookies(cookieHeader) {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split(';').map(cookie => {
      const [key, ...value] = cookie.trim().split('=');
      return [key, value.join('=')];
    })
  );
}

/**
 * Verify JWT token from cookie or header
 */
export async function verifyAuth(req) {
  try {
    let token;
    const cookies = parseCookies(req.headers.cookie);

    if (cookies["dashx-token"]) {
      token = cookies["dashx-token"];
    } else if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return null;

    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret);

    return {
      id: payload.sub,
      username: payload.username,
      role: payload.role || "USER",
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
    const user = await verifyAuth(req);
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
    const user = await verifyAuth(context.req);

    if (!user) {
      return { redirect: { destination: "/login", permanent: false } };
    }

    if (allowedRoles.length && !allowedRoles.includes(user.role)) {
      return { redirect: { destination: "/restricted", permanent: false } };
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
