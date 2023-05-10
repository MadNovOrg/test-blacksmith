import { test } from '@playwright/test'
import { Chance } from 'chance'

import { stateFilePath } from '../../hooks/global-setup'
import { ProfilePage } from '../../pages/profile/ProfilePage'

test.use({ storageState: stateFilePath('user1') })

test('edit user profile as an attendee user', async ({ page }) => {
  const phoneNumber = new Chance().phone()
  const profilePage = new ProfilePage(page)
  await profilePage.goto()
  await profilePage.clickEditButton()
  await profilePage.enterPhoneNumber(phoneNumber)
  await profilePage.clickSaveChanges()
  await profilePage.page.reload() // Required as Playwright is too quick to check otherwise
  await profilePage.checkPhoneNumber(phoneNumber)
})
