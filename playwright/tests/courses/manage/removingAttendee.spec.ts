import { test as base } from '@playwright/test'

import { Course_Status_Enum } from '@app/generated/graphql'
import { CourseType, InviteStatus } from '@app/types'

import {
  deleteCourse,
  getModuleIds,
  insertCourse,
  insertCourseModulesPromise,
  insertCourseParticipants,
} from '../../../api/hasura-api'
import { UNIQUE_COURSE } from '../../../data/courses'
import { getModulesByLevel } from '../../../data/modules'
import { Course } from '../../../data/types'
import { users } from '../../../data/users'
import { stateFilePath } from '../../../hooks/global-setup'
import { MyCoursesPage } from '../../../pages/courses/MyCoursesPage'

const testData = [
  {
    user: 'admin',
    userToRemove: users.user2,
    course: async () => {
      const course = UNIQUE_COURSE()
      course.type = CourseType.OPEN
      course.status = Course_Status_Enum.Scheduled
      const moduleIds = await getModuleIds(
        getModulesByLevel(course.level),
        course.level
      )
      course.id = await insertCourse(
        course,
        users.trainer.email,
        InviteStatus.ACCEPTED
      )
      await insertCourseModulesPromise(course.id, moduleIds)
      await insertCourseParticipants(
        course.id,
        [users.user1WithOrg, users.user2WithOrg, users.user1, users.user2],
        new Date()
      )
      return course
    },
  },
  // TODO uncomment tests after fixing TTHP-1161
  // {
  //   user: 'ops',
  //   userToRemove: users.user2WithOrg,
  //   course: async () => {
  //     const course = UNIQUE_COURSE()
  //     course.type = CourseType.OPEN
  //     course.status = Course_Status_Enum.Scheduled
  //     const moduleIds = await getModuleIds(
  //       getModulesByLevel(course.level),
  //       course.level
  //     )
  //     course.id = await insertCourse(
  //       course,
  //       users.trainer.email,
  //       InviteStatus.ACCEPTED
  //     )
  //     await insertCourseModulesPromise(course.id, moduleIds)
  //     return course
  //   },
  // },
]

for (const data of testData) {
  const test = base.extend<{ course: Course }>({
    course: async ({}, use) => {
      const course = await data.course()
      await use(course)
      await deleteCourse(course.id)
    },
  })

  test(`removing the attendee from open course using ${data.user}`, async ({
    browser,
    course,
  }) => {
    test.setTimeout(60000)
    const trainerContext = await browser.newContext({
      storageState: stateFilePath(data.user),
    })
    const page = await trainerContext.newPage()
    const myCoursesPage = new MyCoursesPage(page)
    await myCoursesPage.goto()
    await myCoursesPage.searchCourse(`${course.id}`)
    const courseDetailsPage = await myCoursesPage.clickCourseDetailsPage(
      course.id
    )

    await courseDetailsPage.checkAttendingText(
      `4 of ${course.max_participants} attending`
    )
    await courseDetailsPage.clickManageAttendanceByAttendeeData(
      data.userToRemove.email
    )

    const attendeeRemovingPopup = await courseDetailsPage.clickAttendeeRemove()
    await attendeeRemovingPopup.removeAttendeeWithNoteUsingUser(
      data.user,
      `Reason of removing ${data.userToRemove.email}`
    )
    await courseDetailsPage.checkAttendingText(
      `3 of ${course.max_participants} attending`
    )
  })
}
