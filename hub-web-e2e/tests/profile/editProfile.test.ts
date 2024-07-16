import { test, expect } from '@playwright/test'

import { getProfileId } from '@qa/api/hasura/profile'
import { users } from '@qa/data/users'
import { ProfilePage } from '@qa/fixtures/pages/profile/ProfilePage.fixture'
import { stateFilePath } from '@qa/util'

const allowedRoles = ['salesAdmin']

allowedRoles.forEach(role => {
  test.use({ storageState: stateFilePath(role) })

  test(`edit user profile as ${role}`, async ({ page }) => {
    const profileId = await getProfileId(users.user1.email)
    const job = 'Case Manager'
    const profilePage = new ProfilePage(page)
    await profilePage.goto(profileId)
    await profilePage.clickEditButton()
    await profilePage.selectJobTitle(job)
    await profilePage.selectCountry('England')
    const payloadData = await profilePage.clickSaveChanges()

    expect(payloadData).toContain(job)
    expect(payloadData).toContain('England')
  })
})
