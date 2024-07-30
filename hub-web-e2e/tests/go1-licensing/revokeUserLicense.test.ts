/* eslint-disable playwright/expect-expect */
import { test as base } from '@playwright/test'
import { addYears } from 'date-fns'

import * as API from '@qa/api'
import { UNIQUE_ORGANIZATION } from '@qa/data/organization'
import { users } from '@qa/data/users'
import { ProfilePage } from '@qa/fixtures/pages/profile/ProfilePage.fixture'
import { stateFilePath } from '@qa/util'

type Go1LicenseContext = {
  orgId: string
  profileId: string
  licenseId: string
}

const test = base.extend<{ licenseContext: Go1LicenseContext }>({
  licenseContext: async ({}, use) => {
    const [orgId, profileId] = await Promise.all([
      API.organization.insertOrganization(UNIQUE_ORGANIZATION()),
      API.profile.getProfileId(users.user1.email),
    ])
    const memberId = await API.organization.insertOrganizationMember({
      profile_id: profileId,
      organization_id: orgId,
    })

    const licenseId = await API.go1_licensing.insertGo1License({
      profileId,
      orgId,
      expireDate: addYears(new Date(), 1),
    })

    await use({ licenseId, orgId, profileId })

    await API.go1_licensing.deleteGo1License(licenseId)
    await API.organization.deleteOrganizationMember(memberId)
    await API.organization.deleteOrganization(orgId)
  },
})

test.use({ storageState: stateFilePath('admin') })

test("removes a license for an organisation's user", async ({
  page,
  licenseContext,
}) => {
  const profilePage = new ProfilePage(page)
  await profilePage.goto(licenseContext.profileId, licenseContext.orgId)
  await profilePage.checkLicenceIdExists(licenseContext.licenseId, true)
  await profilePage.clickEditProfile()
  await profilePage.clickRemoveLicenceById(licenseContext.licenseId)
  await profilePage.clickSaveChanges()
  await profilePage.checkLicenceIdExists(licenseContext.licenseId, false)
})
