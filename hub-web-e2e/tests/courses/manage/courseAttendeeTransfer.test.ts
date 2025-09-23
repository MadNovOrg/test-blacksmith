/* eslint-disable playwright/no-conditional-in-test */
/* eslint-disable playwright/expect-expect */
import { test as base } from '@playwright/test'

import * as API from '@qa/api'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { Course, TransferEligibleCourses } from '@qa/data/types'
import { users } from '@qa/data/users'
import { MyCoursesPage } from '@qa/fixtures/pages/courses/MyCoursesPage.fixture'
import { stateFilePath, StoredCredentialKey } from '@qa/util'

const allowedRoles = ['userOrgAdmin']
// No 'salesAdmin' see https://behaviourhub.atlassian.net/browse/TTHP-1532

const createCourses = async (): Promise<Course[]> => {
  const courses: Course[] = []
  for (let i = 0; i < 2; i++) {
    const course = UNIQUE_COURSE()
    course.organization = { name: 'London First School' }
    course.id = (await API.course.insertCourse(course, users.trainer.email)).id
    courses.push(course)
  }
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
  test(`${role} can transfer an attendee to another course @smoke`, async ({
    browser,
    courses,
  }) => {
    const transferEligibleCourse: TransferEligibleCourses = {
      courseId: courses[1].id,
      level: courses[1].level,
      type: courses[1].type,
      deliveryType: courses[1].deliveryType,
      reaccreditation: courses[1].reaccreditation,
      courseCode: courses[1].course_code ?? '',
      venueName: courses[1].schedule[0].venue?.name ?? '',
      venueCity: courses[1].schedule[0].venue?.city ?? '',
      venueCountry: courses[1].schedule[0].venue?.country ?? '',
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
    if (role !== 'userOrgAdmin') {
      await courseTransferPage.clickApplyTermsAsTransferFee()
    }
    await courseTransferPage.setTransferReason(transferReason)

    await courseTransferPage.clickReviewAndConfirm()
    await courseTransferPage.clickConfirmTransfer(
      courses[1].id, // courseId
      transferReason,
    )

    /*
    After confirming the transfer, we execute a mutation to transfer the attendee to the new course.
    In order to check that attendee was transfered, we will have to mock that request in hub-api,
     and after assert what we have mocked, which defeats the purpose of the test.
    */
  })
})
