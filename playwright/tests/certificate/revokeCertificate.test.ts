import { test as base } from '@playwright/test'

import { Grade_Enum } from '@app/generated/graphql'
import { CourseType } from '@app/types'

import * as API from '@qa/api'
import { FINISHED_COURSE } from '@qa/data/courses'
import { Course, User } from '@qa/data/types'
import { users } from '@qa/data/users'
import { CertificationPage } from '@qa/fixtures/pages/certificate/CertificationPage.fixture'
import { stateFilePath } from '@qa/hooks/global-setup'

const allowedRoles = ['ops', 'admin']

const test = base.extend<{ certificate: { course: Course; user: User } }>({
  certificate: async ({}, use) => {
    test.fixme(process.env.E2E === 'true')
    const user = users.user1
    const course = FINISHED_COURSE()
    course.type = CourseType.CLOSED
    course.gradingConfirmed = true
    course.id = await API.course.insertCourse(course, users.trainer.email)
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

allowedRoles.forEach(role => {
  test.use({ storageState: stateFilePath(role) })

  test(`${role} can revoke a certificate`, async ({ page, certificate }) => {
    const certificationPage = new CertificationPage(page)
    await certificationPage.goto(
      `${certificate.user.givenName} ${certificate.user.familyName}`
    )
    const certPage = await certificationPage.clickViewCertificate(
      certificate.course.id
    )
    await certPage.clickManageCertificateButton()
    const revokeCertPopup = await certPage.clickRevokeCertificate()
    //new popup page
    await revokeCertPopup.selectReasonDropdown()
    await revokeCertPopup.addAReason('reason')
    await revokeCertPopup.tickCheckBox()
    await revokeCertPopup.submitRevokePopup()
    await certPage.displayRevokeCertAlert()
  })
})
