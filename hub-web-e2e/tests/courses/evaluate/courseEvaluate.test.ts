/* eslint-disable playwright/expect-expect */
import { test as base } from '@playwright/test'
import { subDays } from 'date-fns'

import { Course_Status_Enum, Course_Type_Enum } from '@app/generated/graphql'
import { RoleName } from '@app/types'

import * as API from '@qa/api'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'
import { CourseEvaluationPage } from '@qa/fixtures/pages/courses/evaluation-page/CourseEvaluationPage.fixture'
import { stateFilePath } from '@qa/util'

const test = base.extend<{ course: Course }>({
  course: async ({}, use) => {
    const course = UNIQUE_COURSE()

    course.schedule = [
      { start: subDays(new Date(), 2), end: subDays(new Date(), 1) },
    ]
    course.status = Course_Status_Enum.EvaluationMissing
    course.type = Course_Type_Enum.Closed

    course.id = (await API.course.insertCourse(course, users.trainer.email)).id

    await API.course.insertCourseParticipants(course.id, [users.user1])
    await use(course)
    await API.course.deleteCourse(course.id)
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
    `${course.id}`,
  )
  await userEvaluationPage.goto()
  await userEvaluationPage.randomlyEvaluate(
    `${users.user1.givenName} ${users.user1.familyName}`,
  )
  await userEvaluationPage.submitEvaluation()
  await userEvaluationPage.checkSubmission(
    'Your course evaluation has been submitted.',
  )

  const trainerContext = await browser.newContext({
    storageState: stateFilePath('trainer'),
  })
  const trainerPage = await trainerContext.newPage()
  const trainerEvaluationPage = new CourseEvaluationPage(
    trainerPage,
    'trainer',
    `${course.id}`,
  )
  await trainerEvaluationPage.goto()
  await trainerEvaluationPage.checkSubmissionIsAvailable()
  await trainerEvaluationPage.checkPDFExportIsNotAvailable()
  await trainerEvaluationPage.randomlyEvaluate(
    `${users.trainer.givenName} ${users.trainer.familyName}`,
    RoleName.TRAINER,
  )
  await trainerEvaluationPage.submitEvaluation()
  await trainerEvaluationPage.checkSubmission()
  await trainerEvaluationPage.viewEvaluation()
})
