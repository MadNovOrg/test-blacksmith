import { expect, Locator, Page } from '@playwright/test'

import { isUK } from '@qa/constants'

import { BasePage } from '../BasePage.fixture'

import { CreateOrganisationPage } from './CreateOrganisation.fixture'

export class OrganisationListPage extends BasePage {
  readonly autocompleteOption: Locator
  readonly searchTextbox: Locator
  readonly searchClearButton: Locator
  readonly sectorFilter: Locator
  readonly countryFilter: Locator
  readonly addNewOrgButton: Locator
  readonly organisationsTable: Locator
  readonly educationSectorOptionANZ: Locator
  readonly healthSectorOptionANZ: Locator
  readonly socialServicesSectorOptionANZ: Locator
  readonly educationSectorOptionUK: Locator
  readonly healthSectorOptionUK: Locator
  readonly socialServicesSectorOptionUK: Locator

  constructor(page: Page) {
    super(page)

    this.autocompleteOption = this.page.locator(
      '.MuiAutocomplete-popper .MuiAutocomplete-option',
    )
    this.searchTextbox = this.page.locator('[data-testid="FilterSearch-Input"]')
    this.searchClearButton = this.page.locator(
      '[data-testid="FilterSearch-Clear"]',
    )
    this.sectorFilter = this.page.locator('[data-testid="FilterByOrgSector"]')
    this.countryFilter = this.page.locator('[data-testid="FilterByCountry"]')
    this.addNewOrgButton = this.page.locator(
      '[data-testid="add-new-org-button"]',
    )

    this.organisationsTable = this.page.locator('[data-testid="orgs-table"]')

    this.educationSectorOptionANZ = this.page.locator(
      '[data-testid="FilterByOrgSector"] [data-testid="FilterByOrgSector-option-anz_edu"]',
    )
    this.healthSectorOptionANZ = this.page.locator(
      '[data-testid="FilterByOrgSector"] [data-testid="FilterByOrgSector-option-anz_health"]',
    )
    this.socialServicesSectorOptionANZ = this.page.locator(
      '[data-testid="FilterByOrgSector"] [data-testid="FilterByOrgSector-option-anz_ss"]',
    )
    this.educationSectorOptionUK = this.page.locator(
      '[data-testid="FilterByOrgSector"] [data-testid="FilterByOrgSector-option-edu"]',
    )
    this.healthSectorOptionUK = this.page.locator(
      '[data-testid="FilterByOrgSector"] [data-testid="FilterByOrgSector-option-hsc_child"]',
    )
    this.socialServicesSectorOptionUK = this.page.locator(
      '[data-testid="FilterByOrgSector"] [data-testid="FilterByOrgSector-option-hsc_adult"]',
    )
  }

  async goto() {
    await super.goto('organisations/list')
  }

  async clickAddNewOrgButton(): Promise<CreateOrganisationPage> {
    await this.addNewOrgButton.click()
    return new CreateOrganisationPage(this.page)
  }

  async clearSearchTextbox() {
    await this.searchClearButton.click()
    await expect(this.searchTextbox).toHaveText('')
    await this.waitForPageLoad()
  }

  async checkOrgListPage() {
    await super.waitForPageLoad()
    await expect(this.searchTextbox).toBeVisible()
    await expect(this.sectorFilter).toBeVisible()
    await expect(this.countryFilter).toBeVisible()
    await expect(this.addNewOrgButton).toBeVisible()
    await expect(this.organisationsTable).toBeVisible()
  }

  async checkSearchFilter(searchTest: string, differentOrgName: string) {
    await expect(this.organisationsTable).toContainText(differentOrgName)
    await this.searchTextbox.fill(searchTest)
    await this.waitForPageLoad()
    await expect(this.organisationsTable).toContainText(searchTest)
    await expect(this.organisationsTable).not.toContainText(differentOrgName)
  }

  async toggleSectorFilter() {
    await this.sectorFilter.click()
    await this.waitForPageLoad()
  }

  // This will allow us to check each of the sectors, regardless of the environment, and also will make it easier to clear later if we don't want to use a combination of filters
  async checkSectorFilter(sector: string, sectorText: string) {
    switch (sector) {
      case 'anz_edu':
        await this.educationSectorOptionANZ.click()
        break
      case 'anz_health':
        await this.healthSectorOptionANZ.click()
        break
      case 'anz_ss':
        await this.socialServicesSectorOptionANZ.click()
        break
      case 'edu':
        await this.educationSectorOptionUK.click()
        break
      case 'hsc_child':
        await this.healthSectorOptionUK.click()
        break
      case 'hsc_adult':
        await this.socialServicesSectorOptionUK.click()
        break
      default:
        isUK()
          ? await this.educationSectorOptionUK.click()
          : await this.educationSectorOptionANZ.click()
    }

    await this.waitForPageLoad()
    await expect(this.organisationsTable).toContainText(sectorText)
  }

  // This will allow us to clear the filters, by using the same sector that was set previously
  async clearSectorFilter(sector: string) {
    const sectorExpanded = this.sectorFilter.locator('[aria-expanded]')
    await expect(sectorExpanded).toHaveAttribute('aria-expanded', 'true')
    switch (sector) {
      case 'anz_edu':
        await this.educationSectorOptionANZ.click()
        break
      case 'anz_health':
        await this.healthSectorOptionANZ.click()
        break
      case 'anz_ss':
        await this.socialServicesSectorOptionANZ.click()
        break
      case 'edu':
        await this.educationSectorOptionUK.click()
        break
      case 'hsc_child':
        await this.healthSectorOptionUK.click()
        break
      case 'hsc_adult':
        await this.socialServicesSectorOptionUK.click()
        break
      default:
        isUK()
          ? await this.educationSectorOptionUK.click()
          : await this.educationSectorOptionANZ.click()
    }
  }

  async toggleCountryFilter() {
    await this.countryFilter.click()
    await this.waitForPageLoad()
  }

  async checkCountryFilter(country: string, countryCode: string) {
    const countryOption = this.countryFilter.locator(
      `[data-testid="FilterByCountry-option-${countryCode}"]`,
    )
    await countryOption.click()
    await this.waitForPageLoad()
    await expect(this.organisationsTable).toContainText(country)
  }

  async clearCountryFilter(countryCode: string) {
    const expandedCountryFilter = this.countryFilter.locator('[aria-expanded]')

    await expect(expandedCountryFilter).toHaveAttribute('aria-expanded', 'true')

    const countryOption = this.countryFilter.locator(
      `[data-testid="FilterByCountry-option-${countryCode}"]`,
    )
    await countryOption.click()
  }

  async expandOrganisationRow(rowIndex: number) {
    const row = this.organisationsTable.locator('tbody tr').nth(rowIndex)
    const expandButton = row
      .locator('button[data-testid^="org-row-toggle"]')
      .first()
    await expandButton.click()
  }

  async checkAffiliatesChipCount(
    rowIndex: number,
    filteredAffiliates: number,
    totalAffiliates: number,
  ) {
    const chip = this.organisationsTable
      .locator('tbody tr')
      .nth(rowIndex)
      .locator('[data-testid="affiliates-count-chip"]')
    await expect(chip).toContainText(
      `${filteredAffiliates} / ${totalAffiliates}`,
    )
  }
}
