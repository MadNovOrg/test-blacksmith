import { test as base } from '@playwright/test'

import { CourseType, InviteStatus } from '@app/types'

import {
  deleteCourse,
  insertCourse,
  insertCourseParticipants,
} from '../../../api/hasura-api'
import { FINISHED_COURSE } from '../../../data/courses'
import { Course } from '../../../data/types'
import { users } from '../../../data/users'
import { stateFilePath } from '../../../hooks/global-setup'
import { CourseEvaluationPage } from '../../../pages/courses/evaluation-page/CourseEvaluationPage'

const test = base.extend<{ course: Course }>({
  course: async ({}, use) => {
    const course = FINISHED_COURSE()
    course.type = CourseType.CLOSED
    course.id = await insertCourse(
      course,
      users.trainer.email,
      InviteStatus.ACCEPTED
    )
    await insertCourseParticipants(course.id, [users.user1], new Date())
    await use(course)
    await deleteCourse(course.id)
  },
})

test('course evaluation as user', async ({ browser, course }) => {
  const userContext = await browser.newContext({
    storageState: stateFilePath('user1'),
  })
  const userPage = await userContext.newPage()
  const userEvaluationPage = new CourseEvaluationPage(
    userPage,
    'user',
    `${course.id}`
  )
  await userEvaluationPage.goto()
  await userEvaluationPage.randomlyEvaluate(
    `${users.user1.givenName} ${users.user1.familyName}`
  )
  await userEvaluationPage.submitEvaluation()
  await userEvaluationPage.checkSubmission(
    'Your course evaluation feedback has been submitted'
  )

  const trainerContext = await browser.newContext({
    storageState: stateFilePath('trainer'),
  })
  const trainerPage = await trainerContext.newPage()
  const trainerEvaluationPage = new CourseEvaluationPage(
    trainerPage,
    'trainer',
    `${course.id}`
  )
  await trainerEvaluationPage.goto()
  await trainerEvaluationPage.checkSubmissionIsAvailable()
  await trainerEvaluationPage.checkPDFExportIsNotAvailable()
  await trainerEvaluationPage.randomlyEvaluate(
    `${users.trainer.givenName} ${users.trainer.familyName}`
  )
  await trainerEvaluationPage.submitEvaluation()
  await trainerEvaluationPage.checkSubmission()
  await trainerEvaluationPage.viewEvaluation()
})
