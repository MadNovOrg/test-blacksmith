/* eslint-disable playwright/expect-expect */
import { test } from '@playwright/test'

import { users } from '@qa/data/users'
import { LoginPage } from '@qa/fixtures/pages/auth/LoginPage.fixture'

test('login successfully @smoke', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.goto()
  const myCoursesPage = await loginPage.logIn(
    users.trainer.email,
    users.trainer.password,
  )
  await myCoursesPage.userMenu.checkIsVisible()
})

test('login error: incorrect email', async ({ page }) => {
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
  await loginPage.logIn(users.trainer.email, users.trainer.password + '1')
  await loginPage.checkErrors({
    generalError: 'Email address or password was incorrect, please try again',
  })
})
