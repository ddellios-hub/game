import { test, expect } from "@playwright/test";

test.describe("Happy path", () => {
  test("login, create room, play obby, chat, report", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /login/i }).click();
    await page.getByLabel(/email/i).fill("player@example.com");
    await page.getByLabel(/password/i).fill("password123");
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page.getByRole("heading", { name: /lobby/i })).toBeVisible();

    await page.getByRole("button", { name: /create room/i }).click();

    await page.getByRole("button", { name: /quick play/i }).click();
    await expect(page.getByTestId("obby-canvas")).toBeVisible();

    await page.getByPlaceholder(/message/i).fill("hello team");
    await page.getByRole("button", { name: /send/i }).click();

    await page.getByRole("button", { name: /report/i }).click();
    await page.getByLabel(/reason/i).fill("griefing");
    await page.getByRole("button", { name: /submit report/i }).click();

    await expect(page.getByText(/report submitted/i)).toBeVisible();
  });
});
