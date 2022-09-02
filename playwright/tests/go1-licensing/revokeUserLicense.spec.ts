/* eslint-disable no-empty-pattern */
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
import { BASE_URL } from '../../constants'
import { stateFilePath } from '../../hooks/global-setup'

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
  await page.goto(
    `${BASE_URL}/profile/${licenseContext.profileId}?orgId=${licenseContext.orgId}`
  )

  await page.waitForLoadState('networkidle')

  test
    .expect(page.locator(`data-testid=go1-license-${licenseContext.licenseId}`))
    .toBeVisible()

  await page.click('a:has-text("Edit Profile")')
  await page.click(
    `data-testid=go1-license-${licenseContext.licenseId} >> button:has-text("Remove")`
  )

  await page.click('button:has-text("Save Changes")')
  await page.waitForLoadState('networkidle')

  test
    .expect(page.locator(`data-testid=go1-license-${licenseContext.licenseId}`))
    .not.toBeVisible()
})
