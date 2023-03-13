import { test as base } from '@playwright/test'
import { addYears } from 'date-fns'

import {
  deleteGo1License,
  deleteOrganization,
  deleteOrganizationMember,
  getProfileId,
  insertGo1License,
  insertOrganization,
  insertOrganizationMember,
} from '../../api/hasura-api'
import { stateFilePath } from '../../hooks/global-setup'
import { ProfilePage } from '../../pages/membership/ProfilePage'

type Go1LicenseContext = {
  orgId: string
  profileId: string
  licenseId: string
}

const test = base.extend<{ licenseContext: Go1LicenseContext }>({
  licenseContext: async ({}, use) => {
    const [orgId, profileId] = await Promise.all([
      insertOrganization({ name: 'Test organization' }),
      getProfileId('user1@teamteach.testinator.com'),
    ])

    const [memberId, licenseId] = await Promise.all([
      insertOrganizationMember({
        profile_id: profileId,
        organization_id: orgId,
      }),
      insertGo1License({
        profileId,
        orgId,
        expireDate: addYears(new Date(), 1),
      }),
    ])
    await use({ licenseId, orgId, profileId })
    await Promise.all([
      deleteGo1License(licenseId),
      deleteOrganizationMember(memberId),
      deleteOrganization(orgId),
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
