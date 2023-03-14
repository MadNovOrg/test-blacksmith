import fs, { rm } from 'fs'

import { Browser, chromium } from '@playwright/test'

import { TARGET_ENV, TEMP_DIR } from '../constants'
import { users } from '../data/users'
import { LoginPage } from '../pages/auth/LoginPage'

const publicRoutes = ['/enquiry', '/waitlist']

export const stateFilePath = (userKey: string) =>
  `${TEMP_DIR}/storage-${userKey}-${TARGET_ENV}.json`

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
  if (process.env.REMOVE_TMP_DIR) {
    rm(TEMP_DIR, { recursive: true, force: true }, () => {
      console.log('Removed temp directory')
    })
  }
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR)
  }
  const browser = await chromium.launch()
  const credentials = [
    { name: 'admin', role: 'Admin' },
    { name: 'ops', role: 'Ops' },
    { name: 'trainer', role: 'Trainer' },
    { name: 'trainerWithOrg', role: 'Trainer' },
    { name: 'user1', role: 'User' },
    { name: 'userOrgAdmin', role: 'User' },
    { name: 'salesAdmin', role: 'Sales administrator' },
  ]
  await Promise.all(
    credentials.map(async cred => {
      const { name, role } = cred
      if (!fs.existsSync(`${TEMP_DIR}/storage-${role}-${TARGET_ENV}.json`)) {
        await login(browser, name, role)
      }
    })
  )
  await browser.close()
}

export default globalSetup
