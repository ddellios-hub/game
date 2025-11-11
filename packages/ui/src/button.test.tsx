import { describe, expect, it } from "vitest";
import { buttonVariants } from "./internal";

// Quick test: expose variant generator via internal module to keep API minimal.

describe("buttonVariants", () => {
  it("applies defaults", () => {
    expect(buttonVariants()).toContain("inline-flex");
  });
});
