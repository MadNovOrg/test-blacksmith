import { test, expect } from '@playwright/test'

import { insertDummyUserProfile } from '@qa/api/hasura/profile'
import { TEST_SETTINGS } from '@qa/constants'
import { ProfilePage } from '@qa/fixtures/pages/profile/ProfilePage.fixture'
import { stateFilePath } from '@qa/util'

test.use({ storageState: stateFilePath('admin') })

test.beforeEach(async ({}) => {
  TEST_SETTINGS.role = 'admin' // need this to insert directly
})

test('Create and then delete a user', async ({ page }) => {
  const newAccountProfileId = await insertDummyUserProfile()

  const profilePage = new ProfilePage(page)
  await profilePage.goto(newAccountProfileId)
  expect(page.url()).toContain(newAccountProfileId)

  await profilePage.clickDeleteProfileButton()
  await profilePage.clickConfirmDeleteCheckbox()
  await profilePage.deleteUserProfile()
})
