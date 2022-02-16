import { rm } from 'fs'

import { chromium } from '@playwright/test'

import { DEFAULT_USER, TEMP_DIR } from '../constants'
import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../pages/auth/LoginPage'

export const stateFilePath = (role: string) =>
  `${TEMP_DIR}/storage-${role}.json`

const login = async (role: string) => {
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()
  const loginPage = new LoginPage(page)
  await loginPage.goto()
  await loginPage.logIn(DEFAULT_USER.email, DEFAULT_USER.password)
  await new HomePage(page).userMenu.checkIsVisible()
  await context.storageState({ path: stateFilePath(role) })
  await browser.close()
}

async function globalSetup() {
  if (!process.env.KEEP_TMP_DIR) {
    rm(TEMP_DIR, { recursive: true, force: true }, () => {
      console.log('Removed temp directory')
    })
    await login('trainer')
  }
}

export default globalSetup
