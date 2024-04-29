import { test as base } from '@playwright/test'

import { Course_Type_Enum } from '@app/generated/graphql'

import * as API from '@qa/api'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'
import { MyCoursesPage } from '@qa/fixtures/pages/courses/MyCoursesPage.fixture'
import { stateFilePath } from '@qa/util'

const test = base.extend<{ course: Course }>({
  course: async ({}, use) => {
    const course = UNIQUE_COURSE()
    course.type = Course_Type_Enum.Closed
    course.organization = { name: 'London First School' }
    course.bookingContactProfile = users.user1WithOrg
    course.salesRepresentative = users.user2WithOrg
    course.id = (await API.course.insertCourse(course, users.trainer.email)).id
    await use(course)
    await API.course.deleteCourse(course.id)
  },
})

test.use({ storageState: stateFilePath('salesAdmin') })

// 'See https://behaviourhub.atlassian.net/browse/TTHP-1274'
// for some reason test.fail is not working in this test
test.fixme(
  'edit course notes as a sales rep for closed course',
  async ({ page, course }) => {
    const myCoursesPage = new MyCoursesPage(page)
    await myCoursesPage.goto(`${course.id}`)
    const courseDetailsPage = await myCoursesPage.clickCourseDetailsPage(
      course.id
    )
    await courseDetailsPage.clickEditCourseButton()
    await courseDetailsPage.fillNotes('notes3')
    await courseDetailsPage.clickSaveButton()
    await courseDetailsPage.checkNotesOnCoursePage('notes3')
  }
)
