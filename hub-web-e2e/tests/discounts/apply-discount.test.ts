/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { test as base, expect } from '@playwright/test'

import { Course_Type_Enum } from '@app/generated/graphql'

import * as API from '@qa/api'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { BookingDetailsPage } from '@qa/fixtures/pages/booking/BookingDetailsPage.fixture'
import { stateFilePath } from '@qa/util'

const test = base.extend<{ courseId: number }>({
  courseId: async ({}, use) => {
    const openCourse = UNIQUE_COURSE()
    openCourse.type = Course_Type_Enum.Open

    const id = (
      await API.course.insertCourse(
        openCourse,
        'trainer@teamteach.testinator.com',
      )
    ).id

    const PROMO_CODE = '5_PERCENT_OFF'
    const promoCodeResponse = await API.promoCode.createSample(PROMO_CODE)

    await use(id)

    await API.course.deleteCourse(id)

    if (promoCodeResponse?.id) {
      await API.promoCode.remove(promoCodeResponse.id)
    }
  },
})
test.use({ storageState: stateFilePath('admin') })

const parsePrice = (priceString: string) =>
  Number.parseFloat(priceString.replace(/![\d.]/g, ''))

test('should apply a discount when booking an OPEN course', async ({
  page,
  courseId,
}) => {
  const bookingDetailsPage = new BookingDetailsPage(page)
  await bookingDetailsPage.goto(String(courseId))

  const originalPrice = parsePrice(
    (await bookingDetailsPage.amountDue.textContent())!,
  )
  await bookingDetailsPage.openPromoCodeFormButton.click()
  await bookingDetailsPage.promoCodeInput.fill('5_PERCENT_OFF')

  await bookingDetailsPage.applyPromoCodeButton.click()

  const discount = parsePrice(
    (await bookingDetailsPage.promoCodeDiscountAmount.textContent())!,
  )

  const discountedPrice = parsePrice(
    (await bookingDetailsPage.amountDue.textContent())!,
  )

  expect(discount).toBe(originalPrice * 0.05)
  expect(discountedPrice).toBe(originalPrice * 0.95)
})
