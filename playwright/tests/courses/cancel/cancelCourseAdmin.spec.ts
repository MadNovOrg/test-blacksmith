import { test as base } from '@playwright/test'

import { Course_Status_Enum } from '@app/generated/graphql'
import { InviteStatus, CourseType } from '@app/types'

import {
  getModuleIds,
  insertCourse,
  insertCourseModulesPromise,
  deleteCourse,
} from '../../../api/hasura-api'
import { UNIQUE_COURSE } from '../../../data/courses'
import { getModulesByLevel } from '../../../data/modules'
import { Course } from '../../../data/types'
import { users } from '../../../data/users'
import { stateFilePath } from '../../../hooks/global-setup'
import { MyCoursesPage } from '../../../pages/courses/MyCoursesPage'
import { inXMonths } from '../../../util'

const testData = [
  {
    name: 'open course',
    course: async () => {
      const course = UNIQUE_COURSE()
      course.type = CourseType.OPEN
      course.status = Course_Status_Enum.Scheduled
      course.schedule[0].start = inXMonths(3)
      course.schedule[0].end = inXMonths(3)
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
      return course
    },
  },
  // TODO uncomment after implementing https://behaviourhub.atlassian.net/browse/TTHP-575
  // {
  //   name: 'closed course',
  //   course: async () => {
  //     const course = UNIQUE_COURSE()
  //     course.type = CourseType.CLOSED
  //     course.status = Course_Status_Enum.TrainerPending
  //     course.organization = { name: 'London First School' }
  //     course.schedule[0].start = inXMonths(3)
  //     course.schedule[0].end = inXMonths(3)
  //     const moduleIds = await getModuleIds(
  //       getModulesByLevel(course.level),
  //       course.level
  //     )
  //     course.id = await insertCourse(
  //       course,
  //       users.trainer.email,
  //       InviteStatus.PENDING
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

  test.use({ storageState: stateFilePath('admin') })

  test(`cancel course as admin: ${data.name} @smoke`, async ({
    page,
    course,
  }) => {
    const adminCoursesPage = new MyCoursesPage(page)
    await adminCoursesPage.goto()
    await adminCoursesPage.searchCourse(`${course.id}`)
    const courseDetailsPage = await adminCoursesPage.clickCourseDetailsPage(
      course.id
    )
    await courseDetailsPage.clickEditCourseButton()
    await courseDetailsPage.clickCancelCourseButton()
    await courseDetailsPage.clickCancelCourseDropdown()
    await courseDetailsPage.checkCancelCourseCheckbox()
    await courseDetailsPage.clickCancelEntireCourseButton()
    await adminCoursesPage.goto()
    await adminCoursesPage.searchCourse(`${course.id}`)
    await adminCoursesPage.checkCourseStatus(course.id, 'Cancelled')
  })
}
