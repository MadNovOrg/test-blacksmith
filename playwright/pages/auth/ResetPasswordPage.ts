import { expect, Locator, Page } from '@playwright/test'

import { BASE_URL } from '../../constants'
import { BasePage } from '../BasePage'
import { ContactUsPage } from '../contact/ContactUsPage'

import { LoginPage } from './LoginPage'

export class ResetPasswordPage extends BasePage {
  readonly resendLink: Locator
  readonly contactUsLink: Locator
  readonly emailText: Locator
  readonly newPasswordInput: Locator
  readonly confirmPasswordInput: Locator
  readonly confirmationCodeInputs: Locator
  readonly resetPasswordButton: Locator
  readonly passwordErrorText: Locator

  constructor(page: Page) {
    super(page)
    this.resendLink = this.page.locator('[data-testid="resend-code"]')
    this.contactUsLink = this.page.locator('[data-testid="contact-us-link"]')
    this.emailText = this.page.locator('[data-testid="email"]')
    this.newPasswordInput = this.page.locator('#password')
    this.confirmPasswordInput = this.page.locator('#passwordConfirm')
    this.confirmationCodeInputs = this.page.locator('input[name*="code"]')
    this.passwordErrorText = this.page.locator('[error-for="passwordConfirm"]')
    this.resetPasswordButton = this.page.locator('text="Reset Password"')
  }

  async goto() {
    await super.goto(
      `${BASE_URL}/reset-password?email=abc@def.ghi&confirmation_code=123456`,
      this.newPasswordInput
    )
  }

  async checkEmailText(email: string) {
    await expect(this.emailText).toHaveText(email)
  }

  async submitPasswords(
    newPassword: string,
    confirmPassword: string
  ): Promise<LoginPage> {
    await this.newPasswordInput.fill(newPassword)
    await this.confirmPasswordInput.fill(confirmPassword)
    await this.resetPasswordButton.click()
    return new LoginPage(this.page)
  }

  async checkPasscodeHasDigitsFromUrl() {
    const expectedCode = this.page.url().slice(-6)
    await this.checkPasscode(expectedCode)
  }

  async checkPasscode(expectedCode: string) {
    const count = await this.confirmationCodeInputs.count()
    let code = ''
    for (let i = 0; i < count; i++) {
      code += await this.confirmationCodeInputs.nth(i).inputValue()
    }
    expect(code).toStrictEqual(expectedCode)
  }

  async checkPasswordError(text: string) {
    await expect(this.passwordErrorText).toHaveText(text)
  }

  async fillPassCode(value: string) {
    await this.confirmationCodeInputs.first().click()
    await this.page.keyboard.type(value, { delay: 100 })
  }

  async clickResetPasswordButton() {
    await this.resetPasswordButton.click()
  }

  async clickContactUsLink(): Promise<ContactUsPage> {
    await this.contactUsLink.click()
    return new ContactUsPage(this.page)
  }

  async clickResendCodeLink() {
    await this.resendLink.click()
  }
}
