import { test as base } from '@playwright/test'

import { Course_Status_Enum } from '@app/generated/graphql'
import { InviteStatus } from '@app/types'

import { getLatestEmail } from '../../../api/email-api'
import {
  deleteCourse,
  insertCourse,
  insertCourseParticipants,
} from '../../../api/hasura-api'
import { UNIQUE_COURSE } from '../../../data/courses'
import { Course } from '../../../data/types'
import { users } from '../../../data/users'
import { stateFilePath } from '../../../hooks/global-setup'
import { MyCoursesPage } from '../../../pages/courses/MyCoursesPage'
import { EmailPage } from '../../../pages/EmailPage'

const test = base.extend<{ course: Course }>({
  course: async ({}, use) => {
    const course = UNIQUE_COURSE()
    course.organization = { name: 'London First School' }
    course.status = Course_Status_Enum.Scheduled
    course.id = await insertCourse(
      course,
      users.trainer.email,
      InviteStatus.ACCEPTED
    )
    await insertCourseParticipants(course.id, [users.user1WithOrg])
    await use(course)
    await deleteCourse(course.id)
  },
})

test(`transfer an attendee to another course `, async ({ browser, course }) => {
  const orgAdminContext = await browser.newContext({
    storageState: stateFilePath('userOrgAdmin'),
  })
  const orgAdminPage = await orgAdminContext.newPage()
  const myCoursesPage = new MyCoursesPage(orgAdminPage)
  await myCoursesPage.gotoManageCourses(`${course.id}`)
  const courseDetailsPage = await myCoursesPage.clickCourseDetailsPage(
    course.id
  )
  await courseDetailsPage.clickManageAttendance()
  await courseDetailsPage.clickAttendeeReplace()
  await courseDetailsPage.replaceAttendee(users.user2WithOrg)

  // Accept the invitation to the course as the new attendee
  const attendeePage = await browser.newPage()
  const email = await getLatestEmail(
    users.user2WithOrg.email,
    'Register for training course'
  )
  const emailPage = new EmailPage(attendeePage)
  await emailPage.renderContent(email.html)
  const invitationPage = await emailPage.clickRegisterNowButton()
  const attendeeCourseDetailsPage = await invitationPage.acceptInvitation()
  await attendeeCourseDetailsPage.checkSuccessMessage(
    'You are now attending this course. Please complete the checklist.'
  )
  await orgAdminPage.reload()

  await courseDetailsPage.checkAttendeeExists(users.user2WithOrg)
})
