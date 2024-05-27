import { expect, Locator, Page } from '@playwright/test'

import { BasePage } from '../BasePage.fixture'

import { CourseOrderDetailsPage } from './CourseOrderDetailsPage.fixture'

export class TrainerExpensesPage extends BasePage {
  readonly reviewAndConfirmButton: Locator
  readonly orderDetailsButton: Locator

  constructor(page: Page) {
    super(page)
    this.reviewAndConfirmButton = this.page.locator(
      'button:has-text("Trainer expenses")'
    )
    this.orderDetailsButton = this.page
      .locator('button:has-text("Order details")')
      .first()
  }

  async clickReviewAndConfirmButton() {
    await this.reviewAndConfirmButton.click()
    return new CourseOrderDetailsPage(this.page)
  }

  async clickOrderDetailsButton() {
    await expect(this.orderDetailsButton).toBeEnabled()
    await this.orderDetailsButton.click()
    return new CourseOrderDetailsPage(this.page)
  }
}
