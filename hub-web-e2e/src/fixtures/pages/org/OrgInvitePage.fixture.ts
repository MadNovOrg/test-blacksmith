import { Locator, Page } from '@playwright/test'

import { waitForGraphQLRequest } from '@qa/commands'

import { BasePage } from '../BasePage.fixture'

import { AllOrganisations } from './AllOrganisations.fixture'

export class OrgInvitationPage extends BasePage {
  readonly continueToOrganisationButton: Locator

  constructor(page: Page) {
    super(page)
    this.continueToOrganisationButton = this.page.locator(
      '[data-testid="invite-submit"]',
    )
  }
  async acceptInvitation(): Promise<AllOrganisations> {
    await Promise.all([
      waitForGraphQLRequest(this.page, 'AcceptOrgInvite'),
      await this.continueToOrganisationButton.click(),
    ])
    return new AllOrganisations(this.page)
  }
}
