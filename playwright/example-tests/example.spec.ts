import { test, expect } from "@playwright/test";

test("homepage has title", async ({ page }) => {
  await page.goto("https://app.lupaproject.io/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Lupa/);
});
