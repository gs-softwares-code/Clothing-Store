import { test, expect } from "@playwright/test";

const SLUG = "relaxed-boxy-cotton-tee";

test.describe("product detail", () => {
  test("adding to bag requires a size", async ({ page }) => {
    await page.goto(`/product/${SLUG}`);
    await page.getByRole("button", { name: "Add to bag", exact: true }).click();
    await expect(page.getByText("Please select a size.")).toBeVisible();
    await expect(page.getByText(/Added to bag/)).toBeHidden();
  });

  test("selecting colour and size adds to bag with toast", async ({ page }) => {
    await page.goto(`/product/${SLUG}`);
    await page.getByRole("button", { name: /Colour: Black/ }).click();
    await page.getByRole("button", { name: "M", exact: true }).click();
    await page.getByRole("button", { name: "Add to bag", exact: true }).click();
    await expect(page.getByText(/Added to bag/)).toBeVisible();
  });

  test("size guide drawer opens and closes", async ({ page }) => {
    await page.goto(`/product/${SLUG}`);
    await page.getByRole("button", { name: "Size guide" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText("Size guide", { exact: false }).first()).toBeVisible();
    await page.getByRole("button", { name: "Close" }).first().click();
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("wishlist toggle updates state and persists", async ({ page }) => {
    await page.goto(`/product/${SLUG}`);
    await page.getByRole("button", { name: "Add to wishlist", exact: true }).click();
    await page.goto("/wishlist");
    await expect(page.getByText("Relaxed Boxy Cotton Tee")).toBeVisible();
  });

  test("related products section renders", async ({ page }) => {
    await page.goto(`/product/${SLUG}`);
    await expect(page.getByText("You may also like")).toBeVisible();
  });
});
