/* eslint-disable playwright/expect-expect */
import { test as base } from '@playwright/test'

import {
  Course_Delivery_Type_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'

import { deleteCourse, insertCourse } from '@qa/api/hasura/course'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { VirtualCourseBookingDetails } from '@qa/data/types'
import { BookingDonePage } from '@qa/fixtures/pages/booking/BookingDone.fixture'
import { CourseDetailsPage } from '@qa/fixtures/pages/courses/course-details/CourseDetailsPage.fixture'
import { stateFilePath, StoredCredentialKey } from '@qa/util'

const allowedUsers = ['admin', 'ops']
allowedUsers.forEach(allowedUser => {
  const data = {
    user: `${allowedUser}`,
    smoke: allowedUser === 'admin' ? '@smoke' : '',
    bookingDetails: {
      organization: 'London First School',
      bookingContactEmail: 'org.adm@teamteach.testinator.com',
      registrants: [
        {
          email: 'user1.with.org@teamteach.testinator.com',
          address: {
            addresLine1: '1 Test Street',
            addresLine2: 'Testville',
            city: 'Testford',
            postcode: 'TE1 1ST',
            country: 'England',
          },
        },
        {
          email: 'user2.with.org@teamteach.testinator.com',
          address: {
            addresLine1: '2 Test Street',
            addresLine2: 'Testville',
            city: 'Testford',
            postcode: 'TE1 1ST',
            country: 'Wales',
          },
        },
      ],
      invoiceDetails: {
        organisation: 'London First School',
        firstName: 'Invoice',
        lastName: 'Contact',
        email: 'invoice.contact@teamteach.testinator.com',
        phone: '+445555555555',
      },
      orderId: 'b85e81c5-d856-4b7e-ba58-dad6d5bdfe8f',
    } as VirtualCourseBookingDetails,
  }
  const test = base.extend<{ courseId: number }>({
    courseId: async ({}, use) => {
      const openCourse = UNIQUE_COURSE()
      openCourse.type = Course_Type_Enum.Open
      openCourse.deliveryType = Course_Delivery_Type_Enum.Virtual

      const { id } = await insertCourse(
        openCourse,
        'trainer@teamteach.testinator.com',
      )
      await use(id)
      await deleteCourse(id)
    },
  })

  test.use({ storageState: stateFilePath(data.user as StoredCredentialKey) })

  test(`virtual course booking by ${data.user} ${data.smoke}`, async ({
    page,
    courseId,
  }) => {
    const courseDetailsPage = new CourseDetailsPage(page)
    await courseDetailsPage.goto(String(courseId))
    const bookingDetailsPage =
      await courseDetailsPage.clickAddRegistrantsButton()
    await bookingDetailsPage.goto(String(courseId))
    await bookingDetailsPage.fillBookingDetails(data.bookingDetails)
    const reviewAndConfirmPage =
      await bookingDetailsPage.clickReviewAndConfirmButton()
    await reviewAndConfirmPage.consentToTerms()
    await reviewAndConfirmPage.clickConfirmBooking()
    const courseBookingDonePage = new BookingDonePage(page)
    await courseBookingDonePage.goto(data.bookingDetails.orderId)
    await courseBookingDonePage.checkOrderSuccessMsg()
  })
})
