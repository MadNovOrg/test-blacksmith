import { test } from '@playwright/test'

import { getLatestEmail } from '../../api/email-api'
import { users } from '../../data/users'
import { stateFilePath } from '../../hooks/global-setup'
import { EmailPage } from '../../pages/EmailPage'
import { AllOrganisations } from '../../pages/org/AllOrganisations'

test.use({ storageState: stateFilePath('admin') })

test('invite user to join organisation by admin', async ({ browser, page }) => {
  //create a new org
  const orgPage = new AllOrganisations(page)
  await orgPage.goto()
  await orgPage.clickSeeAllOrganisations()
  await orgPage.clickNewOrganisation()
  await orgPage.addNewOrganisationName()
  await orgPage.addTrustName()
  await orgPage.addLine1()
  await orgPage.addCity()
  await orgPage.addCountry()
  await orgPage.addPostCode()
  await orgPage.addWorkEmail()
  await orgPage.clickSaveOrganisation()
  await orgPage.goto()
  await orgPage.findNewOrg()
  //go to newly created org
  await orgPage.checkNewOrgPage()
  await orgPage.clickIndividualsTab()
  await orgPage.clickInviteUserToOrg()
  //invite user2 to org
  await orgPage.enterWorkEmail(users.user2WithOrg.email)
  await orgPage.clickButtonToInviteUser()
  //go to email
  const inviteePage = await browser.newPage()
  const email = await getLatestEmail(users.user2WithOrg.email)
  const emailPage = new EmailPage(inviteePage)
  await emailPage.renderContent(email.html)
  const invitationPage = await emailPage.clickJoinOrganisationButton()
  await invitationPage.acceptInvitation()
  //verify user2 is added to the org
  new AllOrganisations(page)
  await orgPage.goto()
  await orgPage.findNewOrg()
  await orgPage.checkNewOrgPage()
  await orgPage.clickIndividualsTab()
  await orgPage.checkUserHasJoinedOrg('James Participant')
})
