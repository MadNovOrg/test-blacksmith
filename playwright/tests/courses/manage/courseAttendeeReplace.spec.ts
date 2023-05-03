import { test as base } from '@playwright/test'

import { InviteStatus } from '@app/types'

import * as API from '../../../api'
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
    course.id = await API.course.insertCourse(
      course,
      users.trainer.email,
      InviteStatus.ACCEPTED
    )
    await API.course.insertCourseParticipants(course.id, [users.user1WithOrg])
    await use(course)
    await API.course.deleteCourse(course.id)
  },
})

test.use({ storageState: stateFilePath('userOrgAdmin') })

test(`replace an attendee on a course`, async ({ browser, course, page }) => {
  const myCoursesPage = new MyCoursesPage(page)
  await myCoursesPage.gotoManageCourses(`${course.id}`)
  const courseDetailsPage = await myCoursesPage.clickCourseDetailsPage(
    course.id
  )
  await courseDetailsPage.clickManageAttendance()
  const replaceAttendeePopup = await courseDetailsPage.clickAttendeeReplace()
  await replaceAttendeePopup.replaceAttendee(users.user2WithOrg)

  // Accept the invitation to the course as the new attendee
  const email = await API.email.getLatestEmail(
    users.user2WithOrg.email,
    'Register for training course'
  )
  const attendeePage = await browser.newPage()
  const emailPage = new EmailPage(attendeePage)
  await emailPage.renderContent(email.html)
  const invitationPage = await emailPage.clickRegisterNowButton()
  const attendeeCourseDetailsPage = await invitationPage.acceptInvitation()
  await attendeeCourseDetailsPage.checkSuccessMessage(
    'You are now attending this course. Please complete the checklist.'
  )
  await courseDetailsPage.checkAttendeeExists(users.user2WithOrg)
})
