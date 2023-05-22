import { test } from '@playwright/test'
import { Chance } from 'chance'

import { stateFilePath } from '@qa/hooks/global-setup'
import { ProfilePage } from '@qa/pages/profile/ProfilePage'

test.use({ storageState: stateFilePath('user1') })

test('edit user profile as an attendee user', async ({ page }) => {
  const phoneNumber = new Chance().phone()
  const profilePage = new ProfilePage(page)
  await profilePage.goto()
  await profilePage.clickEditButton()
  await profilePage.enterPhoneNumber(phoneNumber)
  await profilePage.clickSaveChanges()
  await profilePage.checkPhoneNumber(phoneNumber)
})
