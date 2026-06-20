import "@testing-library/jest-dom";

Object.defineProperty(window.HTMLMediaElement.prototype, "play", {
  writable: true,
  value: vi.fn().mockResolvedValue(undefined),
});
Object.defineProperty(window.HTMLMediaElement.prototype, "pause", {
  writable: true,
  value: vi.fn(),
});
Object.defineProperty(window.HTMLMediaElement.prototype, "load", {
  writable: true,
  value: vi.fn(),
});