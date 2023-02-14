/* eslint-disable no-empty-pattern */
import { test as base } from '@playwright/test'

import { CourseType, InviteStatus } from '@app/types'

import {
  deleteCourse,
  getModuleIds,
  insertCourse,
  insertCourseModules,
  insertCourseParticipants,
  makeSureTrainerHasCourses,
} from '../../../api/hasura-api'
import { FINISHED_COURSE } from '../../../data/courses'
import { getModulesByLevel } from '../../../data/modules'
import { Course } from '../../../data/types'
import { users } from '../../../data/users'
import { stateFilePath } from '../../../hooks/global-setup'
import { CourseEvaluationPage } from '../../../pages/courses/CourseEvaluationPage'

const test = base.extend<{ course: Course }>({
  course: async ({}, use) => {
    const course = FINISHED_COURSE()
    course.type = CourseType.CLOSED
    const moduleIds = await getModuleIds(
      getModulesByLevel(course.level),
      course.level
    )
    course.id = await insertCourse(
      course,
      users.trainer.email,
      InviteStatus.ACCEPTED
    )
    await insertCourseParticipants(course.id, [users.user1], new Date())
    await insertCourseModules(course.id, moduleIds)
    await makeSureTrainerHasCourses([course], users.trainer.email)
    await use(course)
    await deleteCourse(course.id)
  },
})

test('course evaluation', async ({ browser, course }) => {
  test.setTimeout(90000)
  const userContext = await browser.newContext({
    storageState: stateFilePath('user1'),
  })
  const trainerContext = await browser.newContext({
    storageState: stateFilePath('trainer'),
  })

  const trainerPage = await trainerContext.newPage()
  const userPage = await userContext.newPage()

  // Users evaluation
  const userEvaluationPage = new CourseEvaluationPage(
    userPage,
    'user',
    String(course.id)
  )

  await userEvaluationPage.goto()
  await userEvaluationPage.randomlyEvaluate(
    `${users.user1.givenName} ${users.user1.familyName}`
  )
  await userEvaluationPage.submitEvaluation()
  await userEvaluationPage.checkSubmission(
    'Your course evaluation feedback has been submitted'
  )

  // Trainer evaluation -- should be available now
  const trainerEvaluationPage = new CourseEvaluationPage(
    trainerPage,
    'trainer',
    String(course.id)
  )

  await trainerEvaluationPage.goto()
  await trainerEvaluationPage.checkSubmissionIsAvailable()
  await trainerEvaluationPage.checkPDFExportIsNotAvailable()
  await trainerEvaluationPage.randomlyEvaluate(
    `${users.trainer.givenName} ${users.trainer.familyName}`
  )
  await trainerEvaluationPage.submitEvaluation()
  await trainerEvaluationPage.checkSubmission()
  // Trainer should be able to view evaluation
  await trainerEvaluationPage.viewEvaluation()
})
