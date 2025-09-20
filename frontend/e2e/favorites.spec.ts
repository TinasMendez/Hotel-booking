import { test, expect } from "@playwright/test";
import { uiLogin, E2E_USER_EMAIL, E2E_USER_PASS } from "./utils";

/**
 * Locale-tolerant regexes so the test works in ES/EN UIs.
 */
const FAV_TOGGLE = /(favorite|favoritos)/i;
const ADD_FAV = /(add|agregar).*?(favorite|favoritos)/i;
const REM_FAV = /(remove|quitar).*?(favorite|favoritos)/i;

/**
 * Counts current favorites by visiting /favorites and counting the
 * "Remove from favorites" buttons (deterministic with networkidle).
 */
async function favCount(page) {
  await page.goto("/favorites");
  await page.waitForLoadState("networkidle");
  // small settle in case of late reflow
  await page.waitForTimeout(50);
  return page.getByRole("button", { name: REM_FAV }).count();
}

/**
 * Ensures at least one recommendation card is ready on Home.
 * Returns the Recommendations section locator.
 */
async function ensureRecommendationsSection(page) {
  await page.goto("/");
  const section = page.getByRole("region", { name: /recommendations/i });
  await expect(section).toBeVisible();

  // Try to ensure at least one favorites toggle appears inside.
  const refresh = section.getByRole("button", { name: /refresh/i });

  for (let attempt = 0; attempt < 3; attempt++) {
    const anyToggle = section.getByRole("button", { name: FAV_TOGGLE }).first();
    if (await anyToggle.count()) {
      await anyToggle.waitFor({ state: "visible", timeout: 10_000 });
      return section;
    }
    if (await refresh.count()) {
      await refresh.click();
      await page.waitForLoadState("networkidle");
    } else {
      await page.waitForTimeout(200);
    }
  }

  throw new Error("No recommendation cards with favorite button appeared.");
}

/**
 * Waits until the favorites count equals exactly `expected`.
 * Uses expect.poll to avoid arbitrary timeouts.
 */
async function waitForFavoriteCount(page, expected) {
  await expect
    .poll(async () => await favCount(page), {
      timeout: 7_000,
    })
    .toBe(expected);
}

test.describe("Favorites", () => {
  test("should add and remove a favorite", async ({ page }) => {
    await uiLogin(page, E2E_USER_EMAIL, E2E_USER_PASS);

    // 1) Baseline: how many favorites do we have now?
    const initial = await favCount(page);

    // 2) Try to ADD directly from Home (happy path)
    const section = await ensureRecommendationsSection(page);

    // If there is an "Add to favorites" in the Recommendations, use it.
    let addBtn = section.getByRole("button", { name: ADD_FAV }).first();

    if (await addBtn.count()) {
      await expect(addBtn).toBeVisible();
      await addBtn.click();

      // ✅ Wait for the count to increase deterministically
      await waitForFavoriteCount(page, initial + 1);

      // 2b) Remove one to restore baseline from /favorites
      await page.goto("/favorites");
      await page.waitForLoadState("networkidle");
      const removeButtons = page.getByRole("button", { name: REM_FAV });
      const before = await removeButtons.count(); // should be initial + 1

      await expect(removeButtons.first()).toBeVisible();
      await removeButtons.first().click();

      // ✅ Wait until the grid actually shrinks by one
      await expect(removeButtons).toHaveCount(before - 1, { timeout: 7000 });

      // and double-check final baseline
      await waitForFavoriteCount(page, initial);
      return;
    }

    // 3) If no "Add to favorites" is visible, assume visible cards are already in favorites.
    //    Remove one in /favorites → go back to Home and add it again → end at baseline.
    if (initial > 0) {
      await page.goto("/favorites");
      await page.waitForLoadState("networkidle");

      const removeButtons = page.getByRole("button", { name: REM_FAV });
      const before = await removeButtons.count(); // equals initial

      await expect(removeButtons.first()).toBeVisible();
      await removeButtons.first().click();

      // ✅ Wait for count to decrease by one
      await expect(removeButtons).toHaveCount(before - 1, { timeout: 7000 });

      // Now go add from Home
      await ensureRecommendationsSection(page);
      addBtn = page
        .getByRole("region", { name: /recommendations/i })
        .getByRole("button", { name: ADD_FAV })
        .first();

      await expect(addBtn).toBeVisible();
      await addBtn.click();

      // ✅ Back to baseline
      await waitForFavoriteCount(page, initial);
      return;
    }

    // 4) Edge case: initial === 0 and there is still no “Add” seen before
    // Ensure Home again and add the first available card
    await ensureRecommendationsSection(page);
    addBtn = page
      .getByRole("region", { name: /recommendations/i })
      .getByRole("button", { name: ADD_FAV })
      .first();

    await expect(addBtn).toBeVisible();
    await addBtn.click();

    // ✅ Now the count must be initial + 1
    await waitForFavoriteCount(page, initial + 1);

    // Cleanup: remove one to go back to 0
    await page.goto("/favorites");
    await page.waitForLoadState("networkidle");
    const removeButtons = page.getByRole("button", { name: REM_FAV });
    const before = await removeButtons.count();

    await expect(removeButtons.first()).toBeVisible();
    await removeButtons.first().click();
    await expect(removeButtons).toHaveCount(before - 1, { timeout: 7000 });

    await waitForFavoriteCount(page, initial);
  });
});
