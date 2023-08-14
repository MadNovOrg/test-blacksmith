import { test as base } from '@playwright/test'

import { CourseParticipant } from '@app/types'

import * as API from '@qa/api'
import { FINISHED_COURSE } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'
import { CourseGradingDetailsPage } from '@qa/fixtures/pages/courses/CourseGradingDetailsPage.fixture'
import { stateFilePath } from '@qa/hooks/global-setup'

const test = base.extend<{
  course: Course
  participants: CourseParticipant[]
}>({
  course: async ({}, use) => {
    const course = FINISHED_COURSE()
    course.id = await API.course.insertCourse(course, users.trainer.email)
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

test.use({ storageState: stateFilePath('trainer') })

test('marks participants as attended and enables grading', async ({
  page,
  course,
  participants,
}) => {
  const gradingDetailsPage = new CourseGradingDetailsPage(page)
  await gradingDetailsPage.goto(`${course.id}`)
  await gradingDetailsPage.clickParticipantByName(
    participants[0].profile.fullName
  )
  await gradingDetailsPage.checkSelected(participants.length)
  await gradingDetailsPage.clickConfirmModules()
  const courseDetailsPage = await gradingDetailsPage.clickContinueToAttendees()
  await courseDetailsPage.checkCourseName()
})
