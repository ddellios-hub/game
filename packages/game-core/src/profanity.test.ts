import { describe, expect, it } from "vitest";
import { sanitizeMessage } from "./profanity";

describe("sanitizeMessage", () => {
  it("redacts profane words", () => {
    const result = sanitizeMessage("you are dumb");
    expect(result.cleanText).toContain("***");
    expect(result.flagged.clean).toBe(false);
  });
});
