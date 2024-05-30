import { test, expect } from '@playwright/test'

import { createCourseWithOrder, deleteCourse } from '@qa/api/hasura/course'
import { deleteOrderById } from '@qa/api/hasura/order'
import { TEST_SETTINGS } from '@qa/constants'
import { SingleOrderPage } from '@qa/fixtures/pages/singleOrder/SingleOrderPage.fixture'
import { stateFilePath } from '@qa/util'

interface ITestConditions {
  label: string
  promise: Promise<boolean>
}

test.use({ storageState: stateFilePath('admin') })

test.beforeEach(async () => {
  TEST_SETTINGS.role = 'admin'
})

test('View order page details are rendering properly @smoke', async ({
  page,
}) => {
  const { orderId, order, course } = await createCourseWithOrder()

  const orderPage = new SingleOrderPage(page, course, order)
  await orderPage.goto(String(orderId))
  expect(page.url()).toContain(orderId)

  const testConditions: ITestConditions[] = [
    {
      label: 'Course Title',
      promise: orderPage.isCourseTitleCorrect(),
    },
    {
      label: 'Start and End Dates',
      promise: orderPage.areStartEndDatesCorrect(),
    },
    {
      label: 'Order Quantity',
      promise: orderPage.hasCorrectOrderQuantity(),
    },
    {
      label: 'Course Registrant',
      promise: orderPage.isCourseRegistrantCorrect(),
    },
    {
      label: 'Price is displayed correctly ---- ',
      promise: orderPage.isPriceCorrect(),
    },
    {
      label: 'Subtotal Price',
      promise: orderPage.isSubTotalPriceCorrect(),
    },
    {
      label: 'VAT is displayed correctly ---- ',
      promise: orderPage.isVatCorrect(),
    },
    {
      label: 'Total Price is displayed correctly',
      promise: orderPage.isTotalPriceCorrect(),
    },
    {
      label: 'Invoice Status is Draft',
      promise: orderPage.isInvoiceStatusDraft(),
    },
    {
      label: 'Invoice Reference',
      promise: orderPage.isInvoiceReferenceCorrect(),
    },
    {
      label: 'Invoice Date',
      promise: orderPage.isInvoiceDateCorrect(),
    },
    {
      label: 'Order Payment Method',
      promise: orderPage.isOrderPaymentMethodCorrect(),
    },
    {
      label: 'Ordered By Section is displayed correctly',
      promise: orderPage.isOrderedByCorrect(),
    },
    {
      label: 'Booking contact is displayed correctly',
      promise: orderPage.isBookingContactCorrect(),
    },
    {
      label: 'Invoiced to is displayed correctly',
      promise: orderPage.isInvoicedToCorrect(),
    },
    {
      label: 'Currency is displayed correctly',
      promise: orderPage.isCurrencyCorrect(),
    },
    {
      label: 'Course source is displayed correctly',
      promise: orderPage.isCourseSourceCorrect(),
    },
    {
      label: 'Order source is displayeed correctly',
      promise: orderPage.isOrderSourceCorrect(),
    },
    {
      label: 'Xero Invoice Number is not empty',
      promise: orderPage.isXeroInvoiceNumberNotEmpty(),
    },
  ]

  try {
    const results = await Promise.all(testConditions.map(test => test.promise))

    // Log failed tests for better debugging
    results.forEach((result, index) => {
      if (!result) {
        console.error(' - - - - - - - - -')
        console.error(`Failed Check: ${testConditions[index].label}`)
        console.error(' - - - - - - - - -')
      }
    })

    // Check if all results are true
    const haveAllChecksPassed = results.every(result => result === true)
    expect(haveAllChecksPassed).toBe(true)
  } catch {
    test.fail()
    return
  } finally {
    await deleteCourse(course.id)
    await deleteOrderById(orderId)
  }
})
