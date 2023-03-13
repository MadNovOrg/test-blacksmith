import { test as base } from '@playwright/test'

import { Course_Status_Enum } from '@app/generated/graphql'
import { CourseModule, CourseParticipant, InviteStatus } from '@app/types'

import {
  deleteCourse,
  getModuleIds,
  insertCourse,
  insertCourseModules,
  insertCourseParticipants,
} from '../../api/hasura-api'
import { FINISHED_COURSE } from '../../data/courses'
import { getModulesByLevel } from '../../data/modules'
import { Course } from '../../data/types'
import { users } from '../../data/users'
import { stateFilePath } from '../../hooks/global-setup'
import { CourseDetailsPage } from '../../pages/courses/CourseDetailsPage'

const test = base.extend<{
  course: Course
  participants: CourseParticipant[]
  modules: CourseModule[]
}>({
  course: async ({}, use) => {
    const course = FINISHED_COURSE()
    course.gradingConfirmed = true
    course.status = Course_Status_Enum.GradeMissing

    course.id = await insertCourse(
      course,
      users.trainer.email,
      InviteStatus.ACCEPTED
    )

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

    const modules = await insertCourseModules(course.id, moduleIds, true)

    await use(modules)
  },
})

test.use({ storageState: stateFilePath('trainer') })

test('trainer can grade all participants', async ({
  page,
  course,
  participants,
  modules,
}) => {
  const courseDetailsPage = new CourseDetailsPage(page)
  await courseDetailsPage.goto(`${course.id}`)
  await courseDetailsPage.clickGradingTab()
  const courseGradingPage = await courseDetailsPage.clickGradeAllAttendees()
  await courseGradingPage.expectParticipantsToBeVisible(participants)
  await courseGradingPage.clickCourseGradingMenu()
  await courseGradingPage.clickPass()
  await courseGradingPage.clickModules(modules[0].module.moduleGroup.name)
  await courseGradingPage.fillInFeedback('Feedback')
  await courseGradingPage.submitFinalGrade()
  await courseGradingPage.clickConfirm()
  await courseGradingPage.expectParticipantsToHaveGrade(participants, 'Pass')
})

test('trainer can grade single participant', async ({
  page,
  course,
  participants,
  modules,
}) => {
  const courseDetailsPage = new CourseDetailsPage(page)
  await courseDetailsPage.goto(`${course.id}`)
  await courseDetailsPage.clickGradingTab()
  const courseGradingPage = await courseDetailsPage.clickParticipantByGrade(
    participants[0].id
  )
  await courseGradingPage.expectParticipantsToBeVisible([participants[0]])
  await courseGradingPage.clickCourseGradingMenu()
  await courseGradingPage.clickPass()
  await courseGradingPage.clickModules(modules[0].module.moduleGroup.name)
  await courseGradingPage.fillInFeedback('Feedback')
  await courseGradingPage.submitFinalGrade()
  await courseGradingPage.clickConfirm()
  await courseGradingPage.expectParticipantsToHaveGrade(
    [participants[0]],
    'Pass'
  )
})
