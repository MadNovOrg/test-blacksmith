import { expect, Locator, Page } from '@playwright/test'

export class RoleSwitcher {
  readonly page: Page
  readonly button: Locator
  readonly option: (text: string) => Locator

  constructor(page: Page) {
    this.page = page
    this.button = this.page.locator('data-testid=RoleSwitcher-btn')
    this.option = text =>
      this.page.locator(
        `[data-testid="RoleSwitcher-otherRole"]:text-is("${text}")`
      )
  }

  async selectRole(role: string) {
    if (
      (await this.button.count()) != 0 &&
      (await this.button.textContent()) !== role
    ) {
      await this.button.click()
      await this.option(role).click()
      await this.page.waitForLoadState()
    }
  }

  async checkIsVisible() {
    await expect(this.button).toBeVisible({ timeout: 20000 })
  }
}
