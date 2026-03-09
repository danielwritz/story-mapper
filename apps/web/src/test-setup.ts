import '@testing-library/jest-dom/vitest';

class ResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

// @ts-expect-error jsdom does not implement ResizeObserver
global.ResizeObserver = ResizeObserver;
