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

const testData = [
  {
    name: 'open course',
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
      await insertCourseModules(course.id, moduleIds)
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
  //     await insertCourseModules(course.id, moduleIds)
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

  test(`cancel course as admin: ${data.name} @smoke`, async ({
    browser,
    course,
  }) => {
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
}
