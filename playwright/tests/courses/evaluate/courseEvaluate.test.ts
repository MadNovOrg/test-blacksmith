import { test as base } from '@playwright/test'

import { CourseType } from '@app/types'

import * as API from '@qa/api'
import { FINISHED_COURSE } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'
import { CourseEvaluationPage } from '@qa/fixtures/pages/courses/evaluation-page/CourseEvaluationPage.fixture'
import { stateFilePath } from '@qa/util'

const test = base.extend<{ course: Course }>({
  course: async ({}, use) => {
    const course = FINISHED_COURSE()
    course.type = CourseType.CLOSED
    course.id = await API.course.insertCourse(course, users.trainer.email)
    await API.course.insertCourseParticipants(course.id, [users.user1])
    await use(course)
    await API.course.deleteCourse(course.id)
  },
})

test('course evaluation as user', async ({ browser, course }) => {
  test.fail(true, 'See https://behaviourhub.atlassian.net/browse/TTHP-1748')
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
