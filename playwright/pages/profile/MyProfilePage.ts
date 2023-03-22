import { Locator, expect, Page } from '@playwright/test'

import { BasePage } from '../BasePage'

export class MyProfilePage extends BasePage {
  readonly editButton: Locator
  readonly phoneNumberField: Locator
  readonly saveChangesButton: Locator
  readonly viewPhoneNumber: Locator
  readonly inputtedPhoneNumber: string

  constructor(page: Page) {
    super(page)
    this.editButton = this.page.locator('[data-testid="edit-profile"]')
    this.phoneNumberField = this.page.locator('[data-testid="phone"]')
    this.saveChangesButton = this.page.locator(
      '[data-testid="profile-save-changes"]'
    )
    this.inputtedPhoneNumber = `${Date.now()}`
    this.viewPhoneNumber = this.page
      .locator('[data-testid="personal-details-container"] > div')
      .nth(3)
  }

  async goto() {
    await super.goto(`profile`)
  }

  async clickEditButton() {
    await this.editButton.click()
  }

  async enterPhoneNumber() {
    await this.phoneNumberField.fill(this.inputtedPhoneNumber)
  }

  async clickSaveChanges() {
    await this.saveChangesButton.click()
  }

  async checkProfileChanges() {
    await expect(this.viewPhoneNumber).toHaveText(
      'Phone' + this.inputtedPhoneNumber
    )
  }
}
