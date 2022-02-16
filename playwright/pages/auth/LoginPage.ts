import { expect, Locator, Page } from '@playwright/test'

import { BASE_URL } from '../../constants'
import { BasePage } from '../BasePage'

export class LoginPage extends BasePage {
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly signInButton: Locator
  readonly forgotPasswordLink: Locator
  readonly emailErrorText: Locator
  readonly passwordErrorText: Locator
  readonly generalErrorText: Locator

  constructor(page: Page) {
    super(page)
    this.emailInput = this.page.locator('#email')
    this.emailErrorText = this.page.locator('div[error-for="email"]')
    this.passwordInput = this.page.locator('#password')
    this.passwordErrorText = this.page.locator('div[error-for="password"]')
    this.signInButton = this.page.locator('text=Sign In')
    this.forgotPasswordLink = this.page.locator(
      'text="Forgotten your password?"'
    )
    this.generalErrorText = this.page.locator('#error')
  }

  async goto() {
    await super.goto(BASE_URL, this.emailInput)
  }

  async checkLoginPageOpened() {
    await expect(this.emailInput).toBeVisible()
  }

  async logIn(email: string, password: string) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.signInButton.click()
  }

  async checkErrors(errors: {
    generalError?: string
    emailError?: string
    passwordError?: string
  }) {
    await expect(this.generalErrorText).toHaveText(errors.generalError ?? '')
    await expect(this.emailErrorText).toHaveText(errors.emailError ?? '')
    await expect(this.passwordErrorText).toHaveText(errors.passwordError ?? '')
  }
}
