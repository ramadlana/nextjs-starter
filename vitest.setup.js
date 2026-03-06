// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/vitest";
import { TextEncoder, TextDecoder } from "util";

// Polyfill TextEncoder/TextDecoder for jsdom environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock environment variables for tests
process.env.JWT_SECRET = "test-secret-key-for-testing";
// Use test DB URL from env or a placeholder (unit tests mock Prisma; for integration tests set DATABASE_URL)
process.env.DATABASE_URL =
  process.env.DATABASE_URL || "postgresql://test:test@localhost:5432/test";
