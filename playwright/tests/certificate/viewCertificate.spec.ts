import { test as base } from '@playwright/test'

import { Grade_Enum } from '@app/generated/graphql'
import { CourseType, InviteStatus } from '@app/types'

import * as API from '../../api'
import { FINISHED_COURSE } from '../../data/courses'
import { Course, User } from '../../data/types'
import { users } from '../../data/users'
import { stateFilePath } from '../../hooks/global-setup'
import { CertificationPage } from '../../pages/certificate/CertificationPage'
import { MyCoursesPage } from '../../pages/courses/MyCoursesPage'

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

test('ops can view the certificate on a user profile page @smoke', async ({
  browser,
  certificate,
}) => {
  const opsContext = await browser.newContext({
    storageState: stateFilePath('ops'),
  })
  const opsPage = await opsContext.newPage()
  const certificationPage = new CertificationPage(opsPage)
  await certificationPage.goto(
    `${certificate.user.givenName} ${certificate.user.familyName}`
  )
  const certificateId = await certificationPage.getFirstCertificate()
  const profilePage = await certificationPage.clickFirstUser()
  await profilePage.checkCertificate(certificateId)
})

test('sales can view the certificate on the certificate page @smoke', async ({
  browser,
  certificate,
}) => {
  const salesContext = await browser.newContext({
    storageState: stateFilePath('salesAdmin'),
  })
  const salesPage = await salesContext.newPage()
  const certificationPage = new CertificationPage(salesPage)
  await certificationPage.goto(
    `${certificate.user.givenName} ${certificate.user.familyName}`
  )
  const certificateId = await certificationPage.getFirstCertificate()
  const certificatePage = await certificationPage.clickFirstViewCertificate()
  await certificatePage.checkCertificate(certificateId)
})

test('attendee can view the certificate from the courses page @smoke', async ({
  browser,
  certificate,
}) => {
  const userContext = await browser.newContext({
    storageState: stateFilePath('user1'),
  })
  const userPage = await userContext.newPage()
  const myCoursesPage = new MyCoursesPage(userPage)
  await myCoursesPage.goto(`${certificate.course.id}`)
  const courseDetailsPage = await myCoursesPage.clickCourseDetailsPage(
    certificate.course.id
  )
  await courseDetailsPage.clickCertification()
  await courseDetailsPage.checkCertification('Pass')
})
