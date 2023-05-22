import { test as base } from '@playwright/test'

import { CourseType } from '@app/types'

import * as API from '@qa/api'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'
import { stateFilePath } from '@qa/hooks/global-setup'
import { MyCoursesPage } from '@qa/pages/courses/MyCoursesPage'
import { EmailPage } from '@qa/pages/EmailPage'

const testData = [
  {
    name: 'indirect course',
    user: 'trainer',
    attendee: users.user1WithOrg,
    course: async () => {
      const course = UNIQUE_COURSE()
      course.type = CourseType.INDIRECT
      course.id = await API.course.insertCourse(course, users.trainer.email)
      return course
    },
  },
  {
    name: 'indirect course',
    user: 'ops',
    attendee: users.user1WithOrg,
    course: async () => {
      const course = UNIQUE_COURSE()
      course.type = CourseType.INDIRECT
      course.id = await API.course.insertCourse(course, users.trainer.email)
      return course
    },
  },
  {
    name: 'closed course',
    user: 'salesAdmin',
    attendee: users.user1WithOrg,
    course: async () => {
      const course = UNIQUE_COURSE()
      course.type = CourseType.CLOSED
      course.id = await API.course.insertCourse(course, users.trainer.email)
      return course
    },
  },
  {
    name: 'closed course',
    user: 'admin',
    attendee: users.user1WithOrg,
    course: async () => {
      const course = UNIQUE_COURSE()
      course.type = CourseType.CLOSED
      course.id = await API.course.insertCourse(course, users.trainer.email)
      return course
    },
  },
]

for (const data of testData) {
  const test = base.extend<{ course: Course }>({
    course: async ({}, use) => {
      const course = await data.course()
      await use(course)
      await API.course.deleteCourse(course.id)
    },
  })

  test(`course invites for ${data.name} being ${data.user}`, async ({
    browser,
    course,
  }) => {
    const trainerContext = await browser.newContext({
      storageState: stateFilePath(data.user),
    })
    const trainerPage = await trainerContext.newPage()
    const myCoursesPage = new MyCoursesPage(trainerPage)
    await myCoursesPage.goto(`${course.id}`)
    const courseDetailsPage = await myCoursesPage.clickCourseDetailsPage(
      course.id
    )
    await courseDetailsPage.checkInvitesLeftText(
      `${course.max_participants} invites left`
    )
    const invitePopUp = await courseDetailsPage.clickInviteAttendeesButton()
    await invitePopUp.enterEmails([data.attendee.email])
    await invitePopUp.clickSendButton()
    await courseDetailsPage.checkInvitesLeftText(
      `${course.max_participants - 1} invites left`
    )
    await courseDetailsPage.checkAttendingText(0, course.max_participants)
    const attendeePage = await browser.newPage()
    const email = await API.email.getLatestEmail(
      data.attendee.email,
      'Register for training course'
    )
    const emailPage = new EmailPage(attendeePage)
    await emailPage.renderContent(email.html)
    const invitationPage = await emailPage.clickRegisterNowButton()
    const attendeeCourseDetailsPage = await invitationPage.acceptInvitation()
    await attendeeCourseDetailsPage.checkSuccessMessage(
      'You are now attending this course. Please complete the checklist.'
    )
    await courseDetailsPage.checkAttendingText(1, course.max_participants)
    await courseDetailsPage.checkAttendingTabText('Attending (1)')
    await courseDetailsPage.checkPendingTabText('Pending (0)')
    // For trainer we're masking the personal data
    // TODO change the validation after we'll get the information which personal data we should present to the Trainer
    // eslint-disable-next-line playwright/no-conditional-in-test
    data.user === 'admin'
      ? await courseDetailsPage.checkAttendeesTableRows([data.attendee])
      : await courseDetailsPage.checkAttendeesTableNumberOfRows([data.attendee])
  })
}
