import { test, expect } from "@playwright/test";

const SLUG = "relaxed-boxy-cotton-tee";

async function addToBag(page: import("@playwright/test").Page) {
  await page.goto(`/product/${SLUG}`);
  await page.getByRole("button", { name: /Colour: Black/ }).click();
  await page.getByRole("button", { name: "M", exact: true }).click();
  await page.getByRole("button", { name: "Add to bag", exact: true }).click();
  await expect(page.getByText(/Added to bag/)).toBeVisible();
  await page.getByRole("button", { name: /Dismiss notification/ }).click();
}

test.describe("cart", () => {
  test("drawer opens, updates quantity, and removes items", async ({ page }) => {
    await addToBag(page);
    await page.getByRole("button", { name: /Shopping bag/ }).click();
    const drawer = page.getByRole("dialog");
    await expect(drawer).toBeVisible();
    await expect(drawer.getByText("Relaxed Boxy Cotton Tee")).toBeVisible();

    await page.getByRole("button", { name: "Increase quantity" }).click();
    await expect(page.getByText("₹2,580").first()).toBeVisible(); // 2 × 1290

    await page.getByRole("button", { name: /Remove Relaxed/ }).click();
    await expect(page.getByText("Your bag is empty")).toBeVisible();
  });

  test("cart persists across reload", async ({ page }) => {
    await addToBag(page);
    await page.reload();
    await page.getByRole("button", { name: /Shopping bag/ }).click();
    await expect(
      page.getByRole("dialog").getByText("Relaxed Boxy Cotton Tee"),
    ).toBeVisible();
  });

  test("full cart page shows summary totals", async ({ page }) => {
    await addToBag(page);
    await page.goto("/cart");
    await expect(page.getByRole("heading", { name: "Shopping bag" })).toBeVisible();
    await expect(page.getByText("Order summary")).toBeVisible();
    await expect(page.getByText("₹1,290").first()).toBeVisible();
    await page.getByRole("link", { name: "Proceed to checkout" }).click();
    await expect(page).toHaveURL(/\/checkout$/);
  });
});
