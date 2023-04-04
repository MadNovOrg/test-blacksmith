import { test as base } from '@playwright/test'
import { addYears } from 'date-fns'

import * as API from '../../api'
import { users } from '../../data/users'
import { stateFilePath } from '../../hooks/global-setup'
import { ProfilePage } from '../../pages/profile/ProfilePage'

type Go1LicenseContext = {
  orgId: string
  profileId: string
  licenseId: string
}

const test = base.extend<{ licenseContext: Go1LicenseContext }>({
  licenseContext: async ({}, use) => {
    const [orgId, profileId] = await Promise.all([
      API.organization.insertOrganization({ name: 'Test organization' }),
      API.profile.getProfileId(users.user1.email),
    ])
    const [memberId, licenseId] = await Promise.all([
      API.organization.insertOrganizationMember({
        profile_id: profileId,
        organization_id: orgId,
      }),
      API.go1_licensing.insertGo1License({
        profileId,
        orgId,
        expireDate: addYears(new Date(), 1),
      }),
    ])
    await use({ licenseId, orgId, profileId })
    await Promise.all([
      API.go1_licensing.deleteGo1License(licenseId),
      API.organization.deleteOrganizationMember(memberId),
      API.organization.deleteOrganization(orgId),
    ])
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
