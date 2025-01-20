import { test, expect } from "@playwright/test";
import { describe } from "node:test";

/**
 * 認証テスト
 * ログイン後のテストは、繰り返しテストするとテストが重くなる。解決方法は、公式ドキュメントを確認する。
 * https://playwright.dev/docs/test-auth
 *
 */
describe("認証テスト", () => {
  test("サインアップの申請ができること", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.getByRole("button", { name: "サインイン" }).click();
    await page.getByRole("link", { name: "アカウントを新規作成する" }).click();
    await page.getByPlaceholder("山田太郎").press("ControlOrMeta+a");
    await page.getByPlaceholder("山田太郎").fill("t5kuboki");
    await page.getByPlaceholder("test@example.com").press("ControlOrMeta+a");
    await page.getByPlaceholder("test@example.com").fill("t5kuboki@gmail.com");
    await page.locator('input[name="password"]').press("ControlOrMeta+a");
    await page.locator('input[name="password"]').fill("TESTtest123!!");
    await page.waitForTimeout(1500); // 2秒待つ
    await page
      .getByRole("button", { name: "新規アカウント作成" })
      .first()
      .click();
    const userId = process.env.USER_ID;
    const checkUrl = new RegExp(
      `.*\/sign-up\/verify-email-address\\?id=${userId}`
    );
    await expect(page).toHaveURL(checkUrl);
    await expect(
      page.getByRole("heading", { name: "確認メールを送信しました。" })
    ).toBeVisible();
  });
  test("サインインできること。", async ({ page }) => {
    await page.goto("http://localhost:3000/");

    await page.getByRole("button", { name: "サインイン" }).click();
    await page
      .getByLabel("メールアドレス or ユーザー名")
      .fill("kubokidev@gmail.com");
    await page.locator('input[name="password"]').fill("testTEST123!!");
    await page.getByRole("button", { name: "ログイン" }).click();
    const checkUrl = new RegExp(`.*\/welcome`);
    await expect(page).toHaveURL(checkUrl);
    await expect(
      page.getByRole("heading", { name: "ようこそ！" })
    ).toBeVisible();
  });
});
