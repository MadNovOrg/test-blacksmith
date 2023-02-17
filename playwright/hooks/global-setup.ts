import fs, { rm } from 'fs'

import { Browser, chromium } from '@playwright/test'

import { TEMP_DIR } from '../constants'
import { users } from '../data/users'
import { LoginPage } from '../pages/auth/LoginPage'

const publicRoutes = ['/enquiry', '/waitlist']

export const stateFilePath = (userKey: string) =>
  `${TEMP_DIR}/storage-${userKey}.json`

const login = async (browser: Browser, userKey: string, role: string) => {
  const page = await browser.newPage()

  publicRoutes.forEach(route => {
    if (page.url().includes(route)) {
      return
    }
  })

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
    if (!fs.existsSync(TEMP_DIR)) {
      fs.mkdirSync(TEMP_DIR)
    }
    const browser = await chromium.launch()
    await login(browser, 'admin', 'Admin')
    await login(browser, 'ops', 'Ops')
    await login(browser, 'trainer', 'Trainer')
    await login(browser, 'trainerWithOrg', 'Trainer')
    await login(browser, 'user1', 'User')
    await login(browser, 'userOrgAdmin', 'User')
    await login(browser, 'salesAdmin', 'Sales administrator')
    await browser.close()
  }
}

export default globalSetup
