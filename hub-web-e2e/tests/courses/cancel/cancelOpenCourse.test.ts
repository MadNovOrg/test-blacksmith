import { test as base } from '@playwright/test'

import * as API from '@qa/api'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'
import { MyCoursesPage } from '@qa/fixtures/pages/courses/MyCoursesPage.fixture'
import { stateFilePath } from '@qa/util'

const allowedRoles = ['salesAdmin', 'ops', 'admin']
const test = base.extend<{ course: Course }>({
  course: async ({}, use) => {
    const course = UNIQUE_COURSE()
    course.id = await API.course.insertCourse(course, users.trainer.email)
    await use(course)
    await API.course.deleteCourse(course.id)
  },
})

allowedRoles.forEach(role => {
  test.use({ storageState: stateFilePath(role) })

  test(`cancel open course as ${role} @smoke`, async ({ page, course }) => {
    const adminCoursesPage = new MyCoursesPage(page)
    await adminCoursesPage.goto(`${course.id}`)
    const courseDetailsPage = await adminCoursesPage.clickCourseDetailsPage(
      course.id
    )
    await courseDetailsPage.clickEditCourseButton()
    const cancelPopup = await courseDetailsPage.clickCancelCourseButton()
    await cancelPopup.selectCancelCourseDropdownReason()
    await cancelPopup.checkCancelCourseCheckbox()
    await cancelPopup.clickCancelEntireCourseButton()
    await adminCoursesPage.goto(`${course.id}`)
    await adminCoursesPage.checkCourseStatus(course.id, 'Cancelled')
  })
})
