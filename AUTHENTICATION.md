# Authentication Middleware Documentation

This application uses a reusable, scalable JWT authentication system with middleware functions.

## Overview

The authentication system is built around three core middleware functions in `lib/auth.js`:

1. **`verifyAuth(req)`** - Core JWT verification function
2. **`withAuth(handler)`** - Protects API routes
3. **`withAuthPage(getServerSidePropsFunc)`** - Protects pages

## Security Features

- ✅ JWT tokens with configurable expiration (1 hour default)
- ✅ HTTP-only cookies to prevent XSS attacks
- ✅ SameSite=Strict to prevent CSRF attacks
- ✅ Secure flag in production for HTTPS-only transmission
- ✅ Token verification on every protected request
- ✅ Automatic expiration checking
- ✅ Centralized authentication logic

## Usage

### Protecting Pages

Use `withAuthPage()` to protect any page that requires authentication:

```javascript
import { withAuthPage } from "../lib/auth";

export default function ProtectedPage({ user }) {
  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      <p>User ID: {user.id}</p>
    </div>
  );
}

// Simple protection - just verify authentication
export const getServerSideProps = withAuthPage();

// Or with custom logic
export const getServerSideProps = withAuthPage(async (context, user) => {
  // Your custom logic here
  // user is automatically verified and available
  const additionalData = await fetchSomeData(user.id);

  return {
    props: {
      additionalData,
    },
  };
});
```

### Protecting API Routes

Use `withAuth()` to protect API endpoints:

```javascript
import { withAuth } from "../../lib/auth";
import prisma from "../../lib/prisma";

async function handler(req, res) {
  // req.user is automatically available
  const userId = req.user.id;
  const username = req.user.username;

  // Your API logic here
  const data = await prisma.someModel.findMany({
    where: { userId },
  });

  return res.json(data);
}

// Wrap handler with authentication
export default withAuth(handler);
```

### Manual Verification

For custom use cases, use `verifyAuth()` directly:

```javascript
import { verifyAuth } from "../../lib/auth";

export default async function handler(req, res) {
  const user = verifyAuth(req);

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Your logic here
}
```

## Examples

### Example 1: Protected Dashboard

```javascript
// pages/dashboard.js
import { withAuthPage } from "../lib/auth";

export default function Dashboard({ user }) {
  return <div>Welcome {user.username}</div>;
}

export const getServerSideProps = withAuthPage();
```

### Example 2: Protected API with Database Access

```javascript
// pages/api/user/profile.js
import { withAuth } from "../../../lib/auth";
import prisma from "../../../lib/prisma";

async function handler(req, res) {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  return res.json(user);
}

export default withAuth(handler);
```

### Example 3: Admin-Only Route

```javascript
// pages/api/admin/users.js
import { withAuth } from "../../../lib/auth";
import prisma from "../../../lib/prisma";

async function handler(req, res) {
  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!user.isAdmin) {
    return res.status(403).json({ error: "Forbidden" });
  }

  // Admin logic here
  const allUsers = await prisma.user.findMany();
  return res.json(allUsers);
}

export default withAuth(handler);
```

## Authentication Flow

1. **Registration** (`POST /api/register`)

   - User provides username and password
   - Password is hashed with argon2
   - User is created in database

2. **Login** (`POST /api/login`)

   - User provides credentials
   - Password is verified with argon2
   - JWT token is generated with user data
   - Token is set as HTTP-only cookie

3. **Protected Access**

   - Middleware extracts token from cookie
   - Token is verified with JWT secret
   - Expiration is checked
   - User data is made available to handler

4. **Logout** (`POST /api/logout`)
   - Cookie is cleared with Max-Age=0

## Configuration

Environment variables in `.env`:

```env
JWT_SECRET=your-secret-key-change-in-production
DATABASE_URL=file:./app.db
```

## Security Best Practices

1. **Always use HTTPS in production** - Set `Secure` cookie flag
2. **Use a strong JWT_SECRET** - Store in secrets manager
3. **Implement rate limiting** - Prevent brute force attacks
4. **Add CSRF protection** - For state-changing requests
5. **Monitor failed attempts** - Implement account lockout
6. **Rotate secrets regularly** - Update JWT_SECRET periodically
7. **Log authentication events** - For security auditing

## Migration from Old Code

### Old (Unsafe):

```javascript
export async function getServerSideProps({ req }) {
  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies["dashx-token"];
  if (!token) {
    return { redirect: { destination: "/login", permanent: false } };
  }
  try {
    const [, payloadB64] = token.split(".");
    const payload = JSON.parse(Buffer.from(payloadB64, "base64").toString());
    return { props: { user: { username: payload.username } } };
  } catch (e) {
    return { redirect: { destination: "/login", permanent: false } };
  }
}
```

### New (Secure):

```javascript
import { withAuthPage } from "../lib/auth";

export const getServerSideProps = withAuthPage();
```

## Benefits

- ✅ **Reusable** - One implementation, use everywhere
- ✅ **Scalable** - Easy to add new protected routes
- ✅ **Maintainable** - Single source of truth for auth logic
- ✅ **Secure** - Proper JWT verification and validation
- ✅ **Type-safe** - Clear user object structure
- ✅ **Testable** - Centralized logic is easier to test
