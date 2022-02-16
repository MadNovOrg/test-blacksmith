import { Option } from '../../components/UserMenu'
import { trainerTest as test } from '../../fixtures/auth'
import { HomePage } from '../../pages/HomePage'
import { LoginPage } from '../../pages/auth/LoginPage'

test('logout', async ({ page }) => {
  const homePage = new HomePage(page)
  await homePage.goto()
  await homePage.userMenu.selectOption(Option.Logout)
  const loginPage = new LoginPage(page)
  await loginPage.checkLoginPageOpened()
  await homePage.tryToOpen()
  await loginPage.checkLoginPageOpened()
})
