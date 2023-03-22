import { test } from '@playwright/test'

import { stateFilePath } from '../../hooks/global-setup'
import { MyProfilePage } from '../../pages/profile/MyProfilePage'

test.use({ storageState: stateFilePath('user1') })

test('edit user profile as an attendee user', async ({ page }) => {
  const myProfilePage = new MyProfilePage(page)
  await myProfilePage.goto()
  await myProfilePage.clickEditButton()
  await myProfilePage.enterPhoneNumber()
  await myProfilePage.clickSaveChanges()
  await myProfilePage.checkProfileChanges()
})
