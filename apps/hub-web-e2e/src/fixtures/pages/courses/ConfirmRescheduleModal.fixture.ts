import { Locator, Page } from '@playwright/test'

import { CourseType } from '@app/types'

import { BasePage } from '../BasePage.fixture'

export class ConfirmRescheduleModal extends BasePage {
  readonly reasonInput: Locator
  readonly confirmButton: Locator
  readonly noFeesCheckbox: Locator
  readonly customFeesCheckbox: Locator
  readonly applyFeesCheckbox: Locator

  constructor(page: Page) {
    super(page)
    this.reasonInput = this.page.locator(
      '[data-testid="reasonForChange-input"] input'
    )
    this.confirmButton = this.page.locator(
      '[data-testid="confirmChanges-button"]'
    )
    this.noFeesCheckbox = this.page.locator(
      '[data-testid="noFee-radio-button"]'
    )
    this.applyFeesCheckbox = this.page.locator(
      '[data-testid="applyTerms-radio-button"]'
    )
    this.customFeesCheckbox = this.page.locator(
      '[data-testid="customFee-radio-button"]'
    )
  }

  async confirmChange(reason: string, courseType = CourseType.OPEN) {
    await this.reasonInput.type(reason)
    if (courseType === CourseType.CLOSED) {
      await this.noFeesCheckbox.click()
    }
    await this.confirmButton.click()
  }
}
