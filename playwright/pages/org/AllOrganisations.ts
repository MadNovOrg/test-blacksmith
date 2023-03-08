import { expect, Locator, Page } from '@playwright/test'
import { Chance } from 'chance'

import { waitForPageLoad } from '../../commands'
import { BASE_URL } from '../../constants'
import { BasePage } from '../BasePage'

export class AllOrganisations extends BasePage {
  readonly seeAllOrgs: Locator
  readonly addNewOrganisation: Locator
  readonly organisationName: Locator
  readonly trustName: Locator
  readonly line1: Locator
  readonly city: Locator
  readonly country: Locator
  readonly postCode: Locator
  readonly workEmail: Locator
  readonly saveOrganisation: Locator
  readonly organisationSummaryTable: Locator
  readonly inputtedOrgName: string

  constructor(page: Page) {
    super(page)
    this.seeAllOrgs = this.page.locator('[data-testid="see-all-organisations"]')
    this.addNewOrganisation = this.page.locator(
      '[data-testid="add-new-org-button"]'
    )
    this.organisationName = this.page.locator('[data-testid="org-name"] input')
    this.trustName = this.page.locator('[data-testid="trust-name"]')
    this.line1 = this.page.locator('[data-testid="addr-line1"]')
    this.city = this.page.locator('[data-testid="city"]')
    this.country = this.page.locator('[data-testid="country"]')
    this.postCode = this.page.locator('[data-testid="postCode"]')
    this.workEmail = this.page.locator('[data-testid="input-admin-email"]')
    this.saveOrganisation = this.page.locator(
      '[data-testid="create-org-form-submit-btn"]'
    )
    this.organisationSummaryTable = this.page.locator(
      '[data-testid="organisation-summary-table"]'
    )
    this.inputtedOrgName = `org ${Date.now()}`
  }

  async goto() {
    await this.page.goto(`${BASE_URL}/organisations/all`)
  }

  async gotoOrganisation(id: string) {
    await this.page.goto(`${BASE_URL}/organisations/${id}`)
    await waitForPageLoad(this.page)
  }

  async clickSeeAllOrganisations() {
    await this.seeAllOrgs.click()
  }
  async clickNewOrganisation() {
    await this.addNewOrganisation.click()
  }

  async addNewOrganisationName() {
    await this.organisationName.fill(this.inputtedOrgName)
  }

  chance = new Chance()
  async addTrustName() {
    const trustName = this.chance.word()
    await this.trustName.type(trustName)
  }
  async addLine1() {
    const line1 = this.chance.address()
    await this.line1.type(line1)
  }
  async addCity() {
    const city = this.chance.city()
    await this.city.type(city)
  }
  async addCountry() {
    const country = this.chance.country()
    await this.country.type(country)
  }
  async addPostCode() {
    const postCode = this.chance.postcode()
    await this.postCode.type(postCode)
  }
  async addWorkEmail() {
    const workEmail = this.chance.email()
    await this.workEmail.type(workEmail)
  }
  async clickSaveOrganisation() {
    await this.saveOrganisation.click()
  }
  async findNewOrg() {
    await expect(this.organisationSummaryTable).toContainText(
      this.inputtedOrgName
    )
    await this.page
      .getByRole('link', { name: this.inputtedOrgName })
      .first()
      .click()
  }

  async checkNewOrgPage() {
    await expect(this.page.getByTestId('org-title')).toHaveText(
      this.inputtedOrgName
    )
  }
}
