import { test } from '@playwright/test'

import { DEFAULT_USER } from '../../constants'
import { LoginPage } from '../../pages/auth/LoginPage'

test('login successfully @smoke', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.goto()
  const homePage = await loginPage.logIn(
    DEFAULT_USER.email,
    DEFAULT_USER.password
  )
  await homePage.userMenu.checkIsVisible()
})

test('login error: incorrect email', async ({ page }) => {
  test.skip(true, 'Skipped till the functionality is ready')
  const loginPage = new LoginPage(page)
  await loginPage.goto()
  await loginPage.logIn('abc@def.ghi', 'jklmnop')
  await loginPage.checkErrors({
    generalError: 'Email address or password was incorrect, please try again',
  })
})

test('login error: incorrect password', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.goto()
  await loginPage.logIn(DEFAULT_USER.email, DEFAULT_USER.password + '1')
  await loginPage.checkErrors({
    generalError: 'Email address or password was incorrect, please try again',
  })
})
