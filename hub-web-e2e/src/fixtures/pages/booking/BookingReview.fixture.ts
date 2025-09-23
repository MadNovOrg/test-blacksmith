import { Locator, Page } from '@playwright/test'

import { BasePage } from '../BasePage.fixture'

export class BookingReviewPage extends BasePage {
  readonly termsCheckbox: Locator
  readonly confirmButton: Locator

  constructor(page: Page) {
    super(page)
    this.termsCheckbox = this.page.locator('[data-testid="accept-terms"]')
    this.confirmButton = this.page.locator('[data-testid="confirm-button"]')
  }

  async consentToTerms() {
    await this.termsCheckbox.check()
  }

  async clickConfirmBooking() {
    await this.confirmButton.click()
  }
}
