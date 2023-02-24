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
import { inXMonths } from '../../../util'

const test = base.extend<{ course: Course }>({
  course: async ({}, use) => {
    const course = UNIQUE_COURSE()
    course.type = CourseType.OPEN
    course.schedule[0].start = inXMonths(2)
    course.schedule[0].end = inXMonths(2)
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

test('cancel open course as admin @smoke', async ({ browser, course }) => {
  test.setTimeout(60000)

  // Create the course and modules as a trainer
  const trainerContext = await browser.newContext({
    storageState: stateFilePath('trainer'),
  })
  const page = await trainerContext.newPage()
  const trainerCoursesPage = new MyCoursesPage(page)
  await trainerCoursesPage.goto()
  await trainerCoursesPage.searchCourse(`${course.id}`)
  await trainerCoursesPage.acceptCourse(course.id)
  await trainerCoursesPage.goToCourseBuilder()
  await trainerCoursesPage.submitDefaultModules()
  await trainerCoursesPage.confirmModules()

  // Complete the rest of the journey as admin
  const adminContext = await browser.newContext({
    storageState: stateFilePath('admin'),
  })
  const adminPage = await adminContext.newPage()
  const adminCoursesPage = new MyCoursesPage(adminPage)
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
