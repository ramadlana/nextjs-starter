import { describe, it, expect, vi } from "vitest";
import { SignJWT } from "jose";
import { verifyAuth, withAuth, withAuthPage } from "../auth";

describe("Authentication Middleware", () => {
  const mockUser = {
    id: 1,
    username: "testuser",
  };

  const createMockToken = async (payload, secret = "test-secret-key-for-testing") => {
    const encodedSecret = new TextEncoder().encode(secret);
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(encodedSecret);
  };

  describe("verifyAuth", () => {
    it("should return null if no cookie is present", async () => {
      const mockReq = {
        headers: {
          cookie: "",
        },
      };

      const result = await verifyAuth(mockReq);
      expect(result).toBeNull();
    });

    it("should return null if token is missing", async () => {
      const mockReq = {
        headers: {
          cookie: "other-cookie=value",
        },
      };

      const result = await verifyAuth(mockReq);
      expect(result).toBeNull();
    });

    it("should return user object for valid token", async () => {
      const token = await createMockToken({
        sub: mockUser.id,
        username: mockUser.username,
      });

      const mockReq = {
        headers: {
          cookie: `dashx-token=${token}`,
        },
      };

      const result = await verifyAuth(mockReq);
      expect(result).toEqual({
        id: mockUser.id,
        username: mockUser.username,
        role: "USER",
      });
    });

    it("should return null for invalid token signature", async () => {
      const token = await createMockToken(
        { sub: mockUser.id, username: mockUser.username },
        "wrong-secret"
      );

      const mockReq = {
        headers: {
          cookie: `dashx-token=${token}`,
        },
      };

      const result = await verifyAuth(mockReq);
      expect(result).toBeNull();
    });

    it("should return null for expired token", async () => {
      const encodedSecret = new TextEncoder().encode("test-secret-key-for-testing");
      const token = await new SignJWT({
        sub: mockUser.id,
        username: mockUser.username,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("-1h") // Expired 1 hour ago
        .sign(encodedSecret);

      const mockReq = {
        headers: {
          cookie: `dashx-token=${token}`,
        },
      };

      const result = await verifyAuth(mockReq);
      expect(result).toBeNull();
    });

    it("should return null for malformed token", async () => {
      const mockReq = {
        headers: {
          cookie: "dashx-token=not.a.valid.token",
        },
      };

      const result = await verifyAuth(mockReq);
      expect(result).toBeNull();
    });
  });

  describe("withAuth", () => {
    it("should call handler with user attached to req for valid token", async () => {
      const token = await createMockToken({
        sub: mockUser.id,
        username: mockUser.username,
      });

      const mockReq = {
        headers: {
          cookie: `dashx-token=${token}`,
        },
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
      };

      const mockHandler = vi.fn().mockResolvedValue({ success: true });

      const protectedHandler = withAuth(mockHandler);
      await protectedHandler(mockReq, mockRes);

      expect(mockHandler).toHaveBeenCalledWith(mockReq, mockRes);
      expect(mockReq.user).toEqual({
        id: mockUser.id,
        username: mockUser.username,
        role: "USER",
      });
    });

    it("should return 401 for missing token", async () => {
      const mockReq = {
        headers: {
          cookie: "",
        },
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
      };

      const mockHandler = vi.fn();
      const protectedHandler = withAuth(mockHandler);
      await protectedHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Unauthorized" });
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it("should return 401 for invalid token", async () => {
      const mockReq = {
        headers: {
          cookie: "dashx-token=invalid.token.here",
        },
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
      };

      const mockHandler = vi.fn();
      const protectedHandler = withAuth(mockHandler);
      await protectedHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Unauthorized" });
      expect(mockHandler).not.toHaveBeenCalled();
    });
  });

  describe("withAuthPage", () => {
    it("should redirect to /login if no token", async () => {
      const mockContext = {
        req: {
          headers: {
            cookie: "",
          },
        },
      };

      const result = await withAuthPage()(mockContext);

      expect(result).toEqual({
        redirect: {
          destination: "/login",
          permanent: false,
        },
      });
    });

    it("should return user props for valid token", async () => {
      const token = await createMockToken({
        sub: mockUser.id,
        username: mockUser.username,
      });

      const mockContext = {
        req: {
          headers: {
            cookie: `dashx-token=${token}`,
          },
        },
      };

      const result = await withAuthPage()(mockContext);

      expect(result).toEqual({
        props: {
          user: {
            id: mockUser.id,
            username: mockUser.username,
            role: "USER",
          },
        },
      });
    });

    it("should call custom getServerSideProps and merge user", async () => {
      const token = await createMockToken({
        sub: mockUser.id,
        username: mockUser.username,
      });

      const mockContext = {
        req: {
          headers: {
            cookie: `dashx-token=${token}`,
          },
        },
      };

      const customGetServerSideProps = vi.fn().mockResolvedValue({
        props: {
          customData: "test",
        },
      });

      const result = await withAuthPage(customGetServerSideProps)(mockContext);

      expect(customGetServerSideProps).toHaveBeenCalledWith(
        mockContext,
        expect.objectContaining({
          id: mockUser.id,
          username: mockUser.username,
          role: "USER",
        })
      );

      expect(result).toEqual({
        props: {
          customData: "test",
          user: {
            id: mockUser.id,
            username: mockUser.username,
            role: "USER",
          },
        },
      });
    });

    it("should redirect to /login for expired token", async () => {
      const encodedSecret = new TextEncoder().encode("test-secret-key-for-testing");
      const token = await new SignJWT({
        sub: mockUser.id,
        username: mockUser.username,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("-1h")
        .sign(encodedSecret);

      const mockContext = {
        req: {
          headers: {
            cookie: `dashx-token=${token}`,
          },
        },
      };

      const result = await withAuthPage()(mockContext);

      expect(result).toEqual({
        redirect: {
          destination: "/login",
          permanent: false,
        },
      });
    });
  });
});
