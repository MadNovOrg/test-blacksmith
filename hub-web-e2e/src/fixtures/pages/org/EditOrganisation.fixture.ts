import { expect, Locator, Page } from '@playwright/test'

import { BasePage } from '../BasePage.fixture'

import { IndividualOrganisationPage } from './IndividualOrganisationPage.fixture'

export class EditOrganisationPage extends BasePage {
  readonly autocompleteLoading: Locator
  readonly autocompleteOption: Locator
  readonly cancelButton: Locator
  readonly saveOrgButton: Locator

  // Details
  readonly orgNameInput: Locator
  readonly sectorDropdown: Locator
  readonly orgTypeDropdown: Locator

  constructor(page: Page) {
    super(page)
    // Common locators
    this.autocompleteLoading = this.page.locator(
      '.MuiAutocomplete-popper .MuiAutocomplete-loading',
    )
    this.autocompleteOption = this.page.locator(
      '.MuiAutocomplete-popper .MuiAutocomplete-option',
    )
    this.cancelButton = this.page.locator(
      '[data-testid="create-org-form-cancel-btn"]',
    )
    this.saveOrgButton = this.page.locator(
      '[data-testid="create-org-form-submit-btn"]',
    )
    this.orgNameInput = this.page.locator('[data-testid="name"]')
    this.sectorDropdown = this.page.locator('[data-testid="sector-select"]')
    this.orgTypeDropdown = this.page.locator(
      '[data-testid="org-type-selector"]',
    )
  }

  async goto(orgId: string) {
    await this.page.goto(`/organisations/${orgId}/edit`)
  }

  async setOrgName(name: string) {
    await this.orgNameInput.clear()
    await this.orgNameInput.fill(name)
    await expect(this.autocompleteLoading).toHaveCount(0)
    await this.page.keyboard.press('Escape') // this will close tha automatically expanded org options
  }

  async setSector(sector: string) {
    await this.sectorDropdown.click()
    await this.page.locator(`[data-testid="sector-${sector}"]`).click()
  }

  async setOrgType(orgtype: string) {
    await this.orgTypeDropdown.click()
    await this.page.locator(`[data-testid="type-${orgtype}"]`).click()
  }

  async clickSaveOrganisationButton(): Promise<IndividualOrganisationPage> {
    await this.saveOrgButton.click()
    return new IndividualOrganisationPage(this.page)
  }
}
