import { Locator, Page } from '@playwright/test'

import { BasePage } from '@qa/pages/BasePage'

export class RemoveAttendeePopUp extends BasePage {
  readonly applyCancellationTermsRadioButton: Locator
  readonly customFeeRadioButton: Locator
  readonly noFeesRadioButton: Locator
  readonly removeAttendeeButton: Locator
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
    this.removeAttendeeButton = this.page.locator(
      '[data-testid="removeAttendee-button"]'
    )
    this.closeButton = this.page.locator('[data-testid="close-button"]')
    this.reasonForCancellationInput = this.page.locator(
      '[data-testid="reasonForCancellation-input"] input'
    )
    this.confirmationCheckbox = this.page.locator(
      '[data-testid="confirmation-checkbox"]'
    )
  }

  async removeAttendeeWithNoteUsingUser(
    userRole = 'admin',
    note = 'Reason of removing the attendee'
  ) {
    await this.reasonForCancellationInput.type(note)
    userRole !== 'admin' && (await this.confirmationCheckbox.click())
    await this.removeAttendeeButton.click()
  }
}
