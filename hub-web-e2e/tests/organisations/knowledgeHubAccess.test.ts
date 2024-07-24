import { test as base, expect } from '@playwright/test'

import * as API from '@qa/api'
import { insertDummyUserProfile } from '@qa/api/hasura/profile'
import { waitForGraphQLResponse } from '@qa/commands'
import { UNIQUE_ORGANIZATION } from '@qa/data/organization'
import { AllOrganisations } from '@qa/fixtures/pages/org/AllOrganisations.fixture'
import { stateFilePath } from '@qa/util'

let test = base.extend<{ orgs: { id: string; members: { id: string }[] }[] }>({
  orgs: async ({}, use) => {
    const org = UNIQUE_ORGANIZATION()
    const secondOrg = UNIQUE_ORGANIZATION()

    const orgs = await Promise.all([
      API.organization.insertOrganization(org),
      API.organization.insertOrganization(secondOrg),
    ])

    const profileIds = await Promise.all([
      insertDummyUserProfile(),
      insertDummyUserProfile(),
      insertDummyUserProfile(),
    ])

    const members = await Promise.all(
      profileIds.map(id =>
        API.organization.insertOrganizationMember({
          profile_id: id,
          organization_id: orgs[0],
        }),
      ),
    )

    await use([
      { id: orgs[0], members: profileIds.map(id => ({ id })) },
      { id: orgs[1], members: [] },
    ])

    await Promise.all(
      members.map(id => API.organization.deleteOrganizationMember(id)),
    )
    await Promise.all(orgs.map(id => API.organization.deleteOrganization(id)))
    await Promise.all(profileIds.map(id => API.profile.deleteProfile(id)))
  },
})

test.use({ storageState: stateFilePath('admin') })

test("update access to Knowledge Hub for all organization's members @smoke", async ({
  page,
  orgs,
}) => {
  let profilesAccess = await Promise.all(
    orgs[0].members.map(member =>
      API.profile.getProfileAccessToKnowledgeHub(member.id),
    ),
  )

  profilesAccess.forEach(profile => {
    expect(profile?.canAccessKnowledgeHub).toBeTruthy()
  })

  const orgsPage = new AllOrganisations(page)
  await orgsPage.gotoOrganisation(orgs[0].id)

  orgsPage.permissionsTab.click()

  await expect(orgsPage.knowledgeHubAccessSwitch).toBeChecked()
  await orgsPage.knowledgeHubAccessSwitch.click()

  await waitForGraphQLResponse(page, 'update_organization_by_pk')

  // Await to db's org access update trigger to update the access for org's members
  await page.waitForTimeout(2000)

  profilesAccess = await Promise.all(
    orgs[0].members.map(member =>
      API.profile.getProfileAccessToKnowledgeHub(member.id),
    ),
  )

  profilesAccess.forEach(profile => {
    expect(profile?.canAccessKnowledgeHub).toBeFalsy()
  })

  await orgsPage.knowledgeHubAccessSwitch.click()

  await waitForGraphQLResponse(page, 'update_organization_by_pk')
  // Await to db's org access update trigger to update the access for org's members
  await page.waitForTimeout(2000)

  profilesAccess = await Promise.all(
    orgs[0].members.map(member =>
      API.profile.getProfileAccessToKnowledgeHub(member.id),
    ),
  )

  profilesAccess.forEach(profile => {
    expect(profile?.canAccessKnowledgeHub).toBeTruthy()
  })
})

test = base.extend<{ orgs: { id: string; members: { id: string }[] }[] }>({
  orgs: async ({}, use) => {
    const org = UNIQUE_ORGANIZATION()
    const secondOrg = UNIQUE_ORGANIZATION()

    const orgs = await Promise.all([
      API.organization.insertOrganization(org),
      API.organization.insertOrganization(secondOrg),
    ])

    const profileIds = await Promise.all([
      insertDummyUserProfile(),
      insertDummyUserProfile(),
      insertDummyUserProfile(),
    ])

    const members = await Promise.all([
      ...profileIds.map(id =>
        API.organization.insertOrganizationMember({
          profile_id: id,
          organization_id: orgs[0],
        }),
      ),
      API.organization.insertOrganizationMember({
        profile_id: profileIds[0],
        organization_id: orgs[1],
      }),
    ])

    await use([
      { id: orgs[0], members: profileIds.map(id => ({ id })) },
      { id: orgs[1], members: [{ id: profileIds[0] }] },
    ])

    await Promise.all(
      members.map(id => API.organization.deleteOrganizationMember(id)),
    )
    await Promise.all(orgs.map(id => API.organization.deleteOrganization(id)))
    await Promise.all(profileIds.map(id => API.profile.deleteProfile(id)))
  },
})

test.use({ storageState: stateFilePath('admin') })

test('do not restrict access to a user with multiple organizations when at least on organization has access to knowledge hub @smoke', async ({
  page,
  orgs,
}) => {
  let profilesAccess = await Promise.all(
    orgs[0].members.map(member =>
      API.profile.getProfileAccessToKnowledgeHub(member.id),
    ),
  )

  profilesAccess.forEach(profile => {
    expect(profile?.canAccessKnowledgeHub).toBeTruthy()
  })

  const orgsPage = new AllOrganisations(page)
  await orgsPage.gotoOrganisation(orgs[0].id)

  orgsPage.permissionsTab.click()

  await expect(orgsPage.knowledgeHubAccessSwitch).toBeChecked()
  await orgsPage.knowledgeHubAccessSwitch.click()

  await waitForGraphQLResponse(page, 'update_organization_by_pk')
  // Await to db's org access update trigger to update the access for org's members
  await page.waitForTimeout(2000)

  profilesAccess = await Promise.all(
    orgs[0].members.map(member =>
      API.profile.getProfileAccessToKnowledgeHub(member.id),
    ),
  )

  expect(profilesAccess[0]?.canAccessKnowledgeHub).toBeTruthy()
  expect(profilesAccess[1]?.canAccessKnowledgeHub).toBeFalsy()
  expect(profilesAccess[2]?.canAccessKnowledgeHub).toBeFalsy()
})

test('restrict access to a user with multiple organizations when all organizations has restricted access to knowledge hub @smoke', async ({
  page,
  orgs,
}) => {
  let profileAccess = await API.profile.getProfileAccessToKnowledgeHub(
    orgs[0].members[0].id,
  )

  expect(profileAccess?.canAccessKnowledgeHub).toBeTruthy()

  const orgsPage = new AllOrganisations(page)
  await orgsPage.gotoOrganisation(orgs[0].id)

  orgsPage.permissionsTab.click()

  await expect(orgsPage.knowledgeHubAccessSwitch).toBeChecked()
  await orgsPage.knowledgeHubAccessSwitch.click()

  await waitForGraphQLResponse(page, 'update_organization_by_pk')
  // Await to db's org access update trigger to update the access for org's members
  await page.waitForTimeout(2000)

  profileAccess = await API.profile.getProfileAccessToKnowledgeHub(
    orgs[0].members[0].id,
  )

  expect(profileAccess?.canAccessKnowledgeHub).toBeTruthy()

  await orgsPage.gotoOrganisation(orgs[1].id)

  orgsPage.permissionsTab.click()

  await expect(orgsPage.knowledgeHubAccessSwitch).toBeChecked()
  await orgsPage.knowledgeHubAccessSwitch.click()

  await waitForGraphQLResponse(page, 'update_organization_by_pk')
  // Await to db's org access update trigger to update the access for org's members
  await page.waitForTimeout(2000)

  profileAccess = await API.profile.getProfileAccessToKnowledgeHub(
    orgs[0].members[0].id,
  )

  expect(profileAccess?.canAccessKnowledgeHub).toBeFalsy()
})
