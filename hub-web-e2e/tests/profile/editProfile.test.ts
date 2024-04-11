import { test } from '@playwright/test'
import { Chance } from 'chance'

import { getProfileId } from '@qa/api/hasura/profile'
import { users } from '@qa/data/users'
import { ProfilePage } from '@qa/fixtures/pages/profile/ProfilePage.fixture'
import { stateFilePath } from '@qa/util'

const allowedRoles = ['salesAdmin']

allowedRoles.forEach(role => {
  test.use({ storageState: stateFilePath(role) })

  test(`edit user profile as ${role}`, async ({ page }) => {
    const profileId = await getProfileId(users.user1.email)
    const phoneNumber = new Chance().phone()
    const profilePage = new ProfilePage(page)
    await profilePage.goto(profileId)
    await profilePage.clickEditButton()
    await profilePage.enterPhoneNumber(phoneNumber)
    await profilePage.clickSaveChanges()
    await profilePage.checkPhoneNumber(phoneNumber)
  })
})
