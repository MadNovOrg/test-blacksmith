import { setTimeout } from 'timers/promises'

import { test as base } from '@playwright/test'

import * as API from '@qa/api'
import { UNIQUE_ORGANIZATION } from '@qa/data/organization'
import { User } from '@qa/data/types'
import { users } from '@qa/data/users'
import { AllOrganisations } from '@qa/fixtures/pages/org/AllOrganisations.fixture'
import { stateFilePath } from '@qa/hooks/global-setup'

const test = base.extend<{
  organisation: { id: string; name: string; user: User }
}>({
  organisation: async ({}, use) => {
    const org = UNIQUE_ORGANIZATION()
    const [orgId, profileId] = await Promise.all([
      API.organization.insertOrganization(org),
      API.profile.getProfileId(users.user1.email),
    ])
    await API.organization.insertOrganizationMember({
      profile_id: profileId,
      organization_id: orgId,
    })
    await use({ id: orgId, name: org.name, user: users.user1 })
    // setting small timeout as there is some race condition
    // between finishing the test and cleaning up the data
    // don't know the reason for it
    await setTimeout(100)
    await API.organization.deleteOrganization(orgId)
  },
})

test.use({ storageState: stateFilePath('admin') })

test('remove user from organisation as admin', async ({
  page,
  organisation,
}) => {
  const orgPage = new AllOrganisations(page)
  await orgPage.goto(organisation.id)
  await orgPage.clickIndividualsTab()
  await orgPage.checkOrganisationUserExists(organisation.user, true)
  const editUserModal = await orgPage.clickEditUserButton()
  await editUserModal.clickRemoveFromOrganisation()
  await orgPage.checkOrganisationUserExists(organisation.user, false)
})
