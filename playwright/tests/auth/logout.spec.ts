import { test } from '@playwright/test'

import { Option } from '../../components/UserMenu'
import { stateFilePath } from '../../hooks/global-setup'
import { LoginPage } from '../../pages/auth/LoginPage'
import { MyCoursesPage } from '../../pages/courses/MyCoursesPage'

test.use({ storageState: stateFilePath('trainer') })

test('logout @smoke', async ({ page }) => {
  const myCoursesPage = new MyCoursesPage(page)
  await myCoursesPage.goto()
  await myCoursesPage.userMenu.selectOption(Option.Logout)
  const loginPage = new LoginPage(page)
  await loginPage.checkLoginPageOpened()
  await myCoursesPage.tryToOpen()
  await loginPage.checkLoginPageOpened()
})
