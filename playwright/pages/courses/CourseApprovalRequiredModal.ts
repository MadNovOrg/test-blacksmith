import { Locator, Page } from '@playwright/test'

import { BasePage } from '../BasePage'

export class CourseApprovalRequiredModal extends BasePage {
  readonly proceedButton: Locator

  constructor(page: Page) {
    super(page)
    this.proceedButton = this.page.locator('[data-testid="proceed-button"]')
  }

  async confirmCourseException() {
    if (await this.proceedButton.isVisible()) {
      await this.proceedButton.click()
    }
  }
}
