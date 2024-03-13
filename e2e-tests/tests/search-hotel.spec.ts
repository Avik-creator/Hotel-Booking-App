import { test, expect } from "@playwright/test";
import path from "path";

const UI_URL = "http://localhost:5174/";

test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);

  // get the sign in button
  await page.getByRole("link", { name: "Sign In" }).click();
  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
  await page.locator('[name="email"]').fill("1@1.com");
  await page.locator('[name="password"]').fill("password");

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText("Sign in Successful!")).toBeVisible();
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
});

test("should show hotel search results", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Where are you going?").fill("Test");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page.getByText("Hotels found in Test")).toBeVisible();
  await expect(page.getByRole("link", { name: "Test Hotel" })).toBeVisible();
});

test("should show hotel detail", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Where are you going?").fill("Test");
  await page.getByRole("button", { name: "Search" }).click();

  //   await page.getByText("Test Hotel").click();
  await page.getByRole("link", { name: "Test Hotel" }).click();
  await expect(page).toHaveURL(/detail/);
  await expect(page.getByRole("button", { name: "Book now" })).toBeVisible();
});
