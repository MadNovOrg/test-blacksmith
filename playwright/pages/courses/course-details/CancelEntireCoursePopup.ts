import { Locator, Page } from '@playwright/test'

import { BasePage } from '../../BasePage'

export class CancelEntireCoursePopUp extends BasePage {
  readonly feeRadioButton: Locator
  readonly cancelEntireCourseButton: Locator

  constructor(page: Page) {
    super(page)
    this.feeRadioButton = this.page.locator('text=Apply cancellation terms')
    this.cancelEntireCourseButton = this.page.locator(
      'data-testid=cancel-entire-course-button'
    )
  }

  async checkFeeRadioButton() {
    await this.feeRadioButton.check()
  }

  async clickCancelEntireCourseButton() {
    await this.cancelEntireCourseButton.click()
  }
}
