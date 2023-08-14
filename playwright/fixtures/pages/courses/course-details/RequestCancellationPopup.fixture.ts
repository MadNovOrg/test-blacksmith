import { Locator, Page } from '@playwright/test'

import { BasePage } from '@qa/fixtures/pages/BasePage.fixture'

export class RequestCancellationPopup extends BasePage {
  readonly reasonForCancellationInput: Locator
  readonly confirmCheckbox: Locator
  readonly confirmButton: Locator

  constructor(page: Page) {
    super(page)
    this.reasonForCancellationInput = this.page.locator(
      '[data-testid="cancel-course-reason"] input'
    )
    this.confirmCheckbox = this.page.locator(
      'data-testid=request-cancel-checkbox'
    )
    this.confirmButton = this.page.locator(
      'data-testid=request-cancel-submit-button'
    )
  }
  async addReasonForCancellation(text: string) {
    await this.reasonForCancellationInput.type(text)
  }

  async checkConfirmCheckbox() {
    await this.confirmCheckbox.check()
  }

  async clickConfirmButton() {
    await this.confirmButton.click()
  }
}
