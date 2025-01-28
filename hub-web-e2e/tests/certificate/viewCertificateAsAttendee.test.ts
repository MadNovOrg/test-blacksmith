/* eslint-disable playwright/expect-expect */
import { test as base } from '@playwright/test'

import { Course_Type_Enum, Grade_Enum } from '@app/generated/graphql'

import * as API from '@qa/api'
import { FINISHED_COURSE } from '@qa/data/courses'
import { Course, User } from '@qa/data/types'
import { users } from '@qa/data/users'
import { MyCoursesPage } from '@qa/fixtures/pages/courses/MyCoursesPage.fixture'
import { stateFilePath } from '@qa/util'

const test = base.extend<{ certificate: { course: Course; user: User } }>({
  certificate: async ({}, use) => {
    test.fixme(process.env.E2E === 'true')
    const user = users.user1
    const course = FINISHED_COURSE()
    course.type = Course_Type_Enum.Closed
    course.gradingConfirmed = true
    course.id = (await API.course.insertCourse(course, users.trainer.email)).id
    await API.course.insertCourseParticipants(course.id, [user])
    await API.course.insertCourseGradingForParticipants(
      course,
      [user],
      Grade_Enum.Pass,
    )
    await API.course.insertCertificateForParticipants(course, [user])
    await use({ course: course, user: user })
    await API.course.deleteCourse(course.id)
  },
})

test.use({ storageState: stateFilePath('user1') })

test('attendee can view the certificate from the courses page @smoke', async ({
  page,
  certificate,
}) => {
  const myCoursesPage = new MyCoursesPage(page)
  await myCoursesPage.goto(`${certificate.course.id}`)
  const courseDetailsPage = await myCoursesPage.clickCourseDetailsPage(
    certificate.course.id,
  )
  await courseDetailsPage.clickCertification()
  await courseDetailsPage.checkCertification('Pass')
})
