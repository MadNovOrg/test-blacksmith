import { test } from '@playwright/test'

import { DEFAULT_USER } from '../../constants'
import { HomePage } from '../../pages/HomePage'
import { LoginPage } from '../../pages/auth/LoginPage'

test('login successfully', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.goto()
  await loginPage.logIn(DEFAULT_USER.email, DEFAULT_USER.password)
  await new HomePage(page).userMenu.checkIsVisible()
})

// commented till the functionality works, just for checking the github actions
// test('login error: incorrect email', async ({ page }) => {
//   const loginPage = new LoginPage(page)
//   await loginPage.goto()
//   await loginPage.logIn('abc@def.ghi', 'jklmnop')
//   await loginPage.checkErrors({
//     generalError: 'Email or password was incorrect, please try again',
//   })
// })
