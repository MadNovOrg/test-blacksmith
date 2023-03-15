/* eslint-disable no-empty-pattern */
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
    name: 'accept open course as trainer @smoke',
    course: async () => {
      const course = UNIQUE_COURSE()
      course.type = CourseType.OPEN
      course.status = Course_Status_Enum.TrainerPending
      course.schedule[0].start = inXMonths(3)
      course.schedule[0].end = inXMonths(3)
      const moduleIds = await getModuleIds(
        getModulesByLevel(course.level),
        course.level
      )
      course.id = await insertCourse(
        course,
        users.trainer.email,
        InviteStatus.PENDING
      )
      await insertCourseModulesPromise(course.id, moduleIds)
      return course
    },
  },
  // TODO uncomment after implementing https://behaviourhub.atlassian.net/browse/TTHP-575
  // {
  //   name: 'accept indirect course as trainer',
  //   course: async () => {
  //     const course = UNIQUE_COURSE()
  //     course.type = CourseType.INDIRECT
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
  // {
  //   name: 'accept closed course as trainer @smoke',
  //   course: async () => {
  //     const course = UNIQUE_COURSE()
  //     course.type = CourseType.CLOSED
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

  test.use({ storageState: stateFilePath('trainer') })

  // `Fails due to schedule status of course reporting back as 'null' after clicking confirmModules`
  test.fixme(data.name, async ({ page, course }) => {
    const myCoursesPage = new MyCoursesPage(page)
    await myCoursesPage.goto()
    await myCoursesPage.searchCourse(`${course.id}`)
    await myCoursesPage.acceptCourse(course.id)
    await myCoursesPage.goToCourseBuilder()
    await myCoursesPage.submitDefaultModules()
    const courseDetails = await myCoursesPage.confirmModules()
    await courseDetails.waitForLoad()
    await myCoursesPage.goto()
    await myCoursesPage.searchCourse(`${course.id}`)
    await myCoursesPage.checkCourseStatus(course.id, 'Scheduled')
  })
}
