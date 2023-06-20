import { Locator, Page } from '@playwright/test'

import { BasePage } from '../BasePage'

import { CourseOrderDetailsPage } from './CourseOrderDetailsPage'

export class TrainerExpensesPage extends BasePage {
  readonly reviewAndConfirmButton: Locator

  constructor(page: Page) {
    super(page)
    this.reviewAndConfirmButton = this.page.locator(
      '[data-testid="TrainerExpenses-submit"]'
    )
  }

  async clickReviewAndConfirmButton() {
    await this.reviewAndConfirmButton.click()
    return new CourseOrderDetailsPage(this.page)
  }
}
