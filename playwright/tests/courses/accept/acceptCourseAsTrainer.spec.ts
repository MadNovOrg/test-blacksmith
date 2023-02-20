/* eslint-disable no-empty-pattern */
import { test as base } from '@playwright/test'

import { Course_Status_Enum } from '@app/generated/graphql'
import { InviteStatus, CourseType } from '@app/types'

import {
  getModuleIds,
  insertCourse,
  insertCourseModules,
  deleteCourse,
} from '../../../api/hasura-api'
import { UNIQUE_COURSE } from '../../../data/courses'
import { getModulesByLevel } from '../../../data/modules'
import { Course } from '../../../data/types'
import { users } from '../../../data/users'
import { stateFilePath } from '../../../hooks/global-setup'
import { MyCoursesPage } from '../../../pages/courses/MyCoursesPage'
const test = base.extend<{ course: Course }>({
  course: async ({}, use) => {
    const course = UNIQUE_COURSE()
    course.type = CourseType.OPEN
    course.schedule[0].start = new Date('2024-03-15T09:00:00Z')
    course.schedule[0].end = new Date('2024-03-15T16:00:00Z')
    course.status = Course_Status_Enum.TrainerPending
    const moduleIds = await getModuleIds(
      getModulesByLevel(course.level),
      course.level
    )
    course.id = await insertCourse(
      course,
      users.trainer.email,
      InviteStatus.PENDING
    )
    await insertCourseModules(course.id, moduleIds)
    await use(course)
    await deleteCourse(course.id)
  },
})
test.use({ storageState: stateFilePath('trainer') })
test('accept open course as trainer @smoke', async ({ page, course }) => {
  test.setTimeout(60000)
  const myCoursesPage = new MyCoursesPage(page)
  await myCoursesPage.goto()
  await myCoursesPage.searchCourse(`${course.id}`)
  await myCoursesPage.acceptCourse()
  await myCoursesPage.goToCourseBuilder()
  await myCoursesPage.submitDefaultModules()
  await myCoursesPage.confirmModules()
  await myCoursesPage.goto()
  await myCoursesPage.searchCourse(`${course.id}`)
  await myCoursesPage.checkCourseStatus(course.id, 'Scheduled')
})
