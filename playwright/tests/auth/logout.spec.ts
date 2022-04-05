import { test } from '@playwright/test'

import { Option } from '../../components/UserMenu'
import { stateFilePath } from '../../hooks/global-setup'
import { LoginPage } from '../../pages/auth/LoginPage'
import { HomePage } from '../../pages/HomePage'

test.use({ storageState: stateFilePath('trainer') })

test('logout @smoke', async ({ page }) => {
  const homePage = new HomePage(page)
  await homePage.goto()
  await homePage.userMenu.selectOption(Option.Logout)
  const loginPage = new LoginPage(page)
  await loginPage.checkLoginPageOpened()
  await homePage.tryToOpen()
  await loginPage.checkLoginPageOpened()
})
