import { test as base } from '@playwright/test'

import { stateFilePath } from '../hooks/global-setup'

export const trainerTest = base.extend({
  // eslint-disable-next-line no-empty-pattern
  storageState: async ({}, use) => {
    await use(stateFilePath('trainer'))
  },
})
