# Testing Documentation

This document provides comprehensive information about testing in the DashboardXIQC project.

## Overview

The project uses **Jest** and **React Testing Library** for unit and integration testing.

### Testing Stack

- **Jest** - JavaScript testing framework
- **React Testing Library** - Testing utilities for React components
- **@testing-library/jest-dom** - Custom matchers for DOM assertions
- **@testing-library/user-event** - Simulate user interactions

## Running Tests

### All Tests

```bash
npm test
```

### Watch Mode (for development)

```bash
npm run test:watch
```

### Coverage Report

```bash
npm run test:coverage
```

This generates a coverage report in the `coverage/` directory.

## Test Structure

Tests are organized using two patterns:

1. **Co-located tests**: `__tests__` folder next to the code being tested
2. **Test files**: `.test.js` or `.spec.js` files

```
lib/
├── auth.js
└── __tests__/
    └── auth.test.js
```

## Current Test Coverage

### ✅ Authentication Middleware Tests (`lib/__tests__/auth.test.js`)

Comprehensive tests for the authentication system:

#### `verifyAuth()` Function

- ✅ Returns null if no cookie is present
- ✅ Returns null if token is missing
- ✅ Returns user object for valid token
- ✅ Returns null for invalid token signature
- ✅ Returns null for expired token
- ✅ Returns null for malformed token

#### `withAuth()` Middleware

- ✅ Calls handler with user attached to req for valid token
- ✅ Returns 401 for missing token
- ✅ Returns 401 for invalid token

#### `withAuthPage()` Middleware

- ✅ Redirects to /login if no token
- ✅ Returns user props for valid token
- ✅ Calls custom getServerSideProps and merges user
- ✅ Redirects to /login for expired token

**Total: 13 test cases covering authentication middleware**

## Writing Tests

### Example: Testing a Function

```javascript
import { myFunction } from "../myModule";

describe("myFunction", () => {
  it("should return expected value", () => {
    const result = myFunction("input");
    expect(result).toBe("expected");
  });

  it("should handle edge cases", () => {
    expect(myFunction(null)).toBe(null);
    expect(myFunction("")).toBe("");
  });
});
```

### Example: Testing API Routes

```javascript
import handler from "../pages/api/myroute";

describe("/api/myroute", () => {
  it("should return 200 for valid request", async () => {
    const mockReq = {
      method: "POST",
      body: { data: "test" },
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    await handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
  });
});
```

### Example: Testing React Components

```javascript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MyComponent from "../components/MyComponent";

describe("MyComponent", () => {
  it("should render correctly", () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("should handle click events", async () => {
    const handleClick = jest.fn();
    render(<MyComponent onClick={handleClick} />);

    await userEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

## Testing Best Practices

### 1. Test Behavior, Not Implementation

❌ Bad:

```javascript
it("should call setState with new value", () => {
  // Testing implementation details
});
```

✅ Good:

```javascript
it("should display updated value when button is clicked", () => {
  // Testing user-visible behavior
});
```

### 2. Use Descriptive Test Names

```javascript
// Describe what the test does in plain English
it("should redirect to login page when user is not authenticated", () => {
  // Test code
});
```

### 3. Arrange-Act-Assert Pattern

```javascript
it("should validate email format", () => {
  // Arrange
  const email = "invalid-email";

  // Act
  const result = validateEmail(email);

  // Assert
  expect(result).toBe(false);
});
```

### 4. Keep Tests Independent

Each test should be able to run independently without relying on other tests.

```javascript
describe("User Authentication", () => {
  beforeEach(() => {
    // Reset state before each test
    resetDatabase();
  });

  it("test 1", () => {
    // This test doesn't depend on test 2
  });

  it("test 2", () => {
    // This test doesn't depend on test 1
  });
});
```

### 5. Mock External Dependencies

```javascript
// Mock Prisma client
jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn(() => ({
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  })),
}));
```

## Testing Environment

### Environment Variables

Test environment variables are set in `jest.setup.js`:

```javascript
process.env.JWT_SECRET = "test-secret-key-for-testing";
process.env.DATABASE_URL = "file:./test.db";
```

### Mocking

Jest provides powerful mocking capabilities:

```javascript
// Mock a module
jest.mock("../lib/myModule");

// Mock a function
const mockFn = jest.fn();
mockFn.mockReturnValue("value");
mockFn.mockResolvedValue(Promise.resolve("value"));

// Mock implementation
mockFn.mockImplementation((arg) => {
  return arg * 2;
});
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm test
      - run: npm run test:coverage
```

## Coverage Goals

Target coverage metrics:

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

View coverage report:

```bash
npm run test:coverage
# Open coverage/lcov-report/index.html in browser
```

## Common Testing Patterns

### Testing Async Functions

```javascript
it("should fetch user data", async () => {
  const data = await fetchUser(1);
  expect(data).toEqual({ id: 1, name: "Test" });
});
```

### Testing Errors

```javascript
it("should throw error for invalid input", () => {
  expect(() => {
    validateInput(null);
  }).toThrow("Input is required");
});
```

### Testing with Timers

```javascript
it("should debounce function calls", () => {
  jest.useFakeTimers();

  const fn = jest.fn();
  const debouncedFn = debounce(fn, 1000);

  debouncedFn();
  debouncedFn();
  debouncedFn();

  expect(fn).not.toHaveBeenCalled();

  jest.runAllTimers();
  expect(fn).toHaveBeenCalledTimes(1);

  jest.useRealTimers();
});
```

## Debugging Tests

### Run Specific Test

```bash
npm test -- auth.test.js
```

### Run Tests Matching Pattern

```bash
npm test -- --testNamePattern="should return user"
```

### Debug in VS Code

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

## Troubleshooting

### Tests Failing After Dependency Update

```bash
# Clear Jest cache
npx jest --clearCache

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Module Not Found Errors

Check `moduleNameMapper` in `jest.config.js` for correct path aliases.

### Timeout Errors

Increase timeout for slow tests:

```javascript
it("slow test", async () => {
  // Test code
}, 10000); // 10 second timeout
```

## Next Steps

### Planned Test Coverage

- [ ] API route tests (login, register, logout)
- [ ] Component tests (Layout, SimpleChart)
- [ ] Page tests (dashboard, login, register)
- [ ] Integration tests (full auth flow)
- [ ] E2E tests (optional)

### Adding New Tests

1. Create test file in `__tests__` directory
2. Import module to test
3. Write test cases
4. Run tests: `npm test`
5. Check coverage: `npm run test:coverage`

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Jest Cheat Sheet](https://github.com/sapegin/jest-cheat-sheet)

## Contributing

When adding new features:

1. Write tests first (TDD approach recommended)
2. Ensure tests pass: `npm test`
3. Maintain coverage above 80%: `npm run test:coverage`
4. Update this document if adding new testing patterns
