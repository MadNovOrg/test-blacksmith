import { Locator, Page } from '@playwright/test'

export class BasePage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goto(url: string, mandatoryElement: Locator, timeout = 30000) {
    await this.page.goto(url)
    await this.page.waitForLoadState()
    await mandatoryElement.waitFor({ timeout })
  }

  async closeCurrentTab() {
    await this.page.close()
  }
}
