import { expect, Locator, Page } from '@playwright/test'

import { BasePage } from '../BasePage.fixture'

export class ContactUsPage extends BasePage {
  readonly text: Locator

  constructor(page: Page) {
    super(page)
    this.text = this.page.locator('[data-testid="will-contact-you"]')
  }

  async checkContactUsPageOpened() {
    await expect(this.text).toBeVisible()
  }

  async checkText(text: string) {
    await expect(this.text).toHaveText(text)
  }
}
