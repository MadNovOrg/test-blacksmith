import { test } from '@playwright/test'

import { Option } from '@qa/components/UserMenu'
import { stateFilePath } from '@qa/hooks/global-setup'
import { LoginPage } from '@qa/pages/auth/LoginPage'
import { MyCoursesPage } from '@qa/pages/courses/MyCoursesPage'

test.use({ storageState: stateFilePath('trainer') })

test('logout @smoke', async ({ page }) => {
  const myCoursesPage = new MyCoursesPage(page)
  await myCoursesPage.goto()
  await myCoursesPage.userMenu.selectOption(Option.Logout)
  const loginPage = new LoginPage(page)
  await loginPage.checkLoginPageOpened()
  await myCoursesPage.goto()
  await loginPage.checkLoginPageOpened()
})
