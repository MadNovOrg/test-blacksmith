import { expect, Locator, Page } from '@playwright/test'
import { concat } from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import { readFile } from 'xlsx'

import { Go1_Licenses_History_Set_Input } from '@app/generated/graphql'

import { getOrganisationProifiles } from '@qa/util'

import { BasePage } from '../BasePage.fixture'

import { OrganisationListPage } from './OrganisationsList.fixture'

export class AllOrganisations extends BasePage {
  readonly activeCertificationsChip: Locator
  readonly onHoldCertificationsChip: Locator
  readonly expiringSoonCertificationsChip: Locator
  readonly expiredRecentlyCertificationsChip: Locator
  readonly individualsByLevelTabList: Locator
  readonly advancedCertifications: Locator
  readonly advancedTrainerTab: Locator
  readonly advancedTrainerCertifications: Locator
  readonly orgSummaryTable: Locator
  readonly addNewOrganisation: Locator
  readonly autocompleteOption: Locator
  readonly blendedLicences: Locator
  readonly city: Locator
  readonly country: Locator
  readonly email: Locator
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
  readonly phone: Locator
  readonly postCode: Locator
  readonly removeCheckbox: Locator
  readonly saveDetails: Locator
  readonly saveOrganisation: Locator
  readonly sector: Locator
  readonly seeAllOrgs: Locator
  readonly seeAllCourses: Locator
  readonly searchAvailableCourses: Locator
  readonly bookNow: Locator
  readonly joinWaitingList: Locator
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
  readonly type: Locator
  readonly permissionsTab: Locator
  readonly knowledgeHubAccessSwitch: Locator

  constructor(page: Page) {
    super(page)
    this.addNewOrganisation = this.page.locator(
      '[data-testid="add-new-org-button"]',
    )
    this.autocompleteOption = this.page.locator(
      '.MuiAutocomplete-popper .MuiAutocomplete-option',
    )
    this.blendedLicences = this.page.locator('data-testid=org-blended-licences')
    this.city = this.page.locator('[data-testid="city"]')
    this.country = this.page.locator(
      '[data-testid="countries-selector-autocomplete"] input',
    )
    this.email = this.page.locator('data-testid=org-email')
    this.exportHistory = this.page.locator('data-testid=export-history')
    this.invoiceNote = this.page.locator('text=Add a note (optional)')
    this.invoiceNumber = this.page.locator('text=Invoice number *')
    this.inputtedOrgName = `org ${uuidv4()}`
    this.licencesRemaining = this.page.locator('data-testid=licenses-remaining')
    this.line1 = this.page.locator('[data-testid="addr-line1"]')
    this.manageRemainingLicences = this.page.locator(
      'data-testid=manage-remaining-licences',
    )
    this.numberOfLicences = this.page.locator('text=Number of licences *')
    this.organisationName = this.page.locator('[data-testid="org-name"] input')
    this.organisationSummaryTable = this.page.locator(
      '[data-testid="organisation-summary-table"]',
    )
    this.phone = this.page.locator('data-testid=org-phone')
    this.postCode = this.page.locator('[data-testid="postCode"]')
    this.removeCheckbox = this.page.locator(
      'data-testid=licence-remove-checkbox',
    )
    this.saveDetails = this.page.locator('data-testid=licence-save-details')
    this.saveOrganisation = this.page.locator(
      '[data-testid="create-org-form-submit-btn"]',
    )
    this.sector = this.page.locator('data-testid=sector-select')
    this.seeAllOrgs = this.page.locator('[data-testid="see-all-organisations"]')
    this.seeAllCourses = this.page.locator('[data-testId="see-all-courses"]')
    this.searchAvailableCourses = this.page.locator(
      '[data-testid="FilterSearch-Input"]',
    )
    this.bookNow = this.page.locator('button:has-text("Book now")')
    this.joinWaitingList = this.page.locator(
      'button:has-text("Join waiting list")',
    )
    this.trustName = this.page.locator('[data-testid="trust-name"]')
    this.workEmail = this.page.locator('[data-testid="input-admin-email"]')
    this.individualsTab = this.page.locator('[data-testid="org-individuals"]')
    this.inviteUserButton = this.page.locator(
      '[data-testid="invite-user-to-org"]',
    )
    this.inviteOrgWorkEmail = this.page.locator('text=Work email *')
    this.confirmInviteUsers = this.page.locator(
      '[data-testid="invite-user-submit-btn"]',
    )
    this.orgTable = this.page.locator('tbody tr >> nth=0')
    this.editUserButton = this.page.locator('[data-testid=edit-user-button]')
    this.organisationMembersTable = this.page.locator(
      '[data-testid=organisation-members]',
    )
    this.organisationTitle = this.page.locator('[data-testid="org-title"]')
    this.type = this.page.locator('data-testid=org-type-selector')
    this.permissionsTab = this.page.locator('[data-testid="org-permissions"]')
    this.knowledgeHubAccessSwitch = this.page.locator(
      '[data-testid="org-knowledge-hub-access-switch"]',
    )
    this.activeCertificationsChip = this.page.locator(
      '[data-testid="active-certifications"]',
    )
    this.onHoldCertificationsChip = this.page.locator(
      '[data-testid="on-hold-certifications"]',
    )
    this.expiringSoonCertificationsChip = this.page.locator(
      '[data-testid="expiring-soon-certifications"]',
    )
    this.expiredRecentlyCertificationsChip = this.page.locator(
      '[data-testid="expired-recently-certifications"]',
    )
    this.individualsByLevelTabList = this.page.locator(
      '[data-testid="individuals-by-level-tab-list"]',
    )
    this.advancedCertifications = this.page.locator(
      '[data-testid="tab-panel-ADVANCED"]',
    )
    this.advancedTrainerTab = this.page.locator(
      '[data-testid="tab-ADVANCED_TRAINER"]',
    )
    this.advancedTrainerCertifications = this.page.locator(
      '[data-testid="tab-panel-ADVANCED_TRAINER"]',
    )
    this.orgSummaryTable = this.page.locator(
      '[data-testid="organisation-summary-table"]',
    )
  }

  async goto(orgId?: string) {
    await this.page.route(`**/v1/graphql`, async route => {
      const request = route.request()
      if (
        !orgId &&
        JSON.stringify(request.postDataJSON()).includes(
          'GetOrganizationProfiles',
        )
      ) {
        await route.fulfill({
          json: getOrganisationProifiles(),
        })
      } else {
        await route.continue()
      }
    })
    await super.goto(`organisations/${orgId ?? 'all'}`)
  }

  async gotoOrganisation(id: string) {
    await super.goto(`organisations/${id}`)
  }
  async clickSeeAllCourses() {
    await this.seeAllCourses.click()
  }
  async clickSearchAvailableCourses() {
    await this.searchAvailableCourses.click()
  }

  async insertCourseId(courseId: string) {
    await this.searchAvailableCourses.type(courseId)
  }

  async clickBookNow() {
    await this.bookNow.nth(0).click()
  }
  async clickJoinWaitingList() {
    await this.joinWaitingList.nth(0).click()
  }

  async maxCourses(): Promise<number> {
    const bookNowLocators = await this.bookNow.all()
    const joinWaitingListLocators = await this.joinWaitingList.all()
    return concat(bookNowLocators, joinWaitingListLocators).length
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

  async checkExportOfLicences(data: Go1_Licenses_History_Set_Input) {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.exportHistory.click(),
    ])
    const downloadPath = (await download.path()) as string
    const workbook = readFile(downloadPath)
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const expectedRows = [
      // Column Names
      {
        A: 'Date',
        B: 'Event',
        C: 'Invoice number',
        D: 'Course code',
        E: 'Course start date',
        F: 'Note',
        G: 'Invoked by',
        H: 'Amount',
        I: 'Balance',
        J: 'Reserved balance',
        K: 'Cost per licence',
      },
      // Contents
      {
        B: data.event,
        C: data.payload.invoiceId,
        G: data.payload.invokedBy,
        H: `+${data.change}`,
        I: data.balance,
        J: 0,
      },
      // Add additional rows if required
    ]
    for (let i = 0; i < expectedRows.length; i++) {
      const row = expectedRows[i]
      for (const [column, expectedValue] of Object.entries(row)) {
        const cell = sheet[`${column}${i + 1}`]
        expect(cell?.v).toBe(expectedValue)
      }
    }
  }

  async checkAllOrganisationsPage(orgTitle: string) {
    // Check title
    await expect(this.organisationTitle).toHaveText(orgTitle)

    // Check certifications chips
    await expect(this.activeCertificationsChip).toContainText('Active')
    await expect(this.onHoldCertificationsChip).toContainText('On hold')
    await expect(this.expiringSoonCertificationsChip).toContainText(
      'Expiring soon',
    )
    await expect(this.expiredRecentlyCertificationsChip).toContainText(
      'Expired recently',
    )

    //Check individuals by level
    await expect(this.individualsByLevelTabList).toBeVisible()
    await expect(this.advancedCertifications).toBeVisible()

    await this.advancedTrainerTab.click()
    await expect(this.advancedTrainerCertifications).toBeVisible()

    //Check org summary
    await expect(this.orgSummaryTable).toBeVisible()
  }

  async clickSeeAllOrganisationsButton(): Promise<OrganisationListPage> {
    await this.seeAllOrgs.click()
    return new OrganisationListPage(this.page)
  }
}
