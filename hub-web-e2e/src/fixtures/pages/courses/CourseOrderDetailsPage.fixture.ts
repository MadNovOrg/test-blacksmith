import { Locator, Page, expect } from '@playwright/test'

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
  readonly autocompleteLoading: Locator

  constructor(page: Page) {
    super(page)
    this.firstNameInput = this.page.locator('[data-testid="input-first-name"]')
    this.lastNameInput = this.page.locator('[data-testid="input-surname"]')
    this.organisationInput = this.page.locator(
      '[data-testid="org-selector"] input',
    )
    this.emailInput = this.page.locator('[data-testid="input-email"]')
    this.phoneInput = this.page.locator('[data-testid="input-phone"]')
    this.purchaseOrderInput = this.page.locator('[data-testid="input-po"]')
    this.autocompleteLoading = this.page.locator(
      '.MuiAutocomplete-popper .MuiAutocomplete-loading',
    )
    this.autocompleteOption = this.page.locator(
      '.MuiAutocomplete-popper .MuiAutocomplete-option',
    )
    this.reviewAndConfirmButton = this.page.locator(
      '[data-testid="AssignTrainers-submit"]',
    )
  }

  async selectOrganisation(name: string) {
    await this.organisationInput.fill(name)
    await this.organisationInput.click()
    await expect(this.autocompleteLoading).toHaveCount(0)
    await this.autocompleteOption.locator(`text=${name}`).first().click()
  }

  async fillInvoiceDetails(invoiceDetails: InvoiceDetails | undefined) {
    if (invoiceDetails === undefined) {
      throw 'Missing invoice details in the course object'
    }
    await this.selectOrganisation(invoiceDetails.organisation)
    await this.firstNameInput.fill(invoiceDetails.firstName)
    await this.lastNameInput.fill(invoiceDetails.lastName)
    await this.emailInput.fill(invoiceDetails.email)
    await this.phoneInput.clear()
    await this.phoneInput.fill(invoiceDetails.phone)
    invoiceDetails.purchaseOrder &&
      (await this.purchaseOrderInput.fill(invoiceDetails.purchaseOrder))
  }

  async clickReviewAndConfirmButton(): Promise<ReviewAndConfirmPage> {
    await expect(this.reviewAndConfirmButton).toBeEnabled()
    await this.reviewAndConfirmButton.click()
    return new ReviewAndConfirmPage(this.page)
  }
}
