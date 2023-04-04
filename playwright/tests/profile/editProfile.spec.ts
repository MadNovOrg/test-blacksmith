import { test } from '@playwright/test'

import { stateFilePath } from '../../hooks/global-setup'
import { ProfilePage } from '../../pages/profile/ProfilePage'

test.use({ storageState: stateFilePath('user1') })

test('edit user profile as an attendee user', async ({ page }) => {
  const profilePage = new ProfilePage(page)
  await profilePage.goto()
  await profilePage.clickEditButton()
  await profilePage.enterPhoneNumber()
  await profilePage.clickSaveChanges()
  await profilePage.goto()
  await profilePage.checkProfileChanges()
})
