/* eslint-disable no-empty-pattern */
import { test as base } from '@playwright/test'

import { CourseType, InviteStatus } from '@app/types'

import {
  deleteCourse,
  getModuleIds,
  insertCourse,
  insertCourseModules,
  insertCourseParticipants,
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
    await use(course)
    await deleteCourse(course.id)
  },
})

test('course evaluation', async ({ browser, course }) => {
  test.setTimeout(60000)
  const page = await browser.newPage({
    storageState: stateFilePath('user1'),
  })
  const courseEvaluationPage = new CourseEvaluationPage(page)
  await courseEvaluationPage.goto(String(course.id))
  await courseEvaluationPage.randomlyEvaluate(
    `${users.user1.givenName} ${users.user1.familyName}`
  )
  await courseEvaluationPage.submitEvaluation()
  await courseEvaluationPage.checkSubmission(
    'Your course evaluation feedback has been submitted'
  )
})
