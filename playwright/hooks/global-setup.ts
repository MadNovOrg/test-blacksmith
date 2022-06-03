import { rm } from 'fs'

import { Browser, chromium } from '@playwright/test'

import { TEMP_DIR } from '../constants'
import { users } from '../data/users'
import { LoginPage } from '../pages/auth/LoginPage'

export const stateFilePath = (userKey: string) =>
  `${TEMP_DIR}/storage-${userKey}.json`

const login = async (browser: Browser, userKey: string, role: string) => {
  const page = await browser.newPage()
  const loginPage = new LoginPage(page)
  await loginPage.goto()
  const myCoursesPage = await loginPage.logIn(
    users[userKey].email,
    users[userKey].password
  )
  await myCoursesPage.userMenu.checkIsVisible()
  if (role.toLowerCase() !== 'user' && role.toLowerCase() !== 'unverified') {
    await myCoursesPage.roleSwitcher.selectRole(role)
  }
  await page.context().storageState({ path: stateFilePath(userKey) })
}

async function globalSetup() {
  if (!process.env.KEEP_TMP_DIR) {
    rm(TEMP_DIR, { recursive: true, force: true }, () => {
      console.log('Removed temp directory')
    })
    const browser = await chromium.launch()
    await login(browser, 'admin', 'TT Admin')
    await login(browser, 'ops', 'TT Ops')
    await login(browser, 'trainer', 'Trainer')
    await login(browser, 'trainerWithOrg', 'Trainer')
    await login(browser, 'user1', 'User')
    await browser.close()
  }
}

export default globalSetup
