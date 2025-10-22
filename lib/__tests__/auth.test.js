import jwt from "jsonwebtoken";
import { verifyAuth, withAuth, withAuthPage } from "../auth";

describe("Authentication Middleware", () => {
  const mockUser = {
    id: 1,
    username: "testuser",
  };

  const createMockToken = (payload, secret = "test-secret-key-for-testing") => {
    return jwt.sign(payload, secret, { expiresIn: "1h" });
  };

  describe("verifyAuth", () => {
    it("should return null if no cookie is present", () => {
      const mockReq = {
        headers: {
          cookie: "",
        },
      };

      const result = verifyAuth(mockReq);
      expect(result).toBeNull();
    });

    it("should return null if token is missing", () => {
      const mockReq = {
        headers: {
          cookie: "other-cookie=value",
        },
      };

      const result = verifyAuth(mockReq);
      expect(result).toBeNull();
    });

    it("should return user object for valid token", () => {
      const token = createMockToken({
        sub: mockUser.id,
        username: mockUser.username,
      });

      const mockReq = {
        headers: {
          cookie: `dashx-token=${token}`,
        },
      };

      const result = verifyAuth(mockReq);
      expect(result).toEqual({
        id: mockUser.id,
        username: mockUser.username,
      });
    });

    it("should return null for invalid token signature", () => {
      const token = createMockToken(
        { sub: mockUser.id, username: mockUser.username },
        "wrong-secret"
      );

      const mockReq = {
        headers: {
          cookie: `dashx-token=${token}`,
        },
      };

      const result = verifyAuth(mockReq);
      expect(result).toBeNull();
    });

    it("should return null for expired token", () => {
      const token = jwt.sign(
        { sub: mockUser.id, username: mockUser.username },
        "test-secret-key-for-testing",
        { expiresIn: "-1h" } // Expired 1 hour ago
      );

      const mockReq = {
        headers: {
          cookie: `dashx-token=${token}`,
        },
      };

      const result = verifyAuth(mockReq);
      expect(result).toBeNull();
    });

    it("should return null for malformed token", () => {
      const mockReq = {
        headers: {
          cookie: "dashx-token=not.a.valid.token",
        },
      };

      const result = verifyAuth(mockReq);
      expect(result).toBeNull();
    });
  });

  describe("withAuth", () => {
    it("should call handler with user attached to req for valid token", async () => {
      const token = createMockToken({
        sub: mockUser.id,
        username: mockUser.username,
      });

      const mockReq = {
        headers: {
          cookie: `dashx-token=${token}`,
        },
      };

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      const mockHandler = jest.fn().mockResolvedValue({ success: true });

      const protectedHandler = withAuth(mockHandler);
      await protectedHandler(mockReq, mockRes);

      expect(mockHandler).toHaveBeenCalledWith(mockReq, mockRes);
      expect(mockReq.user).toEqual({
        id: mockUser.id,
        username: mockUser.username,
      });
    });

    it("should return 401 for missing token", async () => {
      const mockReq = {
        headers: {
          cookie: "",
        },
      };

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      const mockHandler = jest.fn();
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
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      const mockHandler = jest.fn();
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
      const token = createMockToken({
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
          },
        },
      });
    });

    it("should call custom getServerSideProps and merge user", async () => {
      const token = createMockToken({
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

      const customGetServerSideProps = jest.fn().mockResolvedValue({
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
        })
      );

      expect(result).toEqual({
        props: {
          customData: "test",
          user: {
            id: mockUser.id,
            username: mockUser.username,
          },
        },
      });
    });

    it("should redirect to /login for expired token", async () => {
      const token = jwt.sign(
        { sub: mockUser.id, username: mockUser.username },
        "test-secret-key-for-testing",
        { expiresIn: "-1h" }
      );

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
