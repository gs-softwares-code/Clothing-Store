import { test, expect } from "@playwright/test";

test.describe("homepage", () => {
  test("renders key sections and navigation", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: /art of/i })).toBeVisible();
    await expect(page.getByText("New arrivals", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Best sellers", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Modern essentials", { exact: true }).first()).toBeVisible();
    // Announcement bar
    await expect(page.getByText(/Free standard delivery/)).toBeVisible();
  });

  test("desktop mega menu opens on hover and contains subcategories", async ({ page }) => {
    await page.goto("/");
    test.skip((await page.viewportSize())!.width < 768, "mega menu is desktop-only");
    const women = page.getByRole("button", { name: "Women" }).first();
    await women.hover();
    await expect(page.getByRole("link", { name: "T-Shirts" }).first()).toBeVisible();
    await page.getByRole("link", { name: "T-Shirts" }).first().click();
    await expect(page).toHaveURL(/\/women\/t-shirts$/);
    await expect(page.getByRole("heading", { name: "T-Shirts" })).toBeVisible();
  });

  test("category tiles navigate", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Women/ }).first().click();
    await expect(page).toHaveURL(/\/women$/);
  });

  test("footer contains agency attribution", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/Digital Commerce Experience by/)).toBeVisible();
    await page.getByRole("link", { name: "GS Softwares" }).click();
    await expect(page).toHaveURL(/\/showcase$/);
  });
});
