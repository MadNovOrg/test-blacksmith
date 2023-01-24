import { expect, Page } from '@playwright/test'

export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('domcontentloaded')
  await expect(page.locator('role=progressbar')).toHaveCount(0)
  await expect(page.locator('.MuiSkeleton-pulse')).toHaveCount(0)
}
