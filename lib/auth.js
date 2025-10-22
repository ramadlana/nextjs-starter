import jwt from "jsonwebtoken";
import cookie from "cookie";

/**
 * Middleware to verify JWT token from HTTP-only cookie
 * @param {Object} req - Request object
 * @returns {Object|null} - Decoded user payload or null if invalid
 */
export function verifyAuth(req) {
  try {
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies["dashx-token"];

    if (!token) {
      return null;
    }

    // Verify JWT with secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");

    // Check if token is expired
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      return null;
    }

    return {
      id: decoded.sub,
      username: decoded.username,
      role: decoded.role || "USER",
    };
  } catch (error) {
    // Invalid token or verification failed
    return null;
  }
}

/**
 * Higher-order function for protecting API routes
 * @param {Function} handler - The API route handler
 * @returns {Function} - Protected API route handler
 */
export function withAuth(handler) {
  return async (req, res) => {
    const user = verifyAuth(req);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Attach user to request object
    req.user = user;

    // Call the original handler
    return handler(req, res);
  };
}

/**
 * Higher-order function for protecting pages with getServerSideProps
 * @param {Function} getServerSidePropsFunc - Optional getServerSideProps function
 * @returns {Function} - Protected getServerSideProps function
 */
export function withRole(handler, allowedRoles = []) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return withAuth((req, res) => {
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    return handler(req, res);
  });
}

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
