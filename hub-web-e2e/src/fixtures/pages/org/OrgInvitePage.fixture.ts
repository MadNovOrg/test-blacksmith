import { expect, Locator, Page } from '@playwright/test'

import { waitForGraphQLRequest } from '@qa/commands'

import { BasePage } from '../BasePage.fixture'

import { AllOrganisations } from './AllOrganisations.fixture'

export class OrgInvitationPage extends BasePage {
  readonly continueToOrganisationButton: Locator
  readonly emailInput: Locator
  readonly orgAdminToggle: Locator

  constructor(page: Page) {
    super(page)
    this.continueToOrganisationButton = this.page.locator(
      '[data-testid="invite-user-submit-btn"]',
    )
    this.emailInput = this.page.locator('[data-testid="work-email-input"]')
    this.orgAdminToggle = this.page.locator('[data-testid="toggle-admin-role"]')
  }

  async goto(orgId: string): Promise<void> {
    await this.page.goto(`/organisations/${orgId}/invite`)
  }

  async checkOrgInvitePage() {
    await expect(this.emailInput).toBeVisible()
    await expect(this.orgAdminToggle).toBeVisible()
    await expect(this.continueToOrganisationButton).toBeVisible()
  }

  async fillEmails(emails: string[]) {
    await this.emailInput.click()
    emails.forEach(async email => {
      await this.emailInput.fill(email)
      await this.page.keyboard.press('Enter')
    })
  }

  async toggleOrgAdminRole() {
    await this.orgAdminToggle.click()
  }

  async inviteUserToOrg(emails: string[], isAdmin: boolean) {
    await this.fillEmails(emails)
    if (isAdmin) {
      await this.toggleOrgAdminRole()
    }
    await this.continueToOrganisationButton.click()
    await this.page.route(`**/v1/graphql`, async route => {
      const request = route.request()
      if (
        JSON.stringify(request.postDataJSON()).includes(
          'SaveOrganisationInvites',
        )
      ) {
        await route.fulfill({
          json: {
            data: {
              saveOrgInvites: {
                error: null,
                success: true,
                __typename: 'SampleOutput',
              },
            },
          },
        })
      } else {
        await route.continue()
      }
    })
  }

  async acceptInvitation(): Promise<AllOrganisations> {
    await Promise.all([
      waitForGraphQLRequest(this.page, 'AcceptOrgInvite'),
      await this.continueToOrganisationButton.click(),
    ])
    return new AllOrganisations(this.page)
  }
}
