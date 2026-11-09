import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { analyticsAllowed } from "./analytics";

describe("explicit analytics consent", () => {
  test("no tracking before Accept", () => {
    assert.equal(analyticsAllowed(null, 123456), false);
  });
  test("Decline never enables tracking", () => {
    assert.equal(analyticsAllowed("declined", 123456), false);
  });
  test("Accept enables a configured counter", () => {
    assert.equal(analyticsAllowed("accepted", 123456), true);
  });
  test("no counter means no tracking even after Accept", () => {
    assert.equal(analyticsAllowed("accepted", null), false);
  });
});