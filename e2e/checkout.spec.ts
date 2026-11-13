import { test, expect } from "@playwright/test";

const SLUG = "relaxed-boxy-cotton-tee";

async function seedCart(page: import("@playwright/test").Page) {
  await page.goto(`/product/${SLUG}`);
  await page.getByRole("button", { name: /Colour: Black/ }).click();
  await page.getByRole("button", { name: "M", exact: true }).click();
  await page.getByRole("button", { name: /Add to bag/ }).click();
  await expect(page.getByText(/Added to bag/)).toBeVisible();
}

test.describe("checkout journey", () => {
  test("validation blocks bad contact details", async ({ page }) => {
    await seedCart(page);
    await page.goto("/checkout");
    await page.getByRole("button", { name: /Continue to delivery/ }).click();
    await expect(page.getByText("First name is required")).toBeVisible();
  });

  test("full journey reaches confirmation with reference", async ({ page }) => {
    await seedCart(page);
    await page.goto("/checkout");

    // Step 1 — contact
    await page.getByPlaceholder("Aarav").fill("Aarav");
    await page.getByPlaceholder("Sharma").fill("Sharma");
    await page.getByPlaceholder("you@example.com").fill("aarav@example.com");
    await page.getByPlaceholder("+91 98765 43210").fill("+91 98765 43210");
    await page.getByPlaceholder("Flat, building, street").fill("12 MG Road");
    await page.getByPlaceholder("Landmark, area").fill("Shivaji Nagar");
    await page.getByPlaceholder("Bengaluru").fill("Bengaluru");
    await page.getByPlaceholder("Karnataka").fill("Karnataka");
    await page.getByPlaceholder("560001").fill("560001");
    await page.getByRole("button", { name: /Continue to delivery/ }).click();

    // Step 2 — delivery
    await page.getByRole("radio", { name: /Standard delivery/ }).check();
    await page.getByRole("button", { name: /Continue to payment/ }).click();

    // Step 3 — payment (demo)
    await page.getByRole("button", { name: /Fill with demo card/ }).click();
    await page.getByRole("button", { name: /Review order/ }).click();

    // Step 4 — review
    await expect(page.getByText("Card ending 4242 (demo)")).toBeVisible();
    await page.getByRole("button", { name: /Place order — demo/ }).click();

    // Confirmation
    await expect(page).toHaveURL(/\/order-confirmation\/ord_/);
    await expect(page.getByRole("heading", { name: /order confirmed/ })).toBeVisible();
    await expect(page.getByText(/FME-\d{4}-\d+/)).toBeVisible();
    await expect(page.getByText(/demonstration order/)).toBeVisible();
  });

  test("bag is cleared after order", async ({ page }) => {
    await seedCart(page);
    await page.goto("/checkout");
    await page.getByPlaceholder("Aarav").fill("Aarav");
    await page.getByPlaceholder("Sharma").fill("Sharma");
    await page.getByPlaceholder("you@example.com").fill("aarav@example.com");
    await page.getByPlaceholder("+91 98765 43210").fill("+91 98765 43210");
    await page.getByPlaceholder("Flat, building, street").fill("12 MG Road");
    await page.getByPlaceholder("Bengaluru").fill("Bengaluru");
    await page.getByPlaceholder("Karnataka").fill("Karnataka");
    await page.getByPlaceholder("560001").fill("560001");
    await page.getByRole("button", { name: /Continue to delivery/ }).click();
    await page.getByRole("button", { name: /Continue to payment/ }).click();
    await page.getByRole("button", { name: /Fill with demo card/ }).click();
    await page.getByRole("button", { name: /Review order/ }).click();
    await page.getByRole("button", { name: /Place order — demo/ }).click();
    await expect(page.getByRole("heading", { name: /order confirmed/ })).toBeVisible();
    await page.getByRole("button", { name: /Shopping bag/ }).click();
    await expect(page.getByText("Your bag is empty")).toBeVisible();
  });
});
