# Testing Guide for hey-isaac-ai

## Overview

This project uses [Vitest](https://vitest.dev/) for unit and integration testing. Tests are located in the `test/` directory and follow a simple naming convention: `<module>.test.ts`.

## Running Tests

### Run all tests once
```bash
npm test
```

### Run tests in watch mode (re-run on file changes)
```bash
npm run test:watch
```

### Generate coverage report
```bash
npm run coverage
```
Coverage reports are generated in HTML, JSON, and text formats.

## Test Structure

### Pure Function Tests
Located in test files that test isolated utility functions and helpers:
- `test/rate-limit.test.ts` — Tests for rate limiting IP extraction logic
- `test/auth.test.ts` — Tests for OBO (On-Behalf-Of) identity extraction

These tests use deterministic inputs and do not require external services.

### Route/Handler Tests
Located in integration test files:
- `test/routes.test.ts` — Tests for HTTP route handlers using `supertest`

These tests create an Express app in-memory without starting a network listener.

## Adding New Tests

1. Create a new file in `test/` directory: `test/<feature>.test.ts`
2. Use the Vitest API:
   ```typescript
   import { describe, it, expect } from 'vitest';

   describe('Feature Name', () => {
     it('should do something specific', () => {
       // Arrange
       const input = /* ... */;

       // Act
       const result = /* call function */;

       // Assert
       expect(result).toBe(/* expected value */);
     });
   });
   ```

3. For route testing, use `supertest` to create isolated Express apps:
   ```typescript
   import request from 'supertest';
   import { createYourApp } from '../server/_internal/testables';

   describe('Your Route', () => {
     it('should respond correctly', async () => {
       const app = createYourApp();
       const res = await request(app).get('/endpoint');
       expect(res.status).toBe(200);
     });
   });
   ```

## Guidelines

- **No external services**: Tests must not call databases, APIs, or any external services. Use dependency injection or create testable adapters in `server/_internal/testables.ts`.
- **Fast execution**: Tests should complete in under 2 seconds total on a typical development laptop.
- **Deterministic**: Tests must not depend on time, random values, or external state.
- **Isolated**: Each test should be independent and not rely on other tests passing first.
- **Clear names**: Use descriptive test names that explain what is being tested and what the expected behavior is.

## Testable Adapters

When existing code is not easily testable (e.g., tightly coupled to Express/AppKit), create a small internal adapter in `server/_internal/testables.ts` that re-exports or wraps the logic for testing purposes. This avoids modifying production code.

Example:
```typescript
// server/_internal/testables.ts
export function createHealthCheckApp() {
  const app = express();
  // ... simplified route handlers
  return app;
}
```

## Continuous Integration

Tests are expected to pass locally before committing. CI will run `npm test` to verify.

## CI Readiness Checklist

- [ ] All tests pass locally with `npm test`
- [ ] Tests complete in <2s on a typical dev laptop
- [ ] No database or external service calls
- [ ] Coverage is appropriate for the code changes
- [ ] No flaky tests that depend on timing or randomness
