// Test utilities used across specs (robust selectors + logout fiable)
import { expect, Page } from "@playwright/test";

export const E2E_USER_EMAIL = process.env.E2E_USER_EMAIL || "juan@example.com";
export const E2E_USER_PASS  = process.env.E2E_USER_PASS  || "Juan1234!";
export const E2E_ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL || "vale@example.com";
export const E2E_ADMIN_PASS  = process.env.E2E_ADMIN_PASS  || "Test1234!";

function avatarBtn(page: Page) {
  // Header avatar exposes aria-haspopup="menu"
  return page.locator('button[aria-haspopup="menu"], [data-testid="user-menu-button"]').first();
}

export async function goHome(page: Page) {
  await page.goto("/");
  await expect(page).toHaveTitle(/Digital Booking/i);
}

export async function openUserMenu(page: Page) {
  const btn = avatarBtn(page);
  await expect(btn).toBeVisible();
  await btn.click();
}

export async function expectLoggedOut(page: Page) {
  // Acepta que "Sign in" sea link o botón según el layout
  const signInLink   = page.getByRole("link", { name: /sign in/i });
  const signInButton = page.getByRole("button", { name: /sign in/i });
  await expect(signInLink.or(signInButton)).toBeVisible();
  await expect(avatarBtn(page)).toHaveCount(0);
}

export async function ensureLoggedOut(page: Page) {
  await goHome(page);

  // Si hay avatar, intenta logout por menú
  if (await avatarBtn(page).isVisible()) {
    await openUserMenu(page);
    const signOut = page.getByRole("menuitem", { name: /sign out/i });
    if (await signOut.isVisible()) {
      await signOut.click();
      await page.waitForLoadState("networkidle");
    }
  }

  // Saneamiento extra: limpiar token del storage por si quedó algún residuo
  await page.evaluate(() => {
    try { localStorage.removeItem("token"); } catch {}
  });
  await page.reload();

  await expectLoggedOut(page);
}

export async function uiLogin(page: Page, email: string, password: string) {
  // Asegura estado limpio
  if (await avatarBtn(page).isVisible()) {
    await ensureLoggedOut(page);
  }
  await page.goto("/login");
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /sign in/i }).click();

  // Logged-in state = avatar visible
  await expect(avatarBtn(page)).toBeVisible();
}

export async function uiLogout(page: Page) {
  await openUserMenu(page);
  await page.getByRole("menuitem", { name: /sign out/i }).click();
  await expectLoggedOut(page);
}
