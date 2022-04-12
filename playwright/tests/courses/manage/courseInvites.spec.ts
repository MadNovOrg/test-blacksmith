/* eslint-disable no-empty-pattern */
import { test as base } from '@playwright/test'

import { CourseStatus, CourseType } from '../../../../src/types'
import { getLatestEmail } from '../../../api/email-api'
import {
  deleteCourse,
  getModuleIds,
  insertCourse,
  insertCourseModules,
} from '../../../api/hasura-api'
import { UNIQUE_COURSE } from '../../../data/courses'
import { MODULES_BY_LEVEL } from '../../../data/modules'
import { Course } from '../../../data/types'
import { users } from '../../../data/users'
import { stateFilePath } from '../../../hooks/global-setup'
import { CourseParticipantPage } from '../../../pages/courses/CourseParticipantPage'
import { MyCoursesPage } from '../../../pages/courses/MyCoursesPage'
import { EmailPage } from '../../../pages/EmailPage'

const test = base.extend<{ course: Course }>({
  course: async ({}, use) => {
    const course = UNIQUE_COURSE()
    course.type = CourseType.CLOSED
    course.status = CourseStatus.PUBLISHED
    const moduleIds = await getModuleIds(
      MODULES_BY_LEVEL.get(course.level),
      course.level
    )
    await insertCourse(course, users.trainer.email)
    await insertCourseModules(course.id, moduleIds)
    await use(course)
    await deleteCourse(course.id)
  },
})
test.use({ storageState: stateFilePath('trainer') })

test('course invites', async ({ page, course }) => {
  const myCoursesPage = new MyCoursesPage(page)
  await myCoursesPage.goto()
  const courseDetailsPage = await myCoursesPage.clickCourseManageButton(
    course.name
  )
  await courseDetailsPage.checkInvitesLeftText('12 invites left')
  await courseDetailsPage.clickInviteAttendeesButton()
  await courseDetailsPage.invitePopUp.enterEmails([users.user1WithOrg.email])
  await courseDetailsPage.invitePopUp.clickSendButton()
  await courseDetailsPage.checkInvitesLeftText('11 invites left')
  await courseDetailsPage.checkAttendingText('0 of 12 attending')

  const otherPage = await page.context().browser().newPage()
  const email = await getLatestEmail(users.user1WithOrg.email)
  const emailPage = new EmailPage(otherPage)
  await emailPage.renderContent(email.html)
  const invitationPage = await emailPage.clickRegisterNowButton()
  const loginPage = await invitationPage.acceptInvitation()
  await loginPage.logIn(users.user1WithOrg.email, users.user1WithOrg.password)
  const participantPage = new CourseParticipantPage(loginPage.page)
  participantPage.checkSuccessMessage(
    'You are now attending this course. Please complete the checklist.'
  )

  await courseDetailsPage.page.reload()
  await courseDetailsPage.checkAttendingText('1 of 12 attending')
  await courseDetailsPage.checkAttendingTabText('Attending (1)')
  await courseDetailsPage.checkPendingTabText('Pending (0)')
  await courseDetailsPage.checkAttendeesTableRows([users.user1WithOrg])
})
