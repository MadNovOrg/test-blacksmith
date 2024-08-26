/* eslint-disable playwright/no-conditional-in-test */
/* eslint-disable playwright/expect-expect */
import { test as base } from '@playwright/test'

import {
  Course_Delivery_Type_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'

import * as API from '@qa/api'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { Course, TransferEligibleCourses } from '@qa/data/types'
import { users } from '@qa/data/users'
import { MyCoursesPage } from '@qa/fixtures/pages/courses/MyCoursesPage.fixture'
import { stateFilePath, StoredCredentialKey } from '@qa/util'

const allowedRoles = ['admin', 'ops', 'userOrgAdmin']

const address = {
  addresLine1: '123 Fake Street',
  addresLine2: 'Fake Town',
  city: 'Fake City',
  postcode: 'TW1 1AA',
  country: 'England',
}

const createCourses = async (): Promise<Course[]> => {
  const courses: Course[] = []

  const nonVirtualCourse = UNIQUE_COURSE()
  nonVirtualCourse.type = Course_Type_Enum.Open
  nonVirtualCourse.id = (
    await API.course.insertCourse(nonVirtualCourse, users.trainer.email)
  ).id
  courses.push(nonVirtualCourse)

  const virtualCourse = UNIQUE_COURSE()
  virtualCourse.deliveryType = Course_Delivery_Type_Enum.Virtual
  virtualCourse.type = Course_Type_Enum.Open
  virtualCourse.id = (
    await API.course.insertCourse(virtualCourse, users.trainer.email)
  ).id
  courses.push(virtualCourse)

  return courses
}

const test = base.extend<{ courses: Course[] }>({
  courses: async ({}, use) => {
    const courses = await createCourses()
    await API.course.insertCourseParticipants(courses[0].id, [
      users.user1WithOrg,
    ])
    await use(courses)
    for (const course of courses) {
      await API.course.deleteCourse(course.id)
    }
  },
})

allowedRoles.forEach(role => {
  test(`${role} can transfer an attendee to a virtual course ${
    role === 'admin' ? '@smoke' : ''
  }`, async ({ browser, courses }) => {
    const transferEligibleCourse: TransferEligibleCourses = {
      courseId: courses[1].id,
      level: courses[1].level,
      type: courses[1].type,
      deliveryType: courses[1].deliveryType,
      reaccreditation: courses[1].reaccreditation,
      courseCode: `L1.V.OP-${courses[1].id}`,
      venueName: null,
      venueCity: null,
      venueCountry: null,
    }
    const transferReason = 'Automated test'
    const context = await browser.newContext({
      storageState: stateFilePath(role as StoredCredentialKey),
    })
    const page = await context.newPage()
    const myCoursesPage = new MyCoursesPage(page)
    await myCoursesPage.gotoManageCourses(`${courses[0].id}`)
    const courseDetailsPage = await myCoursesPage.clickCourseDetailsPage(
      courses[0].id,
    )
    await courseDetailsPage.clickManageAttendance()
    const courseTransferPage = await courseDetailsPage.clickAttendeeTransfer()
    await courseTransferPage.selectCourseId(
      courses[1].id,
      transferEligibleCourse,
    )
    await courseTransferPage.clickTransferDetails()
    await courseTransferPage.clickApplyTermsAsTransferFee()

    await courseTransferPage.setTransferReason(transferReason)
    await courseTransferPage.fillPostalAddressDetails(address)

    await courseTransferPage.clickReviewAndConfirm()
    await courseTransferPage.clickConfirmTransfer(courses[1].id, transferReason)

    /*
    After confirming the transfer, we execute a mutation to transfer the attendee to the new course.
    In order to check that attendee was transfered, we will have to mock that request in hub-api,
     and after assert what we have mocked, which defeats the purpose of the test.
    */
  })
})
