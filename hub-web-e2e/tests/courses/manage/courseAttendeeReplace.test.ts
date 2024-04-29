import { test as base } from '@playwright/test'

import * as API from '@qa/api'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'
import { MyCoursesPage } from '@qa/fixtures/pages/courses/MyCoursesPage.fixture'
import { stateFilePath } from '@qa/util'

const test = base.extend<{ course: Course }>({
  course: async ({}, use) => {
    const course = UNIQUE_COURSE()
    course.organization = { name: 'London First School' }
    course.id = (await API.course.insertCourse(course, users.trainer.email)).id
    await API.course.insertCourseParticipants(course.id, [users.user2WithOrg])
    await use(course)
    await API.course.deleteCourse(course.id)
  },
})

test.use({ storageState: stateFilePath('admin') })

test(`replace an attendee on a course`, async ({ course, page }) => {
  const myCoursesPage = new MyCoursesPage(page)
  await myCoursesPage.gotoManageCourses(`${course.id}`)
  const courseDetailsPage = await myCoursesPage.clickCourseDetailsPage(
    course.id
  )
  await courseDetailsPage.clickManageAttendance()
  const replaceAttendeePopup = await courseDetailsPage.clickAttendeeReplace()
  await replaceAttendeePopup.replaceAttendee(users.user1WithOrg)

  await courseDetailsPage.checkAttendeeExists(users.user1WithOrg)
})
