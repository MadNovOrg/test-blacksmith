import { test as base } from '@playwright/test'

import * as API from '@qa/api'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'
import { MyCoursesPage } from '@qa/fixtures/pages/courses/MyCoursesPage.fixture'
import { stateFilePath } from '@qa/util'

const usersArray = [
  users.user1WithOrg,
  users.user2WithOrg,
  users.user1,
  users.user2,
]

const testData = [
  {
    user: 'admin',
    userToRemove: users.user2,
  },
  {
    user: 'ops',
    userToRemove: users.user2WithOrg,
  },
]

for (const data of testData) {
  const test = base.extend<{ course: Course }>({
    course: async ({}, use) => {
      const course = UNIQUE_COURSE()
      course.id = (
        await API.course.insertCourse(course, users.trainer.email)
      ).id
      await API.course.insertCourseParticipants(course.id, usersArray)
      await use(course)
      await API.course.deleteCourse(course.id)
    },
  })

  test(`removing the attendee from open course using ${data.user}`, async ({
    browser,
    course,
  }) => {
    const trainerContext = await browser.newContext({
      storageState: stateFilePath(data.user),
    })
    const page = await trainerContext.newPage()
    const myCoursesPage = new MyCoursesPage(page)
    await myCoursesPage.goto(`${course.id}`)
    const courseDetailsPage = await myCoursesPage.clickCourseDetailsPage(
      course.id,
    )
    await courseDetailsPage.checkAttendingText(
      usersArray.length,
      course.max_participants,
    )
    await courseDetailsPage.clickManageAttendanceByAttendeeData(
      data.userToRemove.email,
    )
    const attendeeRemovingPopup = await courseDetailsPage.clickAttendeeRemove()
    await attendeeRemovingPopup.cancelAttendeeWithNoteUsingUser()
    await courseDetailsPage.checkAttendingText(
      usersArray.length - 1,
      course.max_participants,
    )
  })
}
