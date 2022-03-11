import { rm } from 'fs'

import { Browser, chromium } from '@playwright/test'

import { TEMP_DIR } from '../constants'
import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../pages/auth/LoginPage'
import { users } from '../data/users'

export const stateFilePath = (userKey: string) =>
  `${TEMP_DIR}/storage-${userKey}.json`

const login = async (browser: Browser, userKey: string) => {
  const page = await browser.newPage()
  const loginPage = new LoginPage(page)
  await loginPage.goto()
  await loginPage.logIn(users[userKey].email, users[userKey].password)
  await new HomePage(page).userMenu.checkIsVisible()
  await page.context().storageState({ path: stateFilePath(userKey) })
}

async function globalSetup() {
  if (!process.env.KEEP_TMP_DIR) {
    rm(TEMP_DIR, { recursive: true, force: true }, () => {
      console.log('Removed temp directory')
    })
    const browser = await chromium.launch()
    await login(browser, 'admin')
    await login(browser, 'trainer')
    await login(browser, 'trainerWithOrg')
    await browser.close()
  }
}

export default globalSetup
