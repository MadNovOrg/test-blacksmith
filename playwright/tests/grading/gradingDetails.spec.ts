import { test as base } from '@playwright/test'

import { CourseModule, CourseParticipant } from '@app/types'

import {
  deleteCourse,
  getModuleIds,
  insertCourse,
  insertCourseModulesPromise,
  insertCourseParticipants,
} from '../../api/hasura-api'
import { FINISHED_COURSE } from '../../data/courses'
import { getModulesByLevel } from '../../data/modules'
import { Course } from '../../data/types'
import { users } from '../../data/users'
import { stateFilePath } from '../../hooks/global-setup'
import { CourseGradingDetailsPage } from '../../pages/courses/CourseGradingDetailsPage'

const test = base.extend<{
  course: Course
  participants: CourseParticipant[]
  modules: CourseModule[]
}>({
  course: async ({}, use) => {
    const course = FINISHED_COURSE()
    course.id = await insertCourse(course, users.trainer.email)
    await use(course)
    await deleteCourse(course.id)
  },
  participants: async ({ course }, use) => {
    const participants = await insertCourseParticipants(
      course.id,
      [users.user1WithOrg, users.user2WithOrg],
      new Date('2022-03-14T00:00:00Z')
    )
    await use(participants)
  },
  modules: async ({ course }, use) => {
    const moduleIds = await getModuleIds(
      getModulesByLevel(course.level),
      course.level
    )
    const modules = await insertCourseModulesPromise(course.id, moduleIds)
    await use(modules)
  },
})

test.use({ storageState: stateFilePath('trainer') })

test('marks participants as attended and enables grading', async ({
  page,
  course,
  participants,
  modules,
}) => {
  const gradingDetailsPage = new CourseGradingDetailsPage(page)
  await gradingDetailsPage.goto(`${course.id}`)
  await gradingDetailsPage.clickParticipantByName(
    participants[0].profile.fullName
  )
  await gradingDetailsPage.checkSelected(participants.length)
  await gradingDetailsPage.clickConfirmModules()
  await gradingDetailsPage.clickModules(modules[0].module.moduleGroup.name)
  await gradingDetailsPage.clickContinueToAttendees()
})
