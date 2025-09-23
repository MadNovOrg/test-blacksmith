import { test as base } from '@playwright/test'

import { Course_Status_Enum } from '@app/generated/graphql'
import { CourseParticipant } from '@app/types'

import * as API from '@qa/api'
import { FINISHED_COURSE } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'
import { CourseDetailsPage } from '@qa/fixtures/pages/courses/course-details/CourseDetailsPage.fixture'
import { stateFilePath } from '@qa/util'

const test = base.extend<{
  course: Course
  participants: CourseParticipant[]
}>({
  course: async ({}, use) => {
    const course = FINISHED_COURSE()
    course.gradingConfirmed = true
    course.status = Course_Status_Enum.GradeMissing
    course.id = (await API.course.insertCourse(course, users.trainer.email)).id
    await use(course)
    await API.course.deleteCourse(course.id)
  },
  participants: async ({ course }, use) => {
    const participants = await API.course.insertCourseParticipants(course.id, [
      users.user1WithOrg,
      users.user2WithOrg,
    ])
    await use(participants)
  },
})

const allowedRoles: string[] = ['trainer', 'admin', 'ops']

allowedRoles.forEach(role => {
  test(`${role} can grade all participants`, async ({
    browser,
    course,
    participants,
  }) => {
    const context = await browser.newContext({
      storageState: stateFilePath(role),
    })
    const page = await context.newPage()
    const courseDetailsPage = new CourseDetailsPage(page)
    await courseDetailsPage.goto(`${course.id}`)
    await courseDetailsPage.clickGradingTab()
    const courseGradingPage = await courseDetailsPage.clickGradeAllAttendees()
    await courseGradingPage.expectParticipantsToBeVisible(participants)
    await courseGradingPage.clickCourseGradingMenu()
    await courseGradingPage.clickPass()
    await courseGradingPage.submitFinalGrade()
    await courseGradingPage.clickConfirm()
    await courseGradingPage.expectParticipantsToHaveGrade(participants, 'Pass')
  })
})

allowedRoles.forEach(role => {
  test(`${role} can grade single participant`, async ({
    browser,
    course,
    participants,
  }) => {
    const context = await browser.newContext({
      storageState: stateFilePath(role),
    })
    const page = await context.newPage()
    const courseDetailsPage = new CourseDetailsPage(page)
    await courseDetailsPage.goto(`${course.id}`)
    await courseDetailsPage.clickGradingTab()
    const courseGradingPage = await courseDetailsPage.clickParticipantByGrade(
      participants[0].id,
    )
    await courseGradingPage.expectParticipantsToBeVisible([participants[0]])
    await courseGradingPage.clickCourseGradingMenu()
    await courseGradingPage.clickPass()
    await courseGradingPage.submitFinalGrade()
    await courseGradingPage.clickConfirm()
    await courseGradingPage.expectParticipantsToHaveGrade(
      [participants[0]],
      'Pass',
    )
  })
})
