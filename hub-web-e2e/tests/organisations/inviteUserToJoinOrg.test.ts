import { setTimeout } from 'timers/promises'

import { test as base } from '@playwright/test'

import * as API from '@qa/api'
import { UNIQUE_ORGANIZATION } from '@qa/data/organization'
import { users } from '@qa/data/users'
import { EmailPage } from '@qa/fixtures/pages/EmailPage.fixture'
import { AllOrganisations } from '@qa/fixtures/pages/org/AllOrganisations.fixture'
import { stateFilePath } from '@qa/util'

const test = base.extend<{
  org: { id: string; name: string }
}>({
  org: async ({}, use) => {
    const org = UNIQUE_ORGANIZATION()
    const id = await API.organization.insertOrganization(org)
    await use({ id: id, name: org.name })
    // setting small timeout as there is some race condition
    // between finishing the test and cleaning up the data
    // don't know the reason for it
    await setTimeout(100)
    await API.organization.deleteOrganization(id)
  },
})

test.use({ storageState: stateFilePath('admin') })

test('invite user to join organisation by admin', async ({
  browser,
  page,
  org,
}) => {
  // create a new org
  const orgPage = new AllOrganisations(page)
  await orgPage.goto(org.id)
  // go to newly created org
  await orgPage.clickIndividualsTab()
  await orgPage.clickInviteUserToOrg()
  // invite user2 to org
  await orgPage.enterWorkEmail(users.user1WithOrg.email)
  await orgPage.clickButtonToInviteUser()
  // go to email
  const inviteePage = await browser.newPage()
  const email = await API.email.getLatestEmail(
    users.user1WithOrg.email,
    'Team Teach Connect Organisation Invitation'
  )
  const emailPage = new EmailPage(inviteePage)
  await emailPage.renderContent(email.html)
  const invitationPage = await emailPage.clickJoinOrganisationButton()
  await invitationPage.acceptInvitation()
  // verify user2 is added to the org
  await orgPage.goto(org.id)
  await orgPage.clickIndividualsTab()
  await orgPage.checkUserHasJoinedOrg(
    `${users.user1WithOrg.givenName} ${users.user1WithOrg.familyName}`
  )
})
