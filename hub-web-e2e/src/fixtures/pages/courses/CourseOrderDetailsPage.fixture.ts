import { Locator, Page } from '@playwright/test'

import { InvoiceDetails } from '@qa/data/types'

import { BasePage } from '../BasePage.fixture'

import { ReviewAndConfirmPage } from './ReviewAndConfirmPage.fixture'

export class CourseOrderDetailsPage extends BasePage {
  readonly firstNameInput: Locator
  readonly lastNameInput: Locator
  readonly organisationInput: Locator
  readonly emailInput: Locator
  readonly phoneInput: Locator
  readonly purchaseOrderInput: Locator
  readonly autocompleteOption: Locator
  readonly reviewAndConfirmButton: Locator

  constructor(page: Page) {
    super(page)
    this.firstNameInput = this.page.locator('[data-testid="input-first-name"]')
    this.lastNameInput = this.page.locator('[data-testid="input-surname"]')
    this.organisationInput = this.page.locator(
      '[data-testid="org-selector"] input'
    )
    this.emailInput = this.page.locator('[data-testid="input-email"]')
    this.phoneInput = this.page.locator('[data-testid="input-phone"]')
    this.purchaseOrderInput = this.page.locator('[data-testid="input-po"]')
    this.autocompleteOption = this.page.locator(
      '.MuiAutocomplete-popper .MuiAutocomplete-option'
    )
    this.reviewAndConfirmButton = this.page.locator(
      '[data-testid="AssignTrainers-submit"]'
    )
  }

  async selectOrganisation(name: string) {
    await this.organisationInput.type(name)
    await this.page.waitForResponse(
      resp => resp.url().includes('/v1/graphql') && resp.status() === 200
    )
    await this.autocompleteOption.locator(`text=${name}`).first().click()
  }

  async fillInvoiceDetails(invoiceDetails: InvoiceDetails | undefined) {
    if (invoiceDetails === undefined) {
      throw 'Missing invoice details in the course object'
    }
    await this.selectOrganisation(invoiceDetails.organisation)
    await this.firstNameInput.type(invoiceDetails.firstName)
    await this.lastNameInput.type(invoiceDetails.lastName)
    await this.emailInput.type(invoiceDetails.email)
    await this.phoneInput.fill(invoiceDetails.phone)
    invoiceDetails.purchaseOrder &&
      (await this.purchaseOrderInput.type(invoiceDetails.purchaseOrder))
  }

  async clickReviewAndConfirmButton(): Promise<ReviewAndConfirmPage> {
    await this.reviewAndConfirmButton.click()
    return new ReviewAndConfirmPage(this.page)
  }
}
