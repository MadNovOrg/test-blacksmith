import { test as base } from '@playwright/test'

import * as API from '@qa/api'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'
import { MyCoursesPage } from '@qa/fixtures/pages/courses/MyCoursesPage.fixture'
import { EmailPage } from '@qa/fixtures/pages/EmailPage.fixture'
import { stateFilePath } from '@qa/util'

const test = base.extend<{ course: Course }>({
  course: async ({}, use) => {
    const course = UNIQUE_COURSE()
    course.organization = { name: 'London First School' }
    course.id = await API.course.insertCourse(course, users.trainer.email)
    await API.course.insertCourseParticipants(course.id, [users.user2WithOrg])
    await use(course)
    await API.course.deleteCourse(course.id)
  },
})

test.use({ storageState: stateFilePath('userOrgAdmin') })

test(`replace an attendee on a course`, async ({ browser, course, page }) => {
  test.fail() // See https://behaviourhub.atlassian.net/browse/TTHP-1491
  const myCoursesPage = new MyCoursesPage(page)
  await myCoursesPage.gotoManageCourses(`${course.id}`)
  const courseDetailsPage = await myCoursesPage.clickCourseDetailsPage(
    course.id
  )
  await courseDetailsPage.clickManageAttendance()
  const replaceAttendeePopup = await courseDetailsPage.clickAttendeeReplace()
  await replaceAttendeePopup.replaceAttendee(users.user1WithOrg)

  // Accept the invitation to the course as the new attendee
  const email = await API.email.getLatestEmail(
    users.user2WithOrg.email,
    'Register for training course'
  )
  const attendeePage = await browser.newPage()
  const emailPage = new EmailPage(attendeePage)
  await emailPage.renderContent(email.html)
  const invitationPage = await emailPage.clickRegisterNowButton()
  await invitationPage.acceptInvitation(course)

  // Go to userOrgAdmin and check attendee has been replaced
  await courseDetailsPage.checkAttendeeExists(users.user1WithOrg)
})
