import { Locator, Page } from '@playwright/test'

import { BasePage } from '@qa/fixtures/pages/BasePage.fixture'

export class CancelAttendeeDialog extends BasePage {
  readonly applyCancellationTermsRadioButton: Locator
  readonly customFeeRadioButton: Locator
  readonly noFeesRadioButton: Locator
  readonly cancelAttendeeButton: Locator
  readonly closeButton: Locator
  readonly reasonForCancellationInput: Locator
  readonly confirmationCheckbox: Locator

  constructor(page: Page) {
    super(page)
    this.applyCancellationTermsRadioButton = this.page.locator(
      '[data-testid="apply-cancellation-terms-radioButton"]'
    )
    this.customFeeRadioButton = this.page.locator(
      '[data-testid="custom-fee-radioButton"]'
    )
    this.noFeesRadioButton = this.page.locator(
      '[data-testid="no-fees-radioButton"]'
    )
    this.cancelAttendeeButton = this.page.locator(
      '[data-testid="cancelAttendee-button"]'
    )
    this.closeButton = this.page.locator('[data-testid="close-button"]')
    this.reasonForCancellationInput = this.page.locator(
      '[data-testid="reasonForCancellation-input"] input'
    )
    this.confirmationCheckbox = this.page.locator(
      '[data-testid="confirmation-checkbox"]'
    )
  }

  async cancelAttendeeWithNoteUsingUser(
    note = 'Reason of removing the attendee'
  ) {
    await this.reasonForCancellationInput.type(note)
    await this.cancelAttendeeButton.click()
  }
}
