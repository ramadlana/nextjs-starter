// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Mock environment variables for tests
process.env.JWT_SECRET = "test-secret-key-for-testing";
process.env.DATABASE_URL = "file:./test.db";
