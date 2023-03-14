import { test as base } from '@playwright/test'

import { CourseType, InviteStatus } from '@app/types'

import { deleteCourse, insertCourse } from '../../api/hasura-api'
import { UNIQUE_COURSE } from '../../data/courses'
import { Course } from '../../data/types'
import { users } from '../../data/users'
import { BookingPrivateCoursePage } from '../../pages/booking/BookingPrivateCoursePage'

const test = base.extend<{ course: Course }>({
  course: async ({}, use) => {
    const course = UNIQUE_COURSE()
    course.type = CourseType.CLOSED
    course.id = await insertCourse(
      course,
      users.trainer.email,
      InviteStatus.ACCEPTED
    )
    await use(course)
    await deleteCourse(course.id)
  },
})

test('saves closed course booking', async ({ page, course }) => {
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
