/* eslint-disable no-empty-pattern */
import { test as base } from '@playwright/test'

import { CourseStatus, CourseType, InviteStatus } from '../../../../src/types'
import { getLatestEmail } from '../../../api/email-api'
import {
  deleteCourse,
  getModuleIds,
  insertCourse,
  insertCourseModules,
} from '../../../api/hasura-api'
import { TARGET_ENV } from '../../../constants'
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
    await insertCourse(course, users.trainer.email, InviteStatus.ACCEPTED)
    await insertCourseModules(course.id, moduleIds)
    await use(course)
    await deleteCourse(course.id)
  },
})

test('course invites', async ({ browser, course }) => {
  test.skip(TARGET_ENV === 'local')
  test.setTimeout(60000)
  const trainerContext = await browser.newContext({
    storageState: stateFilePath('trainer'),
  })
  const page = await trainerContext.newPage()
  const myCoursesPage = new MyCoursesPage(page)
  await myCoursesPage.goto()
  const courseDetailsPage = await myCoursesPage.clickCourseManageButton(
    course.id
  )
  await courseDetailsPage.checkInvitesLeftText('12 invites left')
  await courseDetailsPage.clickInviteAttendeesButton()
  await courseDetailsPage.invitePopUp.enterEmails([users.user1WithOrg.email])
  await courseDetailsPage.invitePopUp.clickSendButton()
  await courseDetailsPage.checkInvitesLeftText('11 invites left')
  await courseDetailsPage.checkAttendingText('0 of 12 attending')

  const otherPage = await browser.newPage()
  const email = await getLatestEmail(users.user1WithOrg.email)
  const emailPage = new EmailPage(otherPage)
  await emailPage.renderContent(email.html)
  const invitationPage = await emailPage.clickRegisterNowButton()
  const loginPage = await invitationPage.acceptInvitation()
  await loginPage.logIn(users.user1WithOrg.email, users.user1WithOrg.password)
  const participantPage = new CourseParticipantPage(loginPage.page)
  await participantPage.checkSuccessMessage(
    'You are now attending this course. Please complete the checklist.'
  )

  await courseDetailsPage.page.reload()
  await courseDetailsPage.checkAttendingText('1 of 12 attending')
  await courseDetailsPage.checkAttendingTabText('Attending (1)')
  await courseDetailsPage.checkPendingTabText('Pending (0)')
  await courseDetailsPage.checkAttendeesTableRows([users.user1WithOrg])
})
