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
    course.type = CourseType.CLOSED
    course.organization = { name: 'London First School' }
    course.contactProfile = users.user1WithOrg
    course.salesRepresentative = users.user2WithOrg
    course.schedule[0].start = inXMonths(2)
    course.schedule[0].end = inXMonths(2)
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
    await insertCourseModules(course.id, moduleIds)
    await use(course)
    await deleteCourse(course.id)
  },
})

test.use({ storageState: stateFilePath('salesAdmin') })

test('edit course notes as a sales rep for closed course', async ({
  page,
  course,
}) => {
  const myCoursesPage = new MyCoursesPage(page)
  await myCoursesPage.goto()
  await myCoursesPage.searchCourse(`${course.id}`)
  const courseDetailsPage = await myCoursesPage.clickCourseDetailsPage(
    course.id
  )
  await courseDetailsPage.clickEditCourseButton()
  await courseDetailsPage.fillNotes('notes3')
  //workaround to not having sales rep set in course creation, have to set it now to save edit course
  await courseDetailsPage.fillSalesRepresentative()
  await courseDetailsPage.clickSaveButton()
  await courseDetailsPage.checkNotesOnCoursePage('notes3')
})
