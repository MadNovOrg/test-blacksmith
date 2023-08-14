import { test as base } from '@playwright/test'

import * as API from '@qa/api'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'
import { MyCoursesPage } from '@qa/fixtures/pages/courses/MyCoursesPage.fixture'
import { stateFilePath } from '@qa/hooks/global-setup'

const allowedRoles = ['userOrgAdmin']
// No 'salesAdmin' see https://behaviourhub.atlassian.net/browse/TTHP-1532

const createCourses = async (): Promise<Course[]> => {
  const courses: Course[] = []
  for (let i = 0; i < 2; i++) {
    const course = UNIQUE_COURSE()
    course.organization = { name: 'London First School' }
    course.id = await API.course.insertCourse(course, users.trainer.email)
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
  test(`${role} can transfer an attendee to another course`, async ({
    browser,
    courses,
  }) => {
    test.fixme(process.env.E2E === 'true')
    const context = await browser.newContext({
      storageState: stateFilePath(role),
    })
    const page = await context.newPage()
    const myCoursesPage = new MyCoursesPage(page)
    await myCoursesPage.gotoManageCourses(`${courses[0].id}`)
    const courseDetailsPage = await myCoursesPage.clickCourseDetailsPage(
      courses[0].id
    )
    await courseDetailsPage.clickManageAttendance()
    const courseTransferPage = await courseDetailsPage.clickAttendeeTransfer()
    await courseTransferPage.selectCourseId(courses[1].id)
    await courseTransferPage.clickTransferDetails()
    // Need to see why this differs between manual and automated
    //await courseTransferPage.applyFeeGroup('FREE')
    await courseTransferPage.clickReviewAndConfirm()
    await courseTransferPage.clickConfirmTransfer()
    await myCoursesPage.gotoManageCourses(`${courses[1].id}`)
    const courseDetailsPage1 = await myCoursesPage.clickCourseDetailsPage(
      courses[1].id
    )
    await courseDetailsPage1.checkAttendeeExists(users.user1WithOrg)
  })
})
