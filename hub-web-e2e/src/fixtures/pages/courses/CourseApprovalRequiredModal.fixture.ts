import { Locator, Page } from '@playwright/test'

import { BasePage } from '../BasePage.fixture'

export class CourseApprovalRequiredModal extends BasePage {
  readonly proceedButton: Locator
  readonly reasonText: Locator

  constructor(page: Page) {
    super(page)
    this.proceedButton = this.page.locator('[data-testid="proceed-button"]')
    this.reasonText = this.page
      .locator('[data-testid="exception-reason-input"]')
      .locator('textarea')
      .first()
  }

  async confirmCourseException() {
    if (await this.reasonText.isVisible()) {
      await this.reasonText.fill('Test Reason')
    }
    if (await this.proceedButton.isVisible()) {
      await this.proceedButton.click()
    }
  }
}
