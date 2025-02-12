import { expect, Locator, Page } from '@playwright/test'

import { isUK } from '@qa/constants'

import { BasePage } from '../BasePage.fixture'

import { EditOrganisationPage } from './EditOrganisation.fixture'
import { OrgInvitationPage } from './OrgInvitePage.fixture'

export class IndividualOrganisationPage extends BasePage {
  readonly orgTitle: Locator
  readonly affiliatedWithInfo: Locator
  readonly orgDetailsTab: Locator
  readonly orgAffiliatedOrgsTab: Locator
  readonly orgIndividualsTab: Locator
  readonly orgBLTab: Locator
  readonly orgPermissionsTab: Locator
  readonly mainOrgLink: Locator
  readonly autocompleteLoading: Locator
  readonly autocompleteOption: Locator

  // Overview Tab
  readonly orgOverviewTab: Locator
  readonly totalIndividualsText: Locator
  readonly activeCertificationsTile: Locator
  readonly onHoldCertificationsTile: Locator
  readonly expiringSoonCertificationsTile: Locator
  readonly expiredRecentlyCertificationsTile: Locator

  // Details Tab
  readonly orgDetailsSection: Locator
  readonly orgAddressSection: Locator
  readonly additionalInfoSection: Locator
  readonly editOrgButton: Locator
  readonly deleteOrgButton: Locator
  readonly orgNameRow: Locator
  readonly orgSectorRow: Locator
  readonly orgTypeRow: Locator
  readonly orgPhoneRow: Locator
  readonly orgEmailRow: Locator
  readonly orgWebsiteRow: Locator
  readonly addrLine1Row: Locator
  readonly addrLine2Row: Locator
  readonly cityRow: Locator
  readonly postCodeRow: Locator
  readonly regionRow: Locator
  readonly countryRow: Locator
  readonly headFirstNameRow: Locator
  readonly headSurnameRow: Locator
  readonly headEmailRow: Locator
  readonly settingRow: Locator
  readonly deleteOrgModal: Locator
  readonly deleteOrgModalContent: Locator
  readonly deleteOrgModalConfirm: Locator
  readonly deleteOrgModalCancel: Locator

  // Affiliated Orgs Tab
  readonly affiliatedOrgsTitleText: Locator
  readonly manageSelectedOrgsButton: Locator
  readonly unlinkOrgsButton: Locator
  readonly addAffiliatesButton: Locator
  readonly addAffiliatesModal: Locator
  readonly addAffiliatesModalContent: Locator
  readonly addAffiliatesModalCancel: Locator
  readonly addAffiliatesModalConfirm: Locator
  readonly addAffiliatesOrgSelector: Locator
  readonly removeAffiliatesModal: Locator
  readonly removeAffiliatesModalCancel: Locator
  readonly removeAffiliatesModalConfirm: Locator
  readonly affiliatedOrgsTable: Locator
  readonly orgRow: (orgId: string) => Locator

  // Individuals Tab
  readonly individualsTab: Locator
  readonly invitesTab: Locator
  readonly individualsTable: Locator
  readonly invitesTable: Locator
  readonly inviteIndividualsButton: Locator
  readonly userRow: (userId: string) => Locator
  readonly inviteRow: (userEmail: string) => Locator
  readonly editOrgMemberModal: Locator
  readonly toggleAdminRoleSwitch: Locator
  readonly removeFromOrgButton: Locator
  readonly editOrgMemberCancelButton: Locator
  readonly editOrgMemberConfirmButton: Locator

  // Blended Learning Licenses Tab
  readonly blLicensesTab: Locator
  readonly remainingLicenses: Locator
  readonly manageLicensesButton: Locator
  readonly licenseHistoryTable: Locator
  readonly manageLicensesModal: Locator
  readonly addLicensesRadio: Locator
  readonly removeLicensesRadio: Locator
  readonly nrOfLicensesInput: Locator
  readonly inoviceNumberInput: Locator
  readonly saveDetailsButton: Locator

  // Permissions Tab
  readonly permissionsTab: Locator
  readonly knowledgeHubTitle: Locator
  readonly knowledgeHubAccessToggle: Locator

  constructor(page: Page) {
    super(page)
    this.autocompleteLoading = this.page.locator(
      '.MuiAutocomplete-popper .MuiAutocomplete-loading',
    )
    this.autocompleteOption = this.page.locator(
      '.MuiAutocomplete-popper .MuiAutocomplete-option',
    )
    this.orgTitle = this.page.locator('[data-testid="org-title"]')
    this.affiliatedWithInfo = this.page.locator(
      '[data-testid="affiliated-with"]',
    )
    this.mainOrgLink = this.affiliatedWithInfo.locator(
      '[data-testid="main-org-link"]',
    )

    this.orgOverviewTab = this.page.locator('[data-testid="org-overview"]')
    this.orgDetailsTab = this.page.locator('[data-testid="org-details"]')
    this.orgAffiliatedOrgsTab = this.page.locator(
      '[data-testid="affiliated-orgs"]',
    )
    this.orgIndividualsTab = this.page.locator(
      '[data-testid="org-individuals"]',
    )
    this.orgBLTab = this.page.locator('[data-testid="org-blended-licences"]')
    this.orgPermissionsTab = this.page.locator(
      '[data-testid="org-permissions"]',
    )
    // Overview Tab
    this.totalIndividualsText = this.page.locator(
      '[data-testid="total-individuals"]',
    )
    this.activeCertificationsTile = this.page.locator(
      '[data-testid="active-certifications"]',
    )
    this.onHoldCertificationsTile = this.page.locator(
      '[data-testid="on-hold-certifications"]',
    )
    this.expiringSoonCertificationsTile = this.page.locator(
      '[data-testid="expiring-soon-certifications"]',
    )
    this.expiredRecentlyCertificationsTile = this.page.locator(
      '[data-testid="expired-recently-certifications"]',
    )
    this.deleteOrgModal = this.page.locator('[data-testid="delete-org-modal"]')
    this.deleteOrgModalContent = this.page.locator(
      '[data-testid="delete-org-modal-content"]',
    )
    this.deleteOrgModalCancel = this.page.locator(
      '[data-testid="delete-org-cancel"]',
    )
    this.deleteOrgModalConfirm = this.page.locator(
      '[data-testid="delete-org-btn"]',
    )

    //Details Tab
    this.orgDetailsSection = this.page.locator(
      '[data-testid="org-details-section"]',
    )
    this.orgAddressSection = this.page.locator(
      '[data-testid="org-address-section"]',
    )
    this.additionalInfoSection = this.page.locator(
      '[data-testid="additional-details-section"]',
    )
    this.editOrgButton = this.page.locator('[data-testid="edit-org-button"]')
    this.deleteOrgButton = this.page.locator(
      '[data-testid="delete-org-button"]',
    )
    this.orgNameRow = this.page.locator('[data-testid="org-name-row"]')
    this.orgSectorRow = this.page.locator('[data-testid="org-sector-row"]')
    this.orgTypeRow = this.page.locator('[data-testid="org-type-row"]')
    this.orgPhoneRow = this.page.locator('[data-testid="org-phone-row"]')
    this.orgEmailRow = this.page.locator('[data-testid="org-email-row"]')
    this.orgWebsiteRow = this.page.locator('[data-testid="org-website-row"]')
    this.addrLine1Row = this.page.locator(
      '[data-testid="org-address-line-1-row"]',
    )
    this.addrLine2Row = this.page.locator(
      '[data-testid="org-address-line-2-row"]',
    )
    this.cityRow = this.page.locator('[data-testid="org-city-row"]')
    this.postCodeRow = this.page.locator('[data-testid="org-postcode-row"]')
    this.regionRow = this.page.locator('[data-testid="org-region-row"]')
    this.countryRow = this.page.locator('[data-testid="org-country-row"]')
    this.headFirstNameRow = this.page.locator(
      '[data-testid="head-first-name-row"]',
    )
    this.headSurnameRow = this.page.locator('[data-testid="head-surname-row"]')
    this.headEmailRow = this.page.locator('[data-testid="head-email-row"]')
    this.settingRow = this.page.locator('[data-testid="setting-name-row"]')

    // Affiliated Orgs Tab
    this.affiliatedOrgsTitleText = this.page.locator(
      '[data-testid="affiliated-orgs-title"]',
    )
    this.manageSelectedOrgsButton = this.page.locator(
      '[data-testid="manage-affiliated-orgs-button"]',
    )
    this.unlinkOrgsButton = this.page.locator('[data-testid="unlink-orgs"]')
    this.addAffiliatesButton = this.page.locator(
      '[data-testid="add-an-affiliate"]',
    )
    this.addAffiliatesModal = this.page.locator(
      '[data-testid="add-affiliated-org-modal"]',
    )
    this.addAffiliatesModalContent = this.page.locator(
      '[data-testid="add-affiliated-org-modal-content"]',
    )
    this.addAffiliatesModalCancel = this.page.locator(
      '[data-testid="close-link-affiliate-org-button"]',
    )
    this.addAffiliatesModalConfirm = this.page.locator(
      '[data-testid="confirm-link-affiliate-org-button"]',
    )
    this.addAffiliatesOrgSelector = this.page.locator(
      '[data-testid="affiliated-org"] input',
    )
    this.affiliatedOrgsTable = this.page.locator(
      '[data-testid="affiliated-organisations"]',
    )
    this.removeAffiliatesModal = this.page.locator(
      '[data-testid="remove-affiliated-org-modal"]',
    )
    this.removeAffiliatesModalCancel = this.page.locator(
      '[data-testid="close-unlink-affiliate-org-button"]',
    )
    this.removeAffiliatesModalConfirm = this.page.locator(
      '[data-testid="confirm-unlink-affiliate-org-button"]',
    )
    this.orgRow = (orgId: string) =>
      this.page.locator(`[data-testid="affiliated-org-${orgId}"]`)

    // Individuals Tab
    this.individualsTab = this.page.locator('[data-testid="tabUsers"]')
    this.invitesTab = this.page.locator('[data-testid="tabInvites"]')
    this.individualsTable = this.page.locator(
      '[data-testid="organisation-members"]',
    )
    this.invitesTable = this.page.locator('[data-testid="org-invites-table"]')
    this.inviteIndividualsButton = this.page.locator(
      '[data-testid="invite-user-to-org"]',
    )
    this.userRow = (orgMemberId: string) =>
      this.page.locator(`[data-testid="org-member-row-${orgMemberId}"]`)

    this.inviteRow = (inviteId: string) => {
      return this.page.locator(`[data-testid="org-invite-row-${inviteId}"]`)
    }
    this.editOrgMemberModal = this.page.locator(
      '[data-testid="edit-org-member-modal"]',
    )
    this.toggleAdminRoleSwitch = this.page.locator(
      '[data-testid="toggle-admin-role"]',
    )
    this.removeFromOrgButton = this.page.locator(
      '[data-testid="remove-from-organization"]',
    )
    this.editOrgMemberCancelButton = this.page.locator(
      '[data-testid="cancel-edit-org-user"]',
    )
    this.editOrgMemberConfirmButton = this.page.locator(
      '[data-testid="confirm-edit-org-user"]',
    )

    // Blended Learning Licenses Tab
    this.blLicensesTab = this.page.locator(
      '[data-testid="org-blended-licences"]',
    )
    this.remainingLicenses = this.page.locator(
      '[data-testid="licenses-remaining"]',
    )
    this.manageLicensesButton = this.page.locator(
      '[data-testid="manage-remaining-licences"]',
    )
    this.licenseHistoryTable = this.page.locator(
      '[data-testid="licenses-history-table"]',
    )
    this.manageLicensesModal = this.page.locator(
      '[data-testid="manage-licenses-dialog"]',
    )
    this.addLicensesRadio = this.page.locator(
      '[data-testid="licence-add-checkbox"]',
    )
    this.removeLicensesRadio = this.page.locator(
      '[data-testid="licence-remove-checkbox"]',
    )
    this.nrOfLicensesInput = this.page.locator(
      '[data-testid="license-amount-input"]',
    )
    this.inoviceNumberInput = this.page.locator(
      '[data-testid="license-invoice-input"]',
    )
    this.saveDetailsButton = this.page.locator(
      '[data-testid="licence-save-details"]',
    )

    // Permissions Tab
    this.permissionsTab = this.page.locator('[data-testid="org-permissions"]')
    this.knowledgeHubTitle = this.page.locator(
      '[data-testid="org-permissions-title"]',
    )
    this.knowledgeHubAccessToggle = this.page.locator(
      '[data-testid="org-knowledge-hub-access-switch"]',
    )
  }
  async goto(id: string): Promise<void> {
    await super.goto(`organisations/${id}`)
  }

  async checkOrganisationTitle(orgName: string) {
    await expect(this.orgTitle).toContainText(orgName)
  }

  async checkOrganisationTabs(
    isAffiliated: boolean,
    canViewPermissions: boolean,
  ) {
    await expect(this.orgOverviewTab).toBeVisible()
    await expect(this.orgDetailsTab).toBeVisible()
    if (!isAffiliated && !isUK()) {
      await expect(this.orgAffiliatedOrgsTab).toBeVisible()
    }
    await expect(this.orgIndividualsTab).toBeVisible()
    await expect(this.orgBLTab).toBeVisible()
    if (canViewPermissions) {
      await expect(this.orgPermissionsTab).toBeVisible()
    }
  }

  async checkAffiliatedWithInfo() {
    await expect(this.affiliatedWithInfo).toBeVisible()
  }

  async checkOrgPage(
    orgName: string,
    isAffiliated: boolean,
    canViewPermissions: boolean,
  ) {
    await this.checkOrganisationTitle(orgName)
    await this.checkOrganisationTabs(isAffiliated, canViewPermissions)
    if (isAffiliated) {
      await this.checkAffiliatedWithInfo()
    }
  }

  async goToMainOrg(): Promise<IndividualOrganisationPage> {
    await this.mainOrgLink.click()
    return new IndividualOrganisationPage(this.page)
  }

  // Overview Tab

  async clickOrgOverviewTab() {
    await this.orgOverviewTab.click()
  }
  async checkTotalIndividualsTile() {
    await expect(this.totalIndividualsText).toContainText('Total individuals')
  }

  async checkActiveCertificationsTile() {
    await expect(this.activeCertificationsTile).toContainText('Active')
  }

  async checkOnHoldCertificationsTile() {
    await expect(this.onHoldCertificationsTile).toContainText('On hold')
  }

  async checkExpiringSoonCertificationsTile() {
    await expect(this.expiringSoonCertificationsTile).toContainText(
      'Expiring soon',
    )
  }

  async checkExpiredRecentlyCertificationsTile() {
    await expect(this.expiredRecentlyCertificationsTile).toContainText(
      'Expired recently',
    )
  }

  async checkOverviewTab() {
    await this.clickOrgOverviewTab()
    await this.checkTotalIndividualsTile()
    await this.checkActiveCertificationsTile()
    await this.checkOnHoldCertificationsTile()
    await this.checkExpiringSoonCertificationsTile()
    await this.checkExpiredRecentlyCertificationsTile()
  }

  // Details Tab
  async clickOrgDetailsTab() {
    await this.orgDetailsTab.click()
  }

  async checkOrgDetailsSection() {
    await expect(this.orgDetailsSection).toBeVisible()
    await expect(this.orgNameRow).toBeVisible()
    await expect(this.orgSectorRow).toBeVisible()
    await expect(this.orgTypeRow).toBeVisible()
    await expect(this.orgPhoneRow).toBeVisible()
    await expect(this.orgEmailRow).toBeVisible()
    await expect(this.orgWebsiteRow).toBeVisible()
    await expect(this.editOrgButton).toBeVisible()
    await expect(this.deleteOrgButton).toBeVisible()
  }

  async checkOrgDetailsValues(
    orgName: string,
    orgSector: string,
    orgType: string,
  ) {
    await expect(this.orgNameRow).toContainText(orgName)
    await expect(this.orgSectorRow).toContainText(orgSector)
    await expect(this.orgTypeRow).toContainText(orgType)
  }

  async checkOrgAddressSection(isANZCountry: boolean) {
    await expect(this.orgAddressSection).toBeVisible()
    await expect(this.addrLine1Row).toBeVisible()
    await expect(this.addrLine2Row).toBeVisible()
    await expect(this.cityRow).toBeVisible()
    await expect(this.postCodeRow).toBeVisible()
    if (isANZCountry && !isUK()) {
      await expect(this.regionRow).toBeVisible()
    }
    await expect(this.countryRow).toBeVisible()
  }

  async checkAdditionalInfoSection() {
    await expect(this.additionalInfoSection).toBeVisible()
    await expect(this.headFirstNameRow).toBeVisible()
    await expect(this.headSurnameRow).toBeVisible()
    await expect(this.headEmailRow).toBeVisible()
  }

  async checkOrgDetailsTab(isANZCountry: boolean) {
    await this.clickOrgDetailsTab()
    await this.checkOrgDetailsSection()
    await this.checkOrgAddressSection(isANZCountry)
    await this.checkAdditionalInfoSection()
  }

  async clickEditOrgButton(): Promise<EditOrganisationPage> {
    await this.orgDetailsTab.click()
    await this.editOrgButton.click()
    return new EditOrganisationPage(this.page)
  }

  async checkEditOrgButton(orgId: string) {
    await this.editOrgButton.click()
    expect(this.page.url()).toContain(`organisations/${orgId}/edit`)
  }

  async clickDeleteOrgButton() {
    await this.deleteOrgButton.click()
  }
  async clickCancelDeleteOrgButton() {
    await this.deleteOrgModalCancel.click()
  }

  async checkDeleteOrgButton(orgName: string) {
    await this.clickDeleteOrgButton()
    await expect(this.deleteOrgModal).toBeVisible()
    await expect(this.deleteOrgModalContent).toContainText(orgName)
    await expect(this.deleteOrgModalCancel).toBeVisible()
    await this.clickCancelDeleteOrgButton()
  }

  async clickOrgDetailsButton() {
    await this.orgDetailsTab.click()
    await this.editOrgButton.click()
  }

  async deleteOrg(orgName: string) {
    await this.clickDeleteOrgButton()
    await expect(this.deleteOrgModal).toBeVisible()
    await expect(this.deleteOrgModalContent).toContainText(orgName)
    await expect(this.deleteOrgModalConfirm).toBeVisible()
    await this.deleteOrgModalConfirm.click()
  }

  async checkOrgIsInAffiliatesTable(orgId: string) {
    await expect(this.orgRow(orgId)).toBeVisible()
  }

  // Affiliated Organisations tab

  async clickAffiliatedOrgsTab() {
    await this.orgAffiliatedOrgsTab.click()

    await expect(this.affiliatedOrgsTitleText).toContainText(
      'Affiliated organisations',
    )
    await expect(this.manageSelectedOrgsButton).toBeVisible()
    await expect(this.addAffiliatesButton).toBeVisible()
    await expect(this.affiliatedOrgsTable).toBeVisible()
  }

  async selectNewAffiliateToAdd(orgName: string) {
    await this.addAffiliatesOrgSelector.fill(orgName)
    await this.addAffiliatesOrgSelector.click()
    await expect(this.autocompleteLoading).toHaveCount(0)
    await this.page.keyboard.press('ArrowDown')
    await this.page.keyboard.press('Enter')
  }

  async addAnAffiliate(orgId: string, orgName: string) {
    await this.addAffiliatesButton.click()
    await expect(this.addAffiliatesModal).toBeVisible()
    await expect(this.addAffiliatesModalContent).toBeVisible()
    await expect(this.addAffiliatesModalCancel).toBeVisible()
    await expect(this.addAffiliatesModalConfirm).toBeVisible()
    await this.selectNewAffiliateToAdd(orgName)
    await this.addAffiliatesModalConfirm.click()
    await this.checkOrgIsInAffiliatesTable(orgId)
  }

  async unlinkOrgFromTableRow(orgId: string) {
    const manageOrgButton = this.orgRow(orgId).locator(
      '[data-testid="manage-affiliated-orgs"]',
    )
    await manageOrgButton.click()
    const unlinkButton = this.page.locator(
      '[data-testid="unlink-affiliated-org"]',
    )
    await unlinkButton.click()
    await expect(this.removeAffiliatesModal).toBeVisible()
    await expect(this.removeAffiliatesModalCancel).toBeVisible()
    await expect(this.removeAffiliatesModalConfirm).toBeVisible()
    await this.removeAffiliatesModalConfirm.click()
  }

  async unlinkOrgFromManageSelected(orgId: string) {
    const affiliateRow = this.orgRow(orgId)
    await expect(this.manageSelectedOrgsButton).toBeDisabled()
    const orgCheckbox = affiliateRow.locator('[data-testid="TableChecks-Row"]')
    await orgCheckbox.click()
    await expect(this.manageSelectedOrgsButton).toBeEnabled()
    await this.manageSelectedOrgsButton.click()
    const unlinkOrgsButton = this.page.locator('[data-testid="unlink-orgs"]')
    await unlinkOrgsButton.click()
    await expect(this.removeAffiliatesModal).toBeVisible()
    await expect(this.removeAffiliatesModalCancel).toBeVisible()
    await expect(this.removeAffiliatesModalConfirm).toBeVisible()
    await this.removeAffiliatesModalConfirm.click()
  }

  // Individuals tab
  async clickIndividualsTab() {
    await this.orgIndividualsTab.click()
  }

  async checkIndividualsTab() {
    await this.clickIndividualsTab()
    await this.checkTotalIndividualsTile()
    await this.checkActiveCertificationsTile()
    await this.checkOnHoldCertificationsTile()
    await this.checkExpiringSoonCertificationsTile()
    await this.checkExpiredRecentlyCertificationsTile()
    await expect(this.individualsTable).toBeVisible()
  }

  async checkInvitesTab() {
    await this.invitesTab.click()
    await expect(this.invitesTable).toBeVisible()
  }

  async makeUserOrgAdmin(orgMemberId: string) {
    const userRow = this.userRow(orgMemberId)
    const editButton = userRow.locator('[data-testid="edit-user-button"]')
    await editButton.click()
    await expect(this.editOrgMemberModal).toBeVisible()
    await expect(this.toggleAdminRoleSwitch).toBeVisible()
    if (!(await this.toggleAdminRoleSwitch.isChecked())) {
      await this.toggleAdminRoleSwitch.click()
    }
    await this.editOrgMemberConfirmButton.click()
    await expect(this.userRow(orgMemberId)).toContainText('Organisation admin')
  }

  async removeUserFromOrg(orgMemberId: string) {
    const userRow = this.userRow(orgMemberId)
    const editButton = userRow.locator('[data-testid="edit-user-button"]')
    await editButton.click()
    await expect(this.editOrgMemberModal).toBeVisible()
    await expect(this.removeFromOrgButton).toBeVisible()
    await this.removeFromOrgButton.click()
    await expect(this.userRow(orgMemberId)).toBeHidden()
  }

  async clickInviteUserToOrg(): Promise<OrgInvitationPage> {
    await this.inviteIndividualsButton.click()
    return new OrgInvitationPage(this.page)
  }

  async redirectToInvitesTab(orgId: string): Promise<void> {
    await super.goto(`organisations/${orgId}/?tab=INDIVIDUALS&subtab=INVITES`)
  }

  async checkUserIsInvited(inviteId: string, email: string) {
    const inviteRow = this.inviteRow(inviteId)
    await expect(inviteRow).toBeVisible()
    await expect(inviteRow).toContainText(email)
  }

  async cancelOrganisationInvite(orgMemberId: string) {
    const inviteRow = this.inviteRow(orgMemberId)
    const cancelButton = inviteRow.locator(
      '[data-testid="cancel-invite-button"]',
    )
    await cancelButton.click()
    await expect(inviteRow).toBeHidden()
  }

  async checkUserIsNotInvited(userEmail: string) {
    await expect(this.invitesTable).not.toContainText(userEmail)
  }

  // Blended Learning Licenses Tab
  async checkRemainingLicenses(count: number) {
    await expect(this.remainingLicenses).toContainText(count.toString())
  }
  async clickManageLicensesButton() {
    await this.manageLicensesButton.click()
  }
  async checkLicenseHistoryTable() {
    await expect(this.licenseHistoryTable).toBeVisible()
  }

  async checkLicenseNrIncreaseInHistoryTable(
    invoiceNumber: string,
    loggedUserFullName: string,
    amount: number,
  ) {
    await expect(this.licenseHistoryTable).toContainText(invoiceNumber)

    await expect(this.licenseHistoryTable).toContainText(
      `Added by ${loggedUserFullName}`,
    )
    await expect(this.licenseHistoryTable).toContainText(`+${amount}`)
  }

  async checkLicenseNrDecreaseInHistoryTable(
    loggedUserFullName: string,
    amount: number,
  ) {
    await expect(this.licenseHistoryTable).toContainText(
      `Removed by ${loggedUserFullName}`,
    )
    await expect(this.licenseHistoryTable).toContainText(`-${amount}`)
  }

  async checkBLLicensesTab() {
    await this.blLicensesTab.click()
    await this.waitForPageLoad()
    await expect(this.remainingLicenses).toBeVisible()
    await expect(this.manageLicensesButton).toBeVisible()
    await this.checkLicenseHistoryTable()
  }

  async checkManageLicensesModal() {
    await expect(this.manageLicensesModal).toBeVisible()
    await expect(this.addLicensesRadio).toBeVisible()
    await expect(this.removeLicensesRadio).toBeVisible()
    await expect(this.nrOfLicensesInput).toBeVisible()
    await expect(this.inoviceNumberInput).toBeVisible()
    await expect(this.saveDetailsButton).toBeVisible()
  }
  async fulfillLicensesRequest() {
    await this.page.route(`**/v1/graphql`, async route => {
      const request = route.request()
      if (
        JSON.stringify(request.postDataJSON()).includes('Go1LicensesChange')
      ) {
        await route.fulfill({
          json: {
            data: {
              go1LicensesChange: {
                success: true,
                error: null,
                __typename: 'Go1LicensesChangeOutput',
              },
            },
          },
        })
      } else {
        await route.continue()
      }
    })
  }

  async addLicenses(nrOfLicenses: number, invoiceNumber: string) {
    await this.clickManageLicensesButton()
    await this.checkManageLicensesModal()
    await this.addLicensesRadio.click()
    await this.nrOfLicensesInput.click()
    await this.nrOfLicensesInput.type(nrOfLicenses.toString()) // Fails with .fill()
    await this.inoviceNumberInput.click()
    await this.inoviceNumberInput.type(invoiceNumber) // Fails with .fill()
    await this.saveDetailsButton.click()
    await this.fulfillLicensesRequest()
    await this.waitForPageLoad()
  }

  async removeLicenses(nrOfLicenses: number) {
    await this.clickManageLicensesButton()
    await this.checkManageLicensesModal()
    await this.removeLicensesRadio.click()
    await this.nrOfLicensesInput.click()
    await this.nrOfLicensesInput.type(nrOfLicenses.toString()) // Fails with .fill()
    await this.saveDetailsButton.click()
    await this.fulfillLicensesRequest()
    await this.waitForPageLoad()
  }

  // Permissions Tab
  async checkPermissionsTab() {
    await this.orgPermissionsTab.click()
    await this.waitForPageLoad()
    await expect(this.knowledgeHubTitle).toBeVisible()
    await expect(this.knowledgeHubAccessToggle).toBeVisible()
    await expect(this.knowledgeHubAccessToggle).toBeEnabled()

    await this.knowledgeHubAccessToggle.click()
    await expect(this.knowledgeHubAccessToggle).toBeDisabled()
    // toggle back
    await this.knowledgeHubAccessToggle.click()
    await expect(this.knowledgeHubAccessToggle).toBeDisabled()

    // Checking the actual permission for user might cause the tests to fail because that user might be a member of multiple organisations
  }
}
