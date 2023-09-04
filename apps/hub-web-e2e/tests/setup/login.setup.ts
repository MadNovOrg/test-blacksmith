import { test as setup } from '@playwright/test'

import { bypassHSCookieConsent } from '@qa/commands'
import { users, credentials } from '@qa/data/users'
import { LoginPage } from '@qa/fixtures/pages/auth/LoginPage.fixture'
import { stateFilePath } from '@qa/util'

setup.describe.configure({ mode: 'parallel' })

credentials.forEach(cred => {
  setup(`logs in with ${cred.name} user`, async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    const myCoursesPage = await loginPage.logIn(
      users[cred.name].email,
      users[cred.name].password
    )

    await bypassHSCookieConsent(page)

    await myCoursesPage.userMenu.checkIsVisible()
    if (cred.role.toLowerCase() !== 'user') {
      await myCoursesPage.roleSwitcher.selectRole(cred.role)
    }

    await page.context().storageState({ path: stateFilePath(cred.name) })
  })
})
