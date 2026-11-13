import { test, expect } from "@playwright/test";

test.describe("product listing", () => {
  test("shows products with count and sorts by price", async ({ page }) => {
    await page.goto("/women");
    await expect(page.getByText(/\d+ products/).first()).toBeVisible();
    const cards = page.locator("a[href^='/product/']").filter({ has: page.locator("h3") });
    await expect(cards.first()).toBeVisible();

    await page.getByLabel("Sort products").selectOption("price-asc");
    await expect(page).toHaveURL(/sort=price-asc/);
  });

  test("filtering by colour updates results and URL", async ({ page }) => {
    await page.goto("/women");
    test.skip((await page.viewportSize())!.width < 768, "sidebar is desktop-only (drawer covered separately)");
    const before = await page.locator("a[href^='/product/']").filter({ has: page.locator("h3") }).count();
    await page.getByRole("checkbox", { name: /black/i }).first().check();
    await expect(page).toHaveURL(/color=black/);
    const after = await page.locator("a[href^='/product/']").filter({ has: page.locator("h3") }).count();
    expect(after).toBeLessThanOrEqual(before);
  });

  test("mobile filter drawer works", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/women");
    await page.getByRole("button", { name: /Filters/ }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("checkbox", { name: /black/i }).first().check();
    await page.getByRole("button", { name: /Show \d+ products?/ }).click();
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(page).toHaveURL(/color=black/);
  });

  test("empty state appears when filters match nothing", async ({ page }) => {
    await page.goto("/men");
    test.skip((await page.viewportSize())!.width < 768, "sidebar is desktop-only");
    // choose a combination likely to be empty: size XXL on men products w/o XXL
    // safer: use price bin above ₹4,000 on kids (no kids product above threshold)
    await page.goto("/kids");
    await page.getByRole("radio", { name: "Above ₹4,000" }).check();
    await expect(page.getByText("No products match")).toBeVisible();
  });
});
