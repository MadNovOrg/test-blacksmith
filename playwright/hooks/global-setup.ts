import fs from 'fs/promises'

import { Browser, chromium } from '@playwright/test'

import { bypassHSCookieConsent } from '@qa/commands'
import { TARGET_ENV, TEMP_DIR } from '@qa/constants'
import { users } from '@qa/data/users'
import { LoginPage } from '@qa/pages/auth/LoginPage'

export const stateFilePath = (userKey: string) =>
  `${TEMP_DIR}/storage-${userKey}-${TARGET_ENV}.json`

const login = async (browser: Browser, userKey: string, role: string) => {
  const page = await browser.newPage()
  const loginPage = new LoginPage(page)
  await loginPage.goto()
  const myCoursesPage = await loginPage.logIn(
    users[userKey].email,
    users[userKey].password
  )

  await bypassHSCookieConsent(page)

  await myCoursesPage.userMenu.checkIsVisible()
  if (role.toLowerCase() !== 'user') {
    await myCoursesPage.roleSwitcher.selectRole(role)
  }
  await page.context().storageState({ path: stateFilePath(userKey) })
}

async function globalSetup() {
  // We skip the login when running the 'query' tests as it isn't required
  if (process.env.QUERY) return
  // Remove temp directory if requested
  if (process.env.REMOVE_TMP_DIR) {
    await fs.rm(TEMP_DIR, { recursive: true, force: true })
    console.log('Removed temp directory')
  }
  // Create temp directory if it doesn't exist
  await fs.mkdir(TEMP_DIR, { recursive: true })
  const browser = await chromium.launch()
  const credentials = [
    { name: 'admin', role: 'Administrator' },
    { name: 'ops', role: 'Operations' },
    { name: 'trainer', role: 'Trainer' },
    { name: 'trainerWithOrg', role: 'Trainer' },
    { name: 'user1', role: 'Individual' },
    { name: 'userOrgAdmin', role: 'Individual' },
    { name: 'salesAdmin', role: 'Sales administrator' },
  ]
  await Promise.all(
    credentials.map(async cred => {
      const { name, role } = cred
      if (!(await fs.access(stateFilePath(role)).catch(() => false))) {
        await login(browser, name, role)
      }
    })
  )
  await browser.close()
}

export default globalSetup
