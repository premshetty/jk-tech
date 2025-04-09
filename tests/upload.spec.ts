// tests/upload-page.spec.ts
import { expect, test } from "@playwright/test";
import path from "path";

test("full upload flow with chat and delete", async ({ page }) => {
  // 1. Login
  await page.goto("http://localhost:3000/auth/login");
  await page.fill('input[name="email"]', "admin@example.com");
  await page.fill('input[name="password"]', "admin123");
  await page.getByRole("button", { name: "Login" }).click();

  // 2. Upload File
  const filePath = path.resolve(__dirname, "fixtures/sample.txt");
  const input = page.locator("input[type=file]");
  await input.setInputFiles(filePath);
  await page.getByRole("button", { name: "Start Upload" }).click();

  // Wait until progress reaches 100%
  await expect(page.getByText("Status: done")).toBeVisible({ timeout: 10000 });

  // 3. Click file to activate chat
  const fileRow = page.locator("li", { hasText: "sample.txt" });
  await fileRow.click();

  // 4. Send a message
  const inputBox = page.getByPlaceholder("Type your message...");
  await inputBox.fill("What is this file about?");
  await page.getByRole("button", { name: "Send" }).click();

  // Wait until an assistant message appears and is not "Thinking..."
  await expect
    .poll(
      async () => {
        const elements = await page
          .locator('[data-testid="assistant-message"]')
          .all();
        const lastText = elements.length
          ? await elements[elements.length - 1].innerText()
          : "";
        return lastText;
      },
      {
        timeout: 10000,
        message: "Waiting for final assistant response",
      }
    )
    .toMatch(/^(?!Thinking\.\.\.).+/);

  // 5. Delete the file
  await fileRow.getByRole("button", { name: "Delete" }).click();

  // 6. File should be removed from list
  await expect(page.getByText("sample.txt")).not.toBeVisible();
});
