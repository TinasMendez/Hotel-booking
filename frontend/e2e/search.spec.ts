// frontend/e2e/search.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Home Search", () => {
  test("should keep categories and recommendations and show some cards after Search", async ({ page }) => {
    await page.goto("/");

    // These sections must remain visible before and after searching.
    await expect(page.getByRole("heading", { name: /categories/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /recommendations/i })).toBeVisible();

    // Rely on placeholder text instead of label to be resilient to markup tweaks.
    const searchInput = page.getByPlaceholder(/hotel|glamping|loft/i).first();
    await expect(searchInput).toBeVisible();
    await searchInput.fill("loft");

    // Trigger search.
    await page.getByRole("button", { name: /^search$/i }).click();

    // Consider success when at least one "View details" link appears.
    const detailsLinks = page.getByRole("link", { name: /view details/i });
    await expect(detailsLinks.first()).toBeVisible();

    // Sections should still be present.
    await expect(page.getByRole("heading", { name: /categories/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /recommendations/i })).toBeVisible();

    // Reset is optional; execute only when available.
    const resetBtn = page.getByRole("button", { name: /^reset$/i }).first();
    if (await resetBtn.isVisible().catch(() => false)) {
      await resetBtn.click();
    }
  });
});

