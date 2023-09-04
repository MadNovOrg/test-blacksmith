import { Locator, Page } from '@playwright/test'

import { User } from '@qa/data/types'
import { BasePage } from '@qa/fixtures/pages/BasePage.fixture'
export class ReplaceAttendeePopUp extends BasePage {
  readonly firstNameInput: Locator
  readonly surnameInput: Locator
  readonly emailInput: Locator
  readonly termsAcceptedCheckbox: Locator
  readonly cancelButton: Locator
  readonly submitButton: Locator

  constructor(page: Page) {
    super(page)
    this.firstNameInput = this.page.locator('input[name=firstName]')
    this.surnameInput = this.page.locator('input[name=surname]')
    this.emailInput = this.page.locator('input[name=email]')
    this.termsAcceptedCheckbox = this.page.locator('input[name=termsAccepted]')
    this.cancelButton = this.page.locator('[data-testid=replace-cancel]')
    this.submitButton = this.page.locator('[data-testid=replace-submit]')
  }

  async enterDetails(
    firstName: string,
    surname: string,
    email: string,
    termsAccepted = true
  ) {
    await this.firstNameInput.fill(firstName)
    await this.surnameInput.fill(surname)
    await this.emailInput.fill(email)
    await this.termsAcceptedCheckbox.setChecked(termsAccepted)
  }

  async clickSubmitButton() {
    await this.submitButton.click()
  }
  async replaceAttendee(user: User) {
    await this.enterDetails(user.givenName, user.familyName, user.email)
    await this.clickSubmitButton()
  }
}
