import { test as base, expect } from '@playwright/test'

import * as API from '@qa/api'
import { insertDummyUserProfile } from '@qa/api/hasura/profile'
import { waitForGraphQLResponse } from '@qa/commands'
import { UNIQUE_ORGANIZATION } from '@qa/data/organization'
import { ProfilePage } from '@qa/fixtures/pages/profile/ProfilePage.fixture'
import { ProfileAccessToKnowledgeHubQuery } from '@qa/generated/graphql'
import { stateFilePath } from '@qa/util'

const test = base.extend<{
  profile: ProfileAccessToKnowledgeHubQuery['profile_by_pk']
}>({
  profile: async ({}, use) => {
    const insertProfileId = await insertDummyUserProfile()
    const newProfile = await API.profile.getProfileAccessToKnowledgeHub(
      insertProfileId,
    )
    const org = UNIQUE_ORGANIZATION()
    const orgId = await API.organization.insertOrganization(org)

    const member = await API.organization.insertOrganizationMember({
      profile_id: newProfile?.id,
      organization_id: orgId,
    })

    await use(newProfile as ProfileAccessToKnowledgeHubQuery['profile_by_pk'])

    await API.organization.deleteOrganizationMember(member)
    await API.organization.deleteOrganization(orgId)
    await API.profile.deleteProfile(insertProfileId)
  },
})

test.use({ storageState: stateFilePath('admin') })

test("update access to Knowledge Hub on profile's Knowledge Hub permission switch @smoke", async ({
  page,
  profile,
}) => {
  const profilePage = new ProfilePage(page)
  await profilePage.goto(profile?.id)

  await expect(profilePage.knowledgeHubSwitch).toBeChecked()

  await profilePage.knowledgeHubSwitch.click()

  await waitForGraphQLResponse(page, 'update_profile_by_pk')

  let updatedProfile = await API.profile.getProfileAccessToKnowledgeHub(
    profile?.id,
  )
  expect(updatedProfile?.canAccessKnowledgeHub).toBeFalsy()

  await profilePage.knowledgeHubSwitch.click()

  await waitForGraphQLResponse(page, 'update_profile_by_pk')

  updatedProfile = await API.profile.getProfileAccessToKnowledgeHub(profile?.id)
  expect(updatedProfile?.canAccessKnowledgeHub).toBeTruthy()
})
