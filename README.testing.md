# Testing Guide

## Setup

This project uses **Vitest** - a fast testing framework optimized for Vite projects.

### Installed packages:

- `vitest` - testing framework (Jest-compatible API)
- `@vitest/ui` - web UI for test visualization
- `@testing-library/react` - utilities for testing React components
- `@testing-library/jest-dom` - additional DOM matchers
- `@testing-library/user-event` - user event simulation
- `jsdom` - DOM environment for tests

## Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (automatically re-run on changes)
npm run test:watch

# Open web UI for tests
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

Tests are placed alongside code in `__tests__` folders:

```
src/
  components/
    MyComponent/
      __tests__/
        MyComponent.test.tsx
  utils/
    helpers/
      __tests__/
        helpers.test.ts
```

## Examples

### Testing Hooks

```typescript
import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useVersionHistory } from "../useVersionHistory";

describe("useVersionHistory", () => {
  it("should save a version", () => {
    const { result } = renderHook(() => useVersionHistory("test-id"));

    act(() => {
      result.current.saveVersion(mockChallenge, false);
    });

    expect(result.current.versions).toHaveLength(1);
  });
});
```

### Testing Utilities

```typescript
import { describe, it, expect } from "vitest";
import { validateFlowchart } from "../flowchartValidation";

describe("flowchartValidation", () => {
  it("should validate a valid flowchart", () => {
    const challenge = createMockChallenge();
    const result = validateFlowchart(challenge);

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
```

### Testing React Components

```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MyComponent } from "../MyComponent";

describe("MyComponent", () => {
  it("should render button and handle click", () => {
    const handleClick = vi.fn();
    render(<MyComponent onClick={handleClick} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Configuration

Configuration is located in `vitest.config.ts`:

- **environment**: `jsdom` - for testing React components
- **globals**: `true` - describe/it/expect available globally
- **setupFiles**: `src/setupTests.ts` - setup before tests
- **coverage**: V8 provider for faster coverage

## Mocks

### Global mocks (setupTests.ts)

```typescript
import { vi } from "vitest";

// window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
});

// crypto.randomUUID
Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: () => Math.random().toString(36).substring(2, 15),
  },
});
```

### Adding new mocks

Add mocks to `src/setupTests.ts` for global objects or create separate mock files:

```typescript
// src/__mocks__/supabase.ts
import { vi } from "vitest";

export const supabase = {
  from: vi.fn(() => ({
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
  })),
};
```

## Coverage

After running `npm run test:coverage`, the report will be available at:

- `coverage/index.html` - HTML report
- Terminal - text report

## Best Practices

1. **Isolate tests** - each test should be independent
2. **Use describe/it** - group similar tests
3. **Clear mocks** - `vi.clearAllMocks()` in `beforeEach`
4. **Test behavior, not implementation** - verify results
5. **Use semantic queries** - `getByRole`, `getByLabelText`
6. **Watch mode** - use `npm run test:watch` during development

## Current Status

### Hooks
✅ **useVersionHistory** - 8/8 tests passing
✅ **useFlowchartEdges** - 14/14 tests passing
✅ **useFlowchartValidation** - 13/13 tests passing
✅ **useChallengeBuilder** - 13/13 tests passing

### Validation
✅ **flowchartValidation** - 8/8 tests passing
✅ **validationUtils** - 41/41 tests passing

### Utilities
✅ **helpers** - 14/14 tests passing

### Export/Import
✅ **challengeExport** - 20/20 tests passing
✅ **challengeImport** - 20/20 tests passing

**Total: 151/151 tests ✅**

## What's Next?

1. ✅ Vitest configured
2. ✅ Tests for hooks working
3. ✅ Tests for validation working
4. ✅ Tests for utility functions working
5. ✅ Tests for export/import utilities working
6. 📝 Add tests for React components
7. 📝 Add integration tests
8. 📝 Set up CI/CD for automatic test runs

## Useful Commands

```bash
# Run only one test file
npm test useVersionHistory

# Run tests with a specific pattern
npm test -- --grep "should save"

# Update snapshots
npm test -- -u

# Show detailed output
npm test -- --reporter=verbose
```

## Quick Start

1. Create a new test file: `MyComponent.test.tsx`
2. Import necessary utilities:
   ```typescript
   import { describe, it, expect } from "vitest";
   ```
3. Write tests
4. Run: `npm run test:watch`

Vitest will automatically find and run your tests! 🚀
