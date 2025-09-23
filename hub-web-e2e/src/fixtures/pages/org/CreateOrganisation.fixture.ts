import { expect, Locator, Page } from '@playwright/test'

import { Organization } from '@app/generated/graphql'

import { waitForGraphQLResponse } from '@qa/commands'
import { isUK } from '@qa/constants'
import { isAustraliaOrNewZealandCountry } from '@qa/util'

import { BasePage } from '../BasePage.fixture'

export class CreateOrganisationPage extends BasePage {
  readonly autocompleteLoading: Locator
  readonly autocompleteOption: Locator
  readonly cancelButton: Locator
  readonly saveOrgButton: Locator

  //Address
  readonly countrySelector: Locator
  readonly regionSelector: Locator
  readonly addressLine1Input: Locator
  readonly addressLine2Input: Locator
  readonly cityInput: Locator
  readonly postCdeInput: Locator

  // Details
  readonly orgNameInput: Locator
  readonly linkToOtherOrgCheckbox: Locator
  readonly mainOrgSelector: Locator
  readonly sectorDropdown: Locator
  readonly orgTypeDropdown: Locator
  readonly otherOrgTypeInput: Locator
  readonly orgPhoneInput: Locator
  readonly orgEmailInput: Locator
  readonly orgWebsiteInput: Locator

  //Main contact
  readonly mainFirstNameInput: Locator
  readonly mainLastNameInput: Locator
  readonly mainEmailInput: Locator
  readonly settingNameInput: Locator
  readonly localAuthorityDropdown: Locator
  readonly ofstedRatingDropdown: Locator

  // Org Admin
  readonly orgAdminEmailInput: Locator

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
    this.countrySelector = this.page.locator(
      '[data-testid="countries-selector-autocomplete"] input',
    )
    this.addressLine1Input = this.page.locator('[data-testid="addr-line1"]')
    this.addressLine2Input = this.page.locator('[data-testid="addr-line2"]')
    this.cityInput = this.page.locator('[data-testid="city"]')
    this.postCdeInput = this.page.locator('[data-testid="postCode"]')
    this.orgNameInput = this.page.locator('[data-testid="name"] input')
    this.sectorDropdown = this.page.locator('[data-testid="sector-select"]')
    this.orgTypeDropdown = this.page.locator(
      '[data-testid="org-type-selector"]',
    )
    this.otherOrgTypeInput = this.page.locator('[data-testid="other-org-type"]')
    this.orgPhoneInput = this.page.locator('[data-testid="org-phone"]')
    this.orgEmailInput = this.page.locator('[data-testid="org-email"]')
    this.orgWebsiteInput = this.page.locator('[data-testid="website"]')
    this.mainFirstNameInput = this.page.locator(
      '[data-testid="head-first-name"]',
    )
    this.mainLastNameInput = this.page.locator('[data-testid="head-last-name"]')
    this.mainEmailInput = this.page.locator('[data-testid="main-email"]')
    this.settingNameInput = this.page.locator(
      '[data-testid="head-preferred-job-title"]',
    )
    this.orgAdminEmailInput = this.page.locator(
      '[data-testid="input-admin-email"]',
    )

    // UK specific locators
    this.localAuthorityDropdown = this.page.locator(
      '[data-testid="head-preferred-job-title"]',
    )
    this.ofstedRatingDropdown = this.page.locator(
      '[data-testid="ofsted-rating-select"]',
    )

    // ANZ specific locators
    this.regionSelector = this.page.locator('[data-testid="region-selector"]')
    this.linkToOtherOrgCheckbox = this.page.locator(
      '[data-testid="link-to-main-org-checkbox"] input',
    )
    this.mainOrgSelector = this.page.locator('[data-testid="main-org"] input')
  }

  async goto() {
    await super.goto('organisations/new')
  }

  async selectCountry(country: string) {
    await this.countrySelector.clear()
    await this.countrySelector.fill(country)
    await this.autocompleteOption.locator(`text=${country}`).first().click()
  }

  async selectRegion(region: string) {
    await this.regionSelector.click()
    const regionOption = this.page.locator(
      `[data-testid="region-option-${region}"]`,
    )
    await expect(regionOption).toBeVisible()
    await regionOption.click()
  }

  async fillAddress(org: Organization) {
    await this.selectCountry(org.address.country)
    if (isAustraliaOrNewZealandCountry(org.address.countryCode)) {
      await this.selectRegion(org.address.region)
    }
    await this.addressLine1Input.fill(org.address.line1)
    await this.addressLine2Input.fill(org.address.line2)
    await this.cityInput.fill(org.address.city)
    await this.postCdeInput.fill(org.address.postCode)
  }

  async setOrgName(name: string) {
    await this.orgNameInput.fill(name)
    await expect(this.autocompleteLoading).toHaveCount(0)
    await this.page.keyboard.press('Escape') // this will close tha automatically expanded org options
  }

  async toggleLinkToMainOrg() {
    await this.linkToOtherOrgCheckbox.click()
  }

  async setMainOrg(mainOrgName: string) {
    await this.mainOrgSelector.fill(mainOrgName)
    await this.mainOrgSelector.click()
    await expect(this.autocompleteLoading).toHaveCount(0)
    await this.page.keyboard.press('ArrowDown')
    await this.page.keyboard.press('Enter')
  }

  async setSector(sector: string) {
    await this.sectorDropdown.click()
    await this.page.locator(`[data-testid="sector-${sector}"]`).click()
  }

  async setOrgType(orgtype: string) {
    await this.orgTypeDropdown.click()
    await this.page.locator(`[data-testid="type-${orgtype}"]`).click()
  }

  async setOtherOrgType(otherOrgType: string) {
    await expect(this.otherOrgTypeInput).toBeVisible()
    await this.otherOrgTypeInput.fill(otherOrgType)
  }

  async setOrgPhone(phone: string) {
    await this.orgPhoneInput.clear()
    await this.orgPhoneInput.fill(phone)
  }
  async setOrgEmail(email: string) {
    await this.orgEmailInput.fill(email)
  }
  async setOrgWebsite(website: string) {
    await this.orgWebsiteInput.fill(website)
  }

  async setOrgDetails(
    org: Organization,
    isAffiliatedOrg: boolean,
    mainOrgName?: string,
    otherOrgType?: string,
  ) {
    await this.setOrgName(org.name)
    if (!isAffiliatedOrg && !isUK()) {
      await this.toggleLinkToMainOrg()
    }
    if (mainOrgName) {
      await this.setMainOrg(mainOrgName)
    }
    await this.setSector(org.sector ?? '')
    await this.setOrgType(org.organisationType ?? '')
    if (org.organisationType === 'Other') {
      await this.setOtherOrgType(
        otherOrgType ?? 'Only God knows what shady business this org does',
      )
    }
    await this.setOrgPhone(org.attributes?.phone)
    await this.setOrgEmail(org.attributes?.email)
    await this.setOrgWebsite(org.attributes?.website)
  }

  async setMainContactDetails(org: Organization) {
    //Only ANZ for now
    await this.mainFirstNameInput.fill(org.attributes?.headFirstName)
    await this.mainLastNameInput.fill(org.attributes?.headSurname)
    await this.mainEmailInput.fill(org.attributes?.headEmailAddress)
    await this.settingNameInput.fill(org.attributes?.settingName)
  }
  async setOrgAdminEmail(email: string) {
    await this.orgAdminEmailInput.fill(email)
  }

  async clickSaveOrganisationButton() {
    await this.saveOrgButton.click()
  }

  async checkCommonFields() {
    await expect(this.countrySelector).toBeVisible()
    await expect(this.addressLine1Input).toBeVisible()
    await expect(this.addressLine2Input).toBeVisible()
    await expect(this.cityInput).toBeVisible()
    await expect(this.postCdeInput).toBeVisible()
    await expect(this.orgNameInput).toBeVisible()
    await expect(this.sectorDropdown).toBeVisible()
    await expect(this.orgTypeDropdown).toBeVisible()
    await expect(this.orgPhoneInput).toBeVisible()
    await expect(this.orgEmailInput).toBeVisible()
    await expect(this.orgWebsiteInput).toBeVisible()
    await expect(this.mainFirstNameInput).toBeVisible()
    await expect(this.mainLastNameInput).toBeVisible()
    await expect(this.mainEmailInput).toBeVisible()
    await expect(this.settingNameInput).toBeVisible()
    await expect(this.orgAdminEmailInput).toBeVisible()
    await expect(this.cancelButton).toBeVisible()
    await expect(this.saveOrgButton).toBeVisible()
  }

  async checkSpecificUKFields() {
    await expect(this.localAuthorityDropdown).toBeVisible()
    await expect(this.ofstedRatingDropdown).toBeVisible()
  }

  async checkSpecificANZFields() {
    await expect(this.regionSelector).toBeVisible()
    await expect(this.linkToOtherOrgCheckbox).toBeVisible()
    await expect(this.mainOrgSelector).toBeVisible()
  }

  async fillOrgDetails(
    org: Organization,
    isAffiliatedOrg: boolean,
    mainOrgName?: string,
    otherOrgType?: string,
    orgAdminEmail?: string,
  ) {
    await this.fillAddress(org)
    await this.setOrgDetails(org, isAffiliatedOrg, mainOrgName, otherOrgType)
    await this.setMainContactDetails(org)
    if (orgAdminEmail) {
      await this.setOrgAdminEmail(orgAdminEmail)
    }
  }

  async getOrgIdOnCreation(): Promise<string> {
    const responses = await Promise.all([
      waitForGraphQLResponse(this.page, 'org'),
      this.saveOrgButton.click(),
    ])
    return responses[0].org.id
  }
}
