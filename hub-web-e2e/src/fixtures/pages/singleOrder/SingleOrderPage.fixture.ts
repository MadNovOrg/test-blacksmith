import { Locator, Page } from '@playwright/test'

import { Currency } from '@app/types'

import { Course, OrderCreation } from '@qa/data/types'

import { BasePage } from '../BasePage.fixture'

import {
  formatCourseTitle,
  formatSchedule,
  formatDateForRegistrantSection,
  formatCoursePrice,
  formatInvoiceDate,
} from './utils'

export class SingleOrderPage extends BasePage {
  readonly course: Course
  readonly order: OrderCreation

  readonly courseStartEndDate: Locator
  readonly orderQuantity: Locator
  readonly courseTitle: Locator
  readonly orderPrice: Locator
  readonly courseRegistrant: Locator
  readonly orderSubTotal: Locator
  readonly orderVat: Locator
  readonly orderTotal: Locator
  readonly invoiceStatus: Locator
  readonly invoiceReference: Locator
  readonly invoiceDate: Locator
  readonly orderPaymentMethod: Locator
  readonly orderedByName: Locator
  readonly orderedByEmail: Locator
  readonly orderedByPhone: Locator
  readonly bookingContactName: Locator
  readonly bookingContactEmail: Locator
  readonly invoicedAddress: Locator
  readonly invoicedName: Locator
  readonly invoicedEmail: Locator
  readonly invoicedPhone: Locator
  readonly currency: Locator
  readonly orderSource: Locator
  readonly courseSource: Locator
  readonly xeroInvoiceNumber: Locator

  constructor(page: Page, course: Course, order: OrderCreation) {
    super(page)

    this.course = course
    this.order = order

    this.courseStartEndDate = this.page.locator(
      '[data-testid="order-timezone-info"]'
    )
    this.orderQuantity = this.page.locator('data-testid=order-quantity')
    this.courseTitle = this.page.locator('data-testid=order-course-title')
    this.orderPrice = this.page.locator('data-testid=order-price')
    this.courseRegistrant = this.page.locator(
      'data-testid=order-registrant-e2e'
    )
    this.orderSubTotal = this.page.locator('data-testid=order-subtotal-e2e')
    this.orderVat = this.page.locator('data-testid=order-vat-e2e')
    this.orderTotal = this.page.locator('data-testid=order-amount-due-e2e')
    this.invoiceStatus = this.page.locator('data-testid=order-invoice-status')
    this.invoiceReference = this.page.locator('data-testid=order-reference-e2e')
    this.invoiceDate = this.page.locator('data-testid=invoice-date-e2e')
    this.orderPaymentMethod = this.page.locator(
      'data-testid=order-payment-method'
    )
    this.orderedByName = this.page.locator('data-testid=ordered-by-name-e2e')
    this.orderedByEmail = this.page.locator('data-testid=ordered-by-email-e2e')
    this.orderedByPhone = this.page.locator('data-testid=ordered-by-phone-e2e')
    this.bookingContactName = this.page.locator(
      'data-testid=booking-contact-name-e2e'
    )
    this.bookingContactEmail = this.page.locator(
      'data-testid=booking-contact-email-e2e'
    )
    this.invoicedAddress = this.page.locator('data-testid=invoiced-address-e2e')
    this.invoicedName = this.page.locator('data-testid=invoiced-name-e2e')
    this.invoicedEmail = this.page.locator('data-testid=invoiced-email-e2e')
    this.invoicedPhone = this.page.locator('data-testid=invoiced-phone-e2e')
    this.currency = this.page.locator('data-testid=currency-e2e')
    this.orderSource = this.page.locator('data-testid=order-source-e2e')
    this.courseSource = this.page.locator('data-testid=course-source-e2e')
    this.xeroInvoiceNumber = this.page.locator(
      'data-testid=xero-invoice-number-e2e'
    )
  }

  async goto(orderId: string) {
    const url = `orders/${orderId}`

    console.log('Opening browser to URL: ', url)

    await super.goto(url)
  }

  async isCourseTitleCorrect() {
    const pageCourseTitle = await this.courseTitle.innerText()
    const expectedCourseTitle = formatCourseTitle(this.course.id)

    return pageCourseTitle === expectedCourseTitle
  }

  async areStartEndDatesCorrect() {
    const pageDates = (await this.courseStartEndDate.innerText()).toUpperCase()
    const expectedDates = formatSchedule(this.course.schedule[0]).toUpperCase()

    return pageDates === expectedDates
  }

  async hasCorrectOrderQuantity() {
    const pageQuantity = await this.orderQuantity.innerText()
    const expectedQuantity = String(this.order.quantity)

    return pageQuantity === expectedQuantity
  }

  async isCourseRegistrantCorrect() {
    const pageOrderRegistrant = await this.courseRegistrant.innerText()

    const courseTitle = formatCourseTitle(this.course.id)
    const courseDate = formatDateForRegistrantSection(
      String(this.course.schedule[0].start),
      this.course.schedule[0].timeZone
    )
    const registrantName =
      this.order.registrants[0].firstName +
      ' ' +
      this.order.registrants[0].lastName

    const expectedOrderRegistrant = `${courseTitle}, ${courseDate}, ${registrantName}`

    return pageOrderRegistrant === expectedOrderRegistrant
  }

  async isPriceCorrect() {
    const pagePrice = await this.orderPrice.innerText()
    const expectedPrice = formatCoursePrice(this.course.price ?? 0)

    return pagePrice === expectedPrice
  }

  async isSubTotalPriceCorrect() {
    const pageSubTotal = await this.orderSubTotal.innerText()
    const expectedSubTotal = formatCoursePrice(this.course.price ?? 0)

    return pageSubTotal === expectedSubTotal
  }

  async isVatCorrect() {
    const pageVat = await this.orderVat.innerText()
    const courseVat = (20 / 100) * (this.course.price ?? 0)
    const expectedVat = formatCoursePrice(courseVat)

    return pageVat === expectedVat
  }

  async isTotalPriceCorrect() {
    const pageTotal = await this.orderTotal.innerText()
    const courseVat = (20 / 100) * (this.course.price ?? 0)
    const expectedTotal = formatCoursePrice(
      courseVat + (this.course.price ?? 0)
    )

    return pageTotal === expectedTotal
  }

  async isInvoiceStatusDraft() {
    const pageInvoiceStatus = await this.invoiceStatus.innerText()
    return pageInvoiceStatus === 'Draft'
  }

  async isInvoiceReferenceCorrect() {
    const pageInvoiceReference = await this.invoiceReference.innerText()
    const expectedReference = `L1.F.OP-${this.course.id}_PO:${this.order.clientPurchaseOrder}`

    return pageInvoiceReference === expectedReference
  }

  async isInvoiceDateCorrect() {
    const pageInvoiceDate = (await this.invoiceDate.innerText()).toUpperCase()
    const expectedDate = formatInvoiceDate(
      String(new Date()),
      this.course.schedule[0].timeZone
    ).toUpperCase()

    return pageInvoiceDate === expectedDate
  }

  async isOrderPaymentMethodCorrect() {
    const pagePaymentMethod = (
      await this.orderPaymentMethod.innerText()
    ).toUpperCase()

    const expectedPaymentMethod =
      'PAY BY ' + this.order.paymentMethod.toUpperCase()

    return pagePaymentMethod === expectedPaymentMethod
  }

  async isOrderedByCorrect() {
    const pageOrderedName = await this.orderedByName.innerText()
    const pageOrderedEmail = await this.orderedByEmail.innerText()
    const pageOrderedPhone = await this.orderedByPhone.innerText()

    const expectedOrderedName =
      this.order.billingGivenName + ' ' + this.order.billingFamilyName
    const expectedOrderedEmail = this.order.billingEmail
    const expectedOrderedPhone = this.order.billingPhone

    if (pageOrderedName !== expectedOrderedName) return false
    if (pageOrderedEmail !== expectedOrderedEmail) return false
    if (pageOrderedPhone !== expectedOrderedPhone) return false

    return true
  }

  async isBookingContactCorrect() {
    const pageBookingName = await this.bookingContactName.innerText()
    const pageBookingEmail = await this.bookingContactEmail.innerText()

    const expectedBookingName =
      this.order.bookingContact.firstName +
      ' ' +
      this.order.bookingContact.lastName

    const expectedBookingEmail = this.order.bookingContact.email

    if (pageBookingName !== expectedBookingName) return false
    if (pageBookingEmail !== expectedBookingEmail) return false

    return true
  }

  async isInvoicedToCorrect() {
    const pageInvoiceAddress = await this.invoicedAddress.innerText()
    const pageInvoicedName = await this.invoicedName.innerText()
    const pageInvoiceEmail = await this.invoicedEmail.innerText()
    const pageInvoicePhone = await this.invoicedPhone.innerText()

    const expectedInvoiceAddress =
      this.course.organization?.name + ', ' + this.order.billingAddress
    const expectedInvoiceName =
      this.order.billingGivenName + ' ' + this.order.billingFamilyName
    const expectedInvoiceEmail = this.order.billingEmail
    const expectedInvoicePhone = this.order.billingPhone

    if (pageInvoiceAddress !== expectedInvoiceAddress) return false
    if (pageInvoicedName !== expectedInvoiceName) return false
    if (pageInvoiceEmail !== expectedInvoiceEmail) return false
    if (pageInvoicePhone !== expectedInvoicePhone) return false

    return true
  }

  async isCurrencyCorrect() {
    const pageCurrency = await this.currency.innerText()
    const expectedCurrency = Currency.GBP

    return pageCurrency.includes(expectedCurrency)
  }

  async isOrderSourceCorrect() {
    if (!this.order.source) return true

    const pageOrderSource = (await this.orderSource.innerText()).toUpperCase()
    const expectedOrderSource = this.order.source
      .replace('_', ' ')
      .toUpperCase()

    return pageOrderSource === expectedOrderSource
  }

  async isCourseSourceCorrect() {
    if (!this.course.source) return true

    const pageCourseSource = (await this.courseSource.innerText()).toUpperCase()
    const expectedCourseSource = this.course.source
      .replace('_', ' ')
      .toUpperCase()

    return pageCourseSource === expectedCourseSource
  }

  async isXeroInvoiceNumberNotEmpty() {
    const pageXeroInvoiceNumber = await this.xeroInvoiceNumber.innerText()

    return !!pageXeroInvoiceNumber.length
  }
}
