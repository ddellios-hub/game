import { describe, expect, it } from "vitest";
import { getDictionary } from "@sandbox/game-core";

describe("i18n integration", () => {
  it("returns greek strings", () => {
    const dict = getDictionary("el");
    expect(dict.lobby).toBe("Λόμπι");
  });
});
