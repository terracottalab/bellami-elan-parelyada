import { describe, expect, test } from "bun:test";
import { analyticsAllowed } from "./analytics";

describe("explicit analytics consent", () => {
  test("no tracking before Accept", () => {
    expect(analyticsAllowed(null, 123456)).toBe(false);
  });
  test("Decline never enables tracking", () => {
    expect(analyticsAllowed("declined", 123456)).toBe(false);
  });
  test("Accept enables a configured counter", () => {
    expect(analyticsAllowed("accepted", 123456)).toBe(true);
  });
  test("no counter means no tracking even after Accept", () => {
    expect(analyticsAllowed("accepted", null)).toBe(false);
  });
});