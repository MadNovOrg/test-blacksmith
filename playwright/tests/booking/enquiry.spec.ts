import { test as base } from '@playwright/test'

import { CourseType } from '@app/types'

import * as API from '../../api'
import { UNIQUE_COURSE } from '../../data/courses'
import { Course } from '../../data/types'
import { users } from '../../data/users'
import { EnquiryPage } from '../../pages/booking/EnquiryPage'

const test = base.extend<{ course: Course }>({
  course: async ({}, use) => {
    const course = UNIQUE_COURSE()
    course.type = CourseType.OPEN
    course.id = await API.course.insertCourse(course, users.trainer.email)
    await use(course)
    await API.course.deleteCourse(course.id)
  },
})

test('saves course enquiry', async ({ page, course }) => {
  const enquiryPage = new EnquiryPage(page)
  await enquiryPage.goto(`${course.id}`)
  await enquiryPage.fillInterest('Course')
  await enquiryPage.setFirstName('John')
  await enquiryPage.setLastName('Doe')
  await enquiryPage.setEmail('example@example.com')
  await enquiryPage.setOrganisation('Org example')
  await enquiryPage.setPhoneNumber('01234567890')
  await enquiryPage.setMessage('Message')
  await enquiryPage.clickSectorSelect()
  await enquiryPage.clickSectorEdu()
  await enquiryPage.clickSourceSelect()
  await enquiryPage.clickSourceFacebook()
  await enquiryPage.clickEnquireNow()
  await enquiryPage.checkEnquiry()
})
