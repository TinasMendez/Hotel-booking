// frontend/e2e/product.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Product detail & reserve guard", () => {
  test("should open a product and guard reservation when not logged in", async ({
    page,
  }) => {
    await page.goto("/");

    // Open first product details via "View details →"
    const viewLinks = page.getByRole("link", { name: /view details/i });
    await expect(viewLinks.first()).toBeVisible();
    await viewLinks.first().click();

    // Detail page: should show gallery (or at least "View more" trigger if available)
    const viewMore = page.getByRole("button", { name: /view more/i });
    if (await viewMore.isVisible().catch(() => false)) {
      await viewMore.click();
      // Close modal by pressing Escape or clicking backdrop (not strictly required)
      await page.keyboard.press("Escape").catch(() => {});
    }

    // Try to reserve (should redirect to login if user is not authenticated)
    const reserveBtn = page
      .getByRole("button", { name: /reserve|book now|reserve now/i })
      .first();
    if (await reserveBtn.isVisible().catch(() => false)) {
      await reserveBtn.click();
      // Expect login form
      const emailInput = page
        .locator('input[name="email"], input[type="email"]')
        .first();
      await expect(emailInput).toBeVisible();
    }
  });
});
