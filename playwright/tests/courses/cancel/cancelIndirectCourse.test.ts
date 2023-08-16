import { test as base } from '@playwright/test'

import { CourseType } from '@app/types'

import * as API from '@qa/api'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'
import { MyCoursesPage } from '@qa/fixtures/pages/courses/MyCoursesPage.fixture'
import { stateFilePath } from '@qa/util'

const test = base.extend<{ course: Course }>({
  course: async ({}, use) => {
    const course = UNIQUE_COURSE()
    course.type = CourseType.INDIRECT
    course.organization = { name: 'London First School' }
    course.id = await API.course.insertCourse(course, users.trainer.email)
    await use(course)
    await API.course.deleteCourse(course.id)
  },
})

test.use({ storageState: stateFilePath('trainer') })

test('cancel indirect course as trainer', async ({ page, course }) => {
  const trainerCoursesPage = new MyCoursesPage(page)
  await trainerCoursesPage.goto(`${course.id}`)
  const courseDetailsPage = await trainerCoursesPage.clickCourseDetailsPage(
    course.id
  )
  await courseDetailsPage.clickEditCourseButton()
  const cancelPopup = await courseDetailsPage.clickCancelCourseButton()
  await cancelPopup.enterCancellationReason()
  await cancelPopup.clickCancelEntireCourseButton()
  await trainerCoursesPage.goto(`${course.id}`)
  await trainerCoursesPage.checkCourseStatus(course.id, 'Cancelled')
})
