import { Locator, Page } from '@playwright/test'

import { BasePage } from '../../BasePage'

export class CancelEntireCoursePopUp extends BasePage {
  readonly feeRadioButton: Locator
  readonly cancelCourseCheckbox: Locator
  readonly cancelEntireCourseButton: Locator

  constructor(page: Page) {
    super(page)
    this.feeRadioButton = this.page.locator('text=Apply cancellation terms')
    this.cancelEntireCourseButton = this.page.locator(
      'data-testid=cancel-entire-course-button'
    )
    this.cancelCourseCheckbox = this.page.locator(
      '[data-testid="cancel-entire-course-checkbox"]'
    )
  }

  async checkFeeRadioButton() {
    await this.feeRadioButton.check()
  }

  async selectCancelCourseDropdownReason() {
    await this.page.locator('[data-testid="cancel-course-dropdown"]').click()
    await this.page.getByText('Trainer availability').click()
  }

  async enterCancellationReason(reason = 'Some reason for cancelling') {
    await this.page.locator('input[name=cancellationReason]').type(reason)
  }

  async checkCancelCourseCheckbox() {
    await this.page
      .locator('[data-testid="cancel-entire-course-checkbox"]')
      .check()
  }

  async clickCancelEntireCourseButton() {
    await this.cancelEntireCourseButton.click()
  }
}
