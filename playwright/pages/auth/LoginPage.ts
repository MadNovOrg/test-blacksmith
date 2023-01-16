import { expect, Locator, Page } from '@playwright/test'

import { BASE_URL } from '../../constants'
import { BasePage } from '../BasePage'
import { MyCoursesPage } from '../courses/MyCoursesPage'

import { ForgotPasswordPage } from './ForgotPasswordPage'

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
    this.emailErrorText = this.page.locator('#email-helper-text')
    this.passwordInput = this.page.locator('#password')
    this.passwordErrorText = this.page.locator('#password-helper-text')
    this.signInButton = this.page.locator('button[data-testid="login-submit"]')
    this.forgotPasswordLink = this.page.locator(
      'a[data-testid="forgot-password-link"]'
    )
    this.generalErrorText = this.page.locator('[data-testid="login-error"]')
  }

  async goto() {
    await super.goto(BASE_URL, this.emailInput)
  }

  async checkLoginPageOpened() {
    await expect(this.emailInput).toBeVisible()
  }

  async logIn(email: string, password: string): Promise<MyCoursesPage> {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.signInButton.click()
    return new MyCoursesPage(this.page)
  }

  async checkErrors(errors: {
    generalError?: string
    emailError?: string
    passwordError?: string
  }) {
    if (errors.generalError) {
      await expect(this.generalErrorText).toHaveText(errors.generalError)
    } else {
      await expect(this.generalErrorText).toBeHidden()
    }
    if (errors.emailError) {
      await expect(this.emailErrorText).toHaveText(errors.emailError)
    } else {
      await expect(this.emailErrorText).toBeHidden()
    }
    if (errors.passwordError) {
      await expect(this.passwordErrorText).toHaveText(errors.passwordError)
    } else {
      await expect(this.passwordErrorText).toBeHidden()
    }
  }

  async clickForgotPasswordLink(): Promise<ForgotPasswordPage> {
    await this.forgotPasswordLink.click()
    return new ForgotPasswordPage(this.page)
  }
}
