import { Locator, Page } from '@playwright/test'

export class BasePage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goto(url: string, mandatoryElement: Locator) {
    await this.page.goto(url)
    await mandatoryElement.waitFor({ timeout: 30000 })
  }
}
