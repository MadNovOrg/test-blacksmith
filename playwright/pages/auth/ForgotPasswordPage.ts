import { expect, Locator, Page } from '@playwright/test'

import { BASE_URL } from '../../constants'
import { BasePage } from '../BasePage'

import { LoginPage } from './LoginPage'
import { ResetPasswordPage } from './ResetPasswordPage'

export class ForgotPasswordPage extends BasePage {
  readonly emailInput: Locator
  readonly submitButton: Locator
  readonly cancelLink: Locator
  readonly emailErrorText: Locator

  constructor(page: Page) {
    super(page)
    this.emailInput = this.page.locator('#email')
    this.emailErrorText = this.page.locator('#email-helper-text')
    this.submitButton = this.page.locator(
      'button[data-testid="forgot-pass-submit"]'
    )
    this.cancelLink = this.page.locator('a[data-testid="cancel-link"]')
  }

  async goto() {
    await super.goto(`${BASE_URL}/forgot-password`)
  }

  async submitEmail(email: string): Promise<ResetPasswordPage> {
    await this.emailInput.fill(email)
    await this.submitButton.click()
    return new ResetPasswordPage(this.page)
  }

  async checkEmailError(text: string) {
    await expect(this.emailErrorText).toHaveText(text)
  }

  async clickCancelLink(): Promise<LoginPage> {
    await this.cancelLink.click()
    return new LoginPage(this.page)
  }
}
