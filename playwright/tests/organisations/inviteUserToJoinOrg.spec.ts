import { setTimeout } from 'timers/promises'

import { test as base } from '@playwright/test'

import { getLatestEmail } from '../../api/email-api'
import { insertOrganization, deleteOrganization } from '../../api/hasura-api'
import { users } from '../../data/users'
import { stateFilePath } from '../../hooks/global-setup'
import { EmailPage } from '../../pages/EmailPage'
import { AllOrganisations } from '../../pages/org/AllOrganisations'

const test = base.extend<{
  org: { id: string; name: string }
}>({
  org: async ({}, use) => {
    const orgName = Date.now() + ' org'
    const id = await insertOrganization({
      name: orgName,
    })
    await use({ id: id, name: orgName })
    // setting small timeout as there is some race condition
    // between finishing the test and cleaning up the data
    // don't know the reason for it
    await setTimeout(100)
    await deleteOrganization(id)
  },
})

test.use({ storageState: stateFilePath('admin') })

test('invite user to join organisation by admin', async ({
  browser,
  page,
  org,
}) => {
  //create a new org
  const orgPage = new AllOrganisations(page)
  await orgPage.goto(org.id)
  //go to newly created org
  await orgPage.clickIndividualsTab()
  await orgPage.clickInviteUserToOrg()
  //invite user2 to org
  await orgPage.enterWorkEmail(users.user2WithOrg.email)
  await orgPage.clickButtonToInviteUser()
  //go to email
  const inviteePage = await browser.newPage()
  const email = await getLatestEmail(
    users.user2WithOrg.email,
    `Join ${org.name} on Team Teach Hub`
  )
  const emailPage = new EmailPage(inviteePage)
  await emailPage.renderContent(email.html)
  const invitationPage = await emailPage.clickJoinOrganisationButton()
  await invitationPage.acceptInvitation()
  //verify user2 is added to the org
  new AllOrganisations(page)
  await orgPage.goto(org.id)
  await orgPage.clickIndividualsTab()
  await orgPage.checkUserHasJoinedOrg(
    `${users.user2WithOrg.givenName} ${users.user2WithOrg.familyName}`
  )
})
