import { test as base } from '@playwright/test'

import { Grade_Enum } from '@app/generated/graphql'
import { CourseType, InviteStatus } from '@app/types'

import * as API from '../../api'
import { FINISHED_COURSE } from '../../data/courses'
import { Course, User } from '../../data/types'
import { users } from '../../data/users'
import { stateFilePath } from '../../hooks/global-setup'
import { CertificationPage } from '../../pages/certificate/CertificationPage'

const test = base.extend<{ certificate: { course: Course; user: User } }>({
  certificate: async ({}, use) => {
    const user = users.user1
    const course = FINISHED_COURSE()
    course.type = CourseType.CLOSED
    course.gradingConfirmed = true
    course.id = await API.course.insertCourse(
      course,
      users.trainer.email,
      InviteStatus.ACCEPTED
    )
    await API.course.insertCourseParticipants(course.id, [user])
    await API.course.insertCourseGradingForParticipants(
      course,
      [user],
      Grade_Enum.Pass
    )
    await API.course.insertCertificateForParticipants(course, [user])
    await use({ course: course, user: user })
    await API.course.deleteCourse(course.id)
  },
})

test.use({ storageState: stateFilePath('ops') })

test('ops can view the certificate on a user profile page @smoke', async ({
  page,
  certificate,
}) => {
  const certificationPage = new CertificationPage(page)
  await certificationPage.goto(
    `${certificate.user.givenName} ${certificate.user.familyName}`
  )
  const certificateId = await certificationPage.getFirstCertificate()
  const profilePage = await certificationPage.clickFirstUser()
  await profilePage.checkCertificate(certificateId)
})
