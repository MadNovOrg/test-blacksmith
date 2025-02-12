/* eslint-disable playwright/no-conditional-in-test */
/* eslint-disable playwright/expect-expect */
/* eslint-disable playwright/no-skipped-test */
import { test as base } from '@playwright/test'

import { InviteStatus } from '@app/generated/graphql'

import * as API from '@qa/api'
import { users } from '@qa/data/users'
import { IndividualOrganisationPage } from '@qa/fixtures/pages/org/IndividualOrganisationPage.fixture'
import { stateFilePath, StoredCredentialKey } from '@qa/util'

const allowedUsers = ['admin', 'ops', 'salesAdmin']

allowedUsers.forEach(allowedUser => {
  const dataSet = [
    {
      user: `${allowedUser}`,
      smoke: allowedUser === 'admin' ? '@smoke' : '',
      orgName: 'Australia Main Organisation',
      isAffiliated: false,
    },
  ]

  for (const data of dataSet) {
    const test = base.extend<{
      org: {
        id: string
        members: { id: string }[]
        invites: { id: string }[]
      }
    }>({
      org: async ({}, use) => {
        const orgId = await API.organization.getOrganizationId(data.orgName)
        const orgMemberId = await API.organization.insertOrganizationMember({
          organization_id: orgId,
          profile_id: users.user1.id,
        })
        const orgInviteId = await API.organization.insertOrganizationInvite({
          orgId: orgId,
          profileId: users.user2.id,
          email: users.user2.email,
          status: InviteStatus.Pending,
          isAdmin: false,
        })

        await use({
          id: orgId,
          members: [{ id: orgMemberId }],
          invites: [{ id: orgInviteId }],
        })

        await Promise.all([
          API.organization.deleteOrganizationMember(orgMemberId),
          API.organization.deleteOrganizationInvite(orgInviteId),
        ])
      },
    })
    test(`View org individuals tab as ${data.user} ${data.smoke}`, async ({
      browser,
      org,
    }) => {
      const context = await browser.newContext({
        storageState: stateFilePath(data.user as StoredCredentialKey),
      })
      const page = await context.newPage()

      const individualOrgPage = new IndividualOrganisationPage(page)
      await individualOrgPage.goto(org.id)

      await individualOrgPage.checkIndividualsTab()
    })

    test(`Edit org member as ${data.user} ${data.smoke}`, async ({
      browser,
      org,
    }) => {
      const context = await browser.newContext({
        storageState: stateFilePath(data.user as StoredCredentialKey),
      })
      const page = await context.newPage()

      const individualOrgPage = new IndividualOrganisationPage(page)
      await individualOrgPage.goto(org.id)
      await individualOrgPage.clickIndividualsTab()

      await individualOrgPage.makeUserOrgAdmin(org.members[0].id)
    })

    test(`Remove org member as ${data.user} ${data.smoke}`, async ({
      browser,
      org,
    }) => {
      const context = await browser.newContext({
        storageState: stateFilePath(data.user as StoredCredentialKey),
      })
      const page = await context.newPage()

      const individualOrgPage = new IndividualOrganisationPage(page)
      await individualOrgPage.goto(org.id)
      await individualOrgPage.clickIndividualsTab()

      await individualOrgPage.removeUserFromOrg(org.members[0].id)
    })

    test(`Invite user to org as ${data.user} ${data.smoke}`, async ({
      browser,
      org,
    }) => {
      const context = await browser.newContext({
        storageState: stateFilePath(data.user as StoredCredentialKey),
      })
      const page = await context.newPage()

      const individualOrgPage = new IndividualOrganisationPage(page)
      await individualOrgPage.goto(org.id)
      await individualOrgPage.clickIndividualsTab()
      const invitesPage = await individualOrgPage.clickInviteUserToOrg()
      await invitesPage.checkOrgInvitePage()
      await invitesPage.inviteUserToOrg([users.user2WithOrg.email], false)
      let inviteId = await API.organization.getOrgInviteId(
        org.id,
        users.user2WithOrg.email,
      )
      if (!inviteId) {
        inviteId = await API.organization.insertOrganizationInvite({
          orgId: org.id,
          profileId: users.user2WithOrg.id,
          email: users.user2WithOrg.email,
          status: InviteStatus.Pending,
          isAdmin: false,
        })
      }

      await individualOrgPage.redirectToInvitesTab(org.id)
      await individualOrgPage.checkInvitesTab()
      // We need to invite the user manually, as this is done in BE, and it will fail on github actions
      await individualOrgPage.checkUserIsInvited(
        inviteId,
        users.user2WithOrg.email,
      )
      API.organization.deleteOrganizationInvite(inviteId)
    })

    test(`Cancel org invite as ${data.user} ${data.smoke}`, async ({
      browser,
      org,
    }) => {
      const context = await browser.newContext({
        storageState: stateFilePath(data.user as StoredCredentialKey),
      })
      const page = await context.newPage()

      const individualOrgPage = new IndividualOrganisationPage(page)
      await individualOrgPage.goto(org.id)
      await individualOrgPage.clickIndividualsTab()
      await individualOrgPage.checkInvitesTab()

      await individualOrgPage.checkUserIsInvited(
        org.invites[0].id,
        users.user2.email,
      )

      await individualOrgPage.cancelOrganisationInvite(org.invites[0].id)
      await individualOrgPage.checkUserIsNotInvited(users.user2.id)
    })
  }
})
