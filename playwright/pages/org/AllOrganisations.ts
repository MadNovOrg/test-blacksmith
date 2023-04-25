import { expect, Locator, Page } from '@playwright/test'
import { Chance } from 'chance'
import { v4 as uuidv4 } from 'uuid'
import { readFile } from 'xlsx'

import { Go1_History_Events_Enum } from '@app/generated/graphql'

import { User } from '../../data/types'
import { BasePage } from '../BasePage'

import { EditUserModal } from './EditUserModal'

export class AllOrganisations extends BasePage {
  readonly addNewOrganisation: Locator
  readonly blendedLicences: Locator
  readonly city: Locator
  readonly country: Locator
  readonly exportHistory: Locator
  readonly invoiceNote: Locator
  readonly invoiceNumber: Locator
  readonly inputtedOrgName: string
  readonly licencesRemaining: Locator
  readonly line1: Locator
  readonly manageRemainingLicences: Locator
  readonly numberOfLicences: Locator
  readonly organisationName: Locator
  readonly organisationSummaryTable: Locator
  readonly postCode: Locator
  readonly removeCheckbox: Locator
  readonly saveDetails: Locator
  readonly saveOrganisation: Locator
  readonly seeAllOrgs: Locator
  readonly trustName: Locator
  readonly workEmail: Locator
  readonly individualsTab: Locator
  readonly inviteUserButton: Locator
  readonly inviteOrgWorkEmail: Locator
  readonly confirmInviteUsers: Locator
  readonly orgTable: Locator
  readonly editUserButton: Locator
  readonly organisationMembersTable: Locator
  readonly organisationTitle: Locator

  constructor(page: Page) {
    super(page)
    this.addNewOrganisation = this.page.locator(
      '[data-testid="add-new-org-button"]'
    )
    this.blendedLicences = this.page.locator('data-testid=org-blended-licences')
    this.city = this.page.locator('[data-testid="city"]')
    this.country = this.page.locator('[data-testid="country"]')
    this.exportHistory = this.page.locator('data-testid=export-history')
    this.invoiceNote = this.page.locator('text=Add a note (optional)')
    this.invoiceNumber = this.page.locator('text=Invoice number *')
    this.inputtedOrgName = `org ${uuidv4()}`
    this.licencesRemaining = this.page.locator('data-testid=licenses-remaining')
    this.line1 = this.page.locator('[data-testid="addr-line1"]')
    this.manageRemainingLicences = this.page.locator(
      'data-testid=manage-remaining-licences'
    )
    this.numberOfLicences = this.page.locator('text=Number of licences *')
    this.organisationName = this.page.locator('[data-testid="org-name"] input')
    this.organisationSummaryTable = this.page.locator(
      '[data-testid="organisation-summary-table"]'
    )
    this.postCode = this.page.locator('[data-testid="postCode"]')
    this.removeCheckbox = this.page.locator(
      'data-testid=licence-remove-checkbox'
    )
    this.saveDetails = this.page.locator('data-testid=licence-save-details')
    this.saveOrganisation = this.page.locator(
      '[data-testid="create-org-form-submit-btn"]'
    )
    this.seeAllOrgs = this.page.locator('[data-testid="see-all-organisations"]')
    this.trustName = this.page.locator('[data-testid="trust-name"]')
    this.workEmail = this.page.locator('[data-testid="input-admin-email"]')
    this.individualsTab = this.page.locator('[data-testid="org-individuals"]')
    this.inviteUserButton = this.page.locator(
      '[data-testid="invite-user-to-org"]'
    )
    this.inviteOrgWorkEmail = this.page.locator('text=Work email *')
    this.confirmInviteUsers = this.page.locator(
      '[data-testid="invite-user-submit-btn"]'
    )
    this.orgTable = this.page.locator('tbody tr >> nth=0')
    this.editUserButton = this.page.locator('[data-testid=edit-user-button]')
    this.organisationMembersTable = this.page.locator(
      '[data-testid=organisation-members]'
    )
    this.organisationTitle = this.page.locator('[data-testid=org-title]')
  }

  async goto(orgId?: string) {
    await super.goto(`organisations/${orgId ? orgId : 'all'}`)
  }

  async gotoOrganisation(id: string) {
    await super.goto(`organisations/${id}`)
  }

  async clickSeeAllOrganisations() {
    await this.seeAllOrgs.click()
  }
  async clickNewOrganisation() {
    await this.addNewOrganisation.click()
  }

  async addNewOrganisationName(): Promise<string> {
    await this.organisationName.fill(this.inputtedOrgName)
    return this.inputtedOrgName
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
    await expect(this.organisationTitle).toHaveText(this.inputtedOrgName)
  }

  async clickBlendedLearningLicences() {
    await this.blendedLicences.click()
  }

  async expectLicencesRemaining(amount: string) {
    await expect(this.licencesRemaining).toHaveText(amount)
  }

  async clickManageButton() {
    await this.manageRemainingLicences.click()
  }

  async fillNumberOfLicences(amount: string) {
    await this.numberOfLicences.fill(amount)
  }

  async fillInvoiceNumber(invoiceNumber: string) {
    await this.invoiceNumber.fill(invoiceNumber)
  }

  async fillInvoiceNotes(note: string) {
    await this.invoiceNote.fill(note)
  }

  async clickSaveDetails() {
    await this.saveDetails.click()
    await super.waitForPageLoad()
  }

  async checkRemoveCheckbox() {
    await this.removeCheckbox.check()
  }

  async checkExportOfLicences() {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.exportHistory.click(),
    ])
    const downloadPath = (await download.path()) as string
    const workbook = readFile(downloadPath)
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    // Heading Row
    expect(sheet['A1'].v).toBe('Date')
    expect(sheet['B1'].v).toBe('Event')
    expect(sheet['C1'].v).toBe('Invoice number')
    expect(sheet['D1'].v).toBe('Course code')
    expect(sheet['E1'].v).toBe('Course start date')
    expect(sheet['F1'].v).toBe('Note')
    expect(sheet['G1'].v).toBe('Invoked by')
    expect(sheet['H1'].v).toBe('Action')
    expect(sheet['I1'].v).toBe('Balance')
    expect(sheet['J1'].v).toBe('Reserved balance')
    expect(sheet['K1'].v).toBe('Cost per licence')
    // Content
    expect(sheet['B2'].v).toBe(Go1_History_Events_Enum.LicensesAdded)
    expect(sheet['C2'].v).toBe('INV.001')
    expect(sheet['G2'].v).toBe('John Doe')
    expect(sheet['H2'].v).toEqual('+10')
    expect(sheet['I2'].v).toEqual(10)
    expect(sheet['J2'].v).toEqual(0)
  }

  async clickIndividualsTab() {
    await this.individualsTab.click()
  }

  async clickInviteUserToOrg() {
    await this.inviteUserButton.click()
  }

  async enterWorkEmail(email: string) {
    await this.inviteOrgWorkEmail.type(email)
  }

  async clickButtonToInviteUser() {
    await this.confirmInviteUsers.click()
  }

  async checkUserHasJoinedOrg(name: string) {
    await expect(this.orgTable).toContainText(name)
  }

  async clickEditUserButton() {
    await this.editUserButton.click()
    return new EditUserModal(this.page)
  }

  async checkOrganisationUserExists(user: User, exists: boolean) {
    if (exists) {
      await expect(this.organisationMembersTable).toContainText(
        `${user.givenName} ${user.familyName}`
      )
    } else {
      await expect(this.organisationMembersTable).not.toContainText(
        `${user.givenName} ${user.familyName}`
      )
    }
  }
}
