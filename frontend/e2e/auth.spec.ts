import { test } from "@playwright/test";
import {
  ensureLoggedOut,
  uiLogin,
  uiLogout,
  E2E_USER_EMAIL,
  E2E_USER_PASS,
} from "./utils";

test.describe("Auth", () => {
  test("should login and logout successfully", async ({ page }) => {
    await ensureLoggedOut(page);
    await uiLogin(page, E2E_USER_EMAIL, E2E_USER_PASS);
    await uiLogout(page);
  });
});
