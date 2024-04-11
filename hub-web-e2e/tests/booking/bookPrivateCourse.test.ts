import { test as base } from '@playwright/test'

import { Course_Type_Enum } from '@app/generated/graphql'

import * as API from '@qa/api'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'
import { BookingPrivateCoursePage } from '@qa/fixtures/pages/booking/BookingPrivateCoursePage.fixture'

const test = base.extend<{ course: Course }>({
  course: async ({}, use) => {
    const course = UNIQUE_COURSE()
    course.type = Course_Type_Enum.Closed
    course.id = await API.course.insertCourse(course, users.trainer.email)
    await use(course)
    await API.course.deleteCourse(course.id)
  },
})
// Skip this as book-brivate-course page is not available
test.skip('saves closed course booking', async ({ page, course }) => {
  const privateCoursePage = new BookingPrivateCoursePage(page)
  await privateCoursePage.goto(`${course.id}`)
  await privateCoursePage.setNumberOfParticipants('5')
  await privateCoursePage.setFirstName('John')
  await privateCoursePage.setLastName('Doe')
  await privateCoursePage.setEmail('example@example.com')
  await privateCoursePage.setOrganisation('Org example')
  await privateCoursePage.setPhoneNumber('01234567890')
  await privateCoursePage.setMessage('Message')
  await privateCoursePage.clickSectorSelect()
  await privateCoursePage.clickSectorEdu()
  await privateCoursePage.clickSourceSelect()
  await privateCoursePage.clickSourceFacebook()
  await privateCoursePage.clickEnquireNow()
  await privateCoursePage.checkEnquiry()
})
