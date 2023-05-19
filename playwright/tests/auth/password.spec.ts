import { test as base } from '@playwright/test'

import { getLatestEmail } from '@qa/api/email-api'
import { TARGET_ENV } from '@qa/constants'
import { users } from '@qa/data/users'
import { ForgotPasswordPage } from '@qa/pages/auth/ForgotPasswordPage'
import { LoginPage } from '@qa/pages/auth/LoginPage'
import { ResetPasswordPage } from '@qa/pages/auth/ResetPasswordPage'
import { contactYouText } from '@qa/pages/contact/texts'
import { EmailPage } from '@qa/pages/EmailPage'

const test = base.extend<{ resetPasswordPage: ResetPasswordPage }>({
  resetPasswordPage: async ({ page }, use) => {
    const resetPasswordPage = new ResetPasswordPage(page)
    await resetPasswordPage.goto()
    await use(resetPasswordPage)
  },
})

test('forgot password page @smoke', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.goto()
  const forgotPasswordPage = await loginPage.clickForgotPasswordLink()
  await forgotPasswordPage.clickCancelLink()
  await loginPage.checkLoginPageOpened()
})

test('reset password @smoke', async ({ page }) => {
  // eslint-disable-next-line playwright/no-skipped-test
  test.skip(TARGET_ENV === 'local')
  const newPassword = `$qweRTY${new Date().getMilliseconds()}`
  const forgotPasswordPage = new ForgotPasswordPage(page)
  await forgotPasswordPage.goto()
  await forgotPasswordPage.submitEmail(users.resetPassword.email)
  const email = await getLatestEmail(
    users.resetPassword.email,
    'Forgot Password Confirmation Code'
  )
  const emailPage = new EmailPage(page)
  await emailPage.renderContent(email.html)
  const resetPasswordPage = await emailPage.clickResetPasswordLink()
  await resetPasswordPage.checkPasscodeHasDigitsFromUrl()
  const loginPage = await resetPasswordPage.submitPasswords(
    newPassword,
    newPassword
  )
  const homePage = await loginPage.logIn(users.resetPassword.email, newPassword)
  await homePage.userMenu.checkIsVisible()
})

test('resend otp and contact us link @smoke', async ({ resetPasswordPage }) => {
  await resetPasswordPage.clickResendCodeLink()
  const contactUsPage = await resetPasswordPage.clickContactUsLink()
  await contactUsPage.checkText(contactYouText('abc@def.ghi'))
})
