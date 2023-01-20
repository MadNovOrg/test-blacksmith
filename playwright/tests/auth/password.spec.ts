import { expect, test as base } from '@playwright/test'

import { getLatestEmail } from '../../api/email-api'
import { TARGET_ENV } from '../../constants'
import { users } from '../../data/users'
import { ForgotPasswordPage } from '../../pages/auth/ForgotPasswordPage'
import { LoginPage } from '../../pages/auth/LoginPage'
import { ResetPasswordPage } from '../../pages/auth/ResetPasswordPage'
import { contactYouText } from '../../pages/contact/texts'
import { EmailPage } from '../../pages/EmailPage'

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

test('forgot password: non-existent email', async ({ page }) => {
  const forgotPasswordPage = new ForgotPasswordPage(page)
  await forgotPasswordPage.goto()
  const [response] = await Promise.all([
    page.waitForResponse(
      resp =>
        resp.url().includes('https://cognito-idp.eu-west-2.amazonaws.com/') &&
        resp.status() == 400
    ),
    forgotPasswordPage.submitEmail('abc@def.ghi'),
  ])
  const json = await response.json()
  await expect(json.message).toContain(
    'Username/client id combination not found.'
  )
})

test('reset password', async ({ page }) => {
  test.skip(TARGET_ENV === 'local')
  const newPassword = `$qweRTY${new Date().getMilliseconds()}`
  const forgotPasswordPage = new ForgotPasswordPage(page)
  await forgotPasswordPage.goto()
  await forgotPasswordPage.submitEmail(users.resetPassword.email)
  const email = await getLatestEmail(users.resetPassword.email)
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

test('reset password: empty password', async ({ resetPasswordPage }) => {
  await resetPasswordPage.clickResetPasswordButton()
  await resetPasswordPage.checkPasswordError('Please enter a new password')
})

test('reset password: spaces only', async ({ resetPasswordPage }) => {
  await resetPasswordPage.submitPasswords('        ', '        ')
  await resetPasswordPage.checkPasswordError('Please enter a new password')
})

test('reset password: too short', async ({ page }) => {
  test.skip(TARGET_ENV === 'local')
  const forgotPasswordPage = new ForgotPasswordPage(page)
  await forgotPasswordPage.goto()
  await forgotPasswordPage.submitEmail(users.resetPassword.email)
  const email = await getLatestEmail(users.resetPassword.email)
  const emailPage = new EmailPage(page)
  await emailPage.renderContent(email.html)
  const resetPasswordPage = await emailPage.clickResetPasswordLink()
  await resetPasswordPage.submitPasswords('abc', 'abc')
  await resetPasswordPage.checkGeneralError(
    'Password does not conform to policy'
  )
})

test('resend otp and contact us link @smoke', async ({ resetPasswordPage }) => {
  await resetPasswordPage.clickResendCodeLink()
  const contactUsPage = await resetPasswordPage.clickContactUsLink()
  await contactUsPage.checkText(contactYouText('abc@def.ghi'))
})
