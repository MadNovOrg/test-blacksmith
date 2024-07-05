import { test as base } from '@playwright/test'

import { Course_Type_Enum, Grade_Enum } from '@app/generated/graphql'

import * as API from '@qa/api'
import { FINISHED_COURSE } from '@qa/data/courses'
import { Course, User } from '@qa/data/types'
import { users } from '@qa/data/users'
import { CertificationPage } from '@qa/fixtures/pages/certificate/CertificationPage.fixture'
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

test.use({ storageState: stateFilePath('salesAdmin') })

test('sales can view the certificate on the certificate page @smoke', async ({
  page,
  certificate,
}) => {
  const certificationPage = new CertificationPage(page)
  await certificationPage.goto(
    `${certificate.user.givenName} ${certificate.user.familyName}`,
  )
  await certificationPage.clickFirstViewCertificate()
  await certificationPage.confirmGrade(Grade_Enum.Pass)
})
