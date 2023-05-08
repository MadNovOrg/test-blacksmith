import { test as base } from '@playwright/test'

import * as API from '../../../api'
import { UNIQUE_COURSE } from '../../../data/courses'
import { Course } from '../../../data/types'
import { users } from '../../../data/users'
import { stateFilePath } from '../../../hooks/global-setup'
import { MyCoursesPage } from '../../../pages/courses/MyCoursesPage'

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
