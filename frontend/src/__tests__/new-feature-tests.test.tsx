import { describe, it, expect } from "vitest";
import { formatDate, formatDuration } from "@/lib/utils";

describe("formatDate guard cases", () => {
  it("returns dash for empty string", () => {
    expect(formatDate("")).toBe("—");
  });
  it("returns dash for invalid date", () => {
    expect(formatDate("not-a-date")).toBe("—");
  });
  it("returns dash for string null", () => {
    expect(formatDate("null")).toBe("—");
  });
  it("formats valid ISO returns non-dash", () => {
    expect(formatDate("2026-05-18T10:00:00Z")).not.toBe("—");
  });
  it("formats date-only string", () => {
    expect(formatDate("2026-01-15")).not.toBe("—");
  });
});

describe("formatDuration", () => {
  it("0:00 for 0s", () => {
    expect(formatDuration(0)).toBe("0:00");
  });
  it("1:00 for 60s", () => {
    expect(formatDuration(60)).toBe("1:00");
  });
  it("1:30 for 90s", () => {
    expect(formatDuration(90)).toBe("1:30");
  });
  it("1:05 for 65s (pads seconds)", () => {
    expect(formatDuration(65)).toBe("1:05");
  });
  it("61:01 for 3661s", () => {
    expect(formatDuration(3661)).toBe("61:01");
  });
});
