import { test as base } from '@playwright/test'

import { stateFilePath } from '../hooks/global-setup'
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage'

export const trainerTest = base.extend({
  // eslint-disable-next-line no-empty-pattern
  storageState: async ({}, use) => {
    await use(stateFilePath('trainer'))
  },
})

export const unauthorizedTest = base.extend<{
  resetPasswordPage: ResetPasswordPage
}>({
  resetPasswordPage: async ({ page }, use) => {
    const resetPasswordPage = new ResetPasswordPage(page)
    await resetPasswordPage.goto()
    await use(resetPasswordPage)
  },
})
