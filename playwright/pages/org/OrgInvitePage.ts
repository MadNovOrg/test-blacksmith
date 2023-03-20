import { Locator, Page } from '@playwright/test'

import { waitForGraphQLRequest } from '../../commands'
import { AllOrganisations } from '../../pages/org/AllOrganisations'
import { BasePage } from '../BasePage'

export class OrgInvitationPage extends BasePage {
  readonly continueToOrganisationButton: Locator

  constructor(page: Page) {
    super(page)
    this.continueToOrganisationButton = this.page.locator(
      '[data-testid="invite-submit"]'
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
