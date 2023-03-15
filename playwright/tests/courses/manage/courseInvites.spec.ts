import { test as base } from '@playwright/test'

import { Course_Status_Enum } from '@app/generated/graphql'
import { CourseType, InviteStatus } from '@app/types'

import { getLatestEmail } from '../../../api/email-api'
import {
  deleteCourse,
  getModuleIds,
  insertCourse,
  insertCourseModulesPromise,
} from '../../../api/hasura-api'
import { UNIQUE_COURSE } from '../../../data/courses'
import { getModulesByLevel } from '../../../data/modules'
import { Course } from '../../../data/types'
import { users } from '../../../data/users'
import { stateFilePath } from '../../../hooks/global-setup'
import { MyCoursesPage } from '../../../pages/courses/MyCoursesPage'
import { EmailPage } from '../../../pages/EmailPage'

const testData = [
  {
    name: 'indirect course',
    user: 'trainer',
    course: async () => {
      const course = UNIQUE_COURSE()
      course.type = CourseType.INDIRECT
      course.status = Course_Status_Enum.Scheduled
      const moduleIds = await getModuleIds(
        getModulesByLevel(course.level),
        course.level
      )
      course.id = await insertCourse(
        course,
        users.trainer.email,
        InviteStatus.ACCEPTED
      )
      await insertCourseModulesPromise(course.id, moduleIds)
      return course
    },
  },
  {
    name: 'closed course',
    user: 'admin',
    isSmoke: true,
    course: async () => {
      const course = UNIQUE_COURSE()
      course.type = CourseType.CLOSED
      course.status = Course_Status_Enum.Scheduled
      const moduleIds = await getModuleIds(
        getModulesByLevel(course.level),
        course.level
      )
      course.id = await insertCourse(
        course,
        users.trainer.email,
        InviteStatus.ACCEPTED
      )
      await insertCourseModulesPromise(course.id, moduleIds)
      return course
    },
  },
]

for (const data of testData) {
  const test = base.extend<{ course: Course }>({
    course: async ({}, use) => {
      const course = await data.course()
      await use(course)
      await deleteCourse(course.id)
    },
  })

  test(`course invites for ${data.name} being ${data.user}`, async ({
    browser,
    course,
  }) => {
    const trainerContext = await browser.newContext({
      storageState: stateFilePath(data.user),
    })
    const page = await trainerContext.newPage()
    const myCoursesPage = new MyCoursesPage(page)
    await myCoursesPage.goto()
    await myCoursesPage.searchCourse(`${course.id}`)
    const courseDetailsPage = await myCoursesPage.clickCourseDetailsPage(
      course.id
    )

    await courseDetailsPage.checkInvitesLeftText(
      `${course.max_participants} invites left`
    )
    const invitePopUp = await courseDetailsPage.clickInviteAttendeesButton()
    await invitePopUp.enterEmails([users.user1WithOrg.email])
    await invitePopUp.clickSendButton()
    await courseDetailsPage.checkInvitesLeftText(
      `${course.max_participants - 1} invites left`
    )
    await courseDetailsPage.checkAttendingText(
      `0 of ${course.max_participants} attending`
    )

    const otherPage = await browser.newPage()
    const email = await getLatestEmail(users.user1WithOrg.email)
    const emailPage = new EmailPage(otherPage)
    await emailPage.renderContent(email.html)
    const invitationPage = await emailPage.clickRegisterNowButton()
    const attendeeCourseDetailsPage = await invitationPage.acceptInvitation()
    await attendeeCourseDetailsPage.checkSuccessMessage(
      'You are now attending this course. Please complete the checklist.'
    )
    await courseDetailsPage.page.reload()
    await courseDetailsPage.checkAttendingText(
      `1 of ${course.max_participants} attending`
    )
    await courseDetailsPage.checkAttendingTabText('Attending (1)')
    await courseDetailsPage.checkPendingTabText('Pending (0)')
    // For trainer we're masking the personal data
    // TODO change the validation after we'll get the information which personal data we should present to the Trainer
    // eslint-disable-next-line playwright/no-conditional-in-test
    data.user === 'admin'
      ? await courseDetailsPage.checkAttendeesTableRows([users.user1WithOrg])
      : await courseDetailsPage.checkAttendeesTableNumberOfRows([
          users.user1WithOrg,
        ])
  })
}
