import { test, expect } from "@playwright/test";

test.describe("search", () => {
  test("overlay suggests categories and popular terms", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open search" }).click();
    await expect(page.getByText("Suggested categories")).toBeVisible();
    await expect(page.getByText("Popular searches")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByText("Suggested categories")).toBeHidden();
  });

  test("typing shows live results and navigates", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open search" }).click();
    await page.getByLabel("Search products").fill("denim");
    await expect(page.getByText(/^\d+ result/)).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/search\?q=denim/);
    await expect(page.getByRole("heading", { name: /Results for/ })).toBeVisible();
  });

  test("no-results state", async ({ page }) => {
    await page.goto("/search?q=zzzqwerty");
    await expect(page.getByText(/No products match/)).toBeVisible();
  });

  test("empty query shows prompt", async ({ page }) => {
    await page.goto("/search");
    await expect(page.getByText(/Type a search term/)).toBeVisible();
  });
});
