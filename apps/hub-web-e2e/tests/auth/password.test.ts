import { test as base } from '@playwright/test'

import { getLatestEmail } from '@qa/api/email-api'
import { TARGET_ENV } from '@qa/constants'
import { users } from '@qa/data/users'
import { ForgotPasswordPage } from '@qa/fixtures/pages/auth/ForgotPasswordPage.fixture'
import { LoginPage } from '@qa/fixtures/pages/auth/LoginPage.fixture'
import { ResetPasswordPage } from '@qa/fixtures/pages/auth/ResetPasswordPage.fixture'
import { EmailPage } from '@qa/fixtures/pages/EmailPage.fixture'

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
