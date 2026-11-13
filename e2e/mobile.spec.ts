import { test, expect } from "@playwright/test";

test.describe("mobile experience", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("hamburger opens category drawer", async ({ page }) => {
    await page.goto("/");
    test.skip((await page.viewportSize())!.width >= 768, "mobile-only control");
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("link", { name: "Women" })).toBeVisible();
    await page.getByRole("link", { name: "Women" }).click();
    await expect(page).toHaveURL(/\/women$/);
  });

  test("no horizontal overflow on key pages", async ({ page }) => {
    for (const path of ["/", "/women", "/product/relaxed-boxy-cotton-tee", "/cart"]) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${path} overflows horizontally`).toBeLessThanOrEqual(0);
    }
  });

  test("product card quick-add visible on touch", async ({ page }) => {
    await page.goto("/women");
    test.skip((await page.viewportSize())!.width >= 768, "touch-only behavior");
    const card = page.locator("a[href^='/product/']").filter({ has: page.locator("h3") }).first();
    await expect(card.getByRole("button", { name: /Add to bag/ })).toBeVisible();
  });
});
