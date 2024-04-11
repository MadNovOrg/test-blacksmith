import { test } from '@playwright/test'

import { Option } from '@qa/fixtures/components/UserMenu.fixture'
import { LoginPage } from '@qa/fixtures/pages/auth/LoginPage.fixture'
import { MyCoursesPage } from '@qa/fixtures/pages/courses/MyCoursesPage.fixture'
import { stateFilePath } from '@qa/util'

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
