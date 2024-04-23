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
    this.firstNameInput = this.page.locator('input[name="profile.firstName"]')
    this.surnameInput = this.page.locator('input[name="profile.surname"]')
    this.emailInput = this.page.locator('[data-testid="user-selector"] input')
    this.termsAcceptedCheckbox = this.page.locator('input[name=termsAccepted]')
    this.cancelButton = this.page.locator('[data-testid=replace-cancel]')
    this.submitButton = this.page.locator('[data-testid=replace-submit]')
  }

  async enterDetails(firstName: string, surname: string, email: string) {
    await this.emailInput.fill(email)
    await this.firstNameInput.fill(firstName)
    await this.surnameInput.fill(surname)
  }

  async clickSubmitButton() {
    await this.submitButton.click()
  }
  async replaceAttendee(user: User) {
    await this.enterDetails(user.givenName, user.familyName, user.email)
    await this.clickSubmitButton()
  }
}
