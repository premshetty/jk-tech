import { expect, test } from "@playwright/test";

const BASE_URL = process.env.TEST_URL || "http://localhost:3000";

test("Login and logout flow", async ({ page }) => {
  // Go to login page
  await page.goto(`${BASE_URL}/auth/login`);

  // Fill in login credentials
  await page.fill('input[name="email"]', "admin@example.com");
  await page.fill('input[name="password"]', "admin123");
  await page.click('button[type="submit"]');

  // Expect to land on homepage
  await expect(page).toHaveURL(`${BASE_URL}/`);

  // Click the logout button (matches your JSX)
  await page.getByRole("button", { name: /log out/i }).click();

  // Expect to be redirected back to login
  await expect(page).toHaveURL(`${BASE_URL}/auth/login`);
});
