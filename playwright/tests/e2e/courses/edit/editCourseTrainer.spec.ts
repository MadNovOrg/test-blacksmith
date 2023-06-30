import { test as base } from '@playwright/test'

import { CourseType } from '@app/types'

import * as API from '@qa/api'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'
import { stateFilePath } from '@qa/hooks/global-setup'
import { MyCoursesPage } from '@qa/pages/courses/MyCoursesPage'

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

test('edit course notes for indirect course as a trainer', async ({
  page,
  course,
}) => {
  const myCoursesPage = new MyCoursesPage(page)
  await myCoursesPage.goto(`${course.id}`)
  const courseDetailsPage = await myCoursesPage.clickCourseDetailsPage(
    course.id
  )
  await courseDetailsPage.clickEditCourseButton()
  await courseDetailsPage.fillNotes('notes3')
  // Required at the moment due to additional trainers always being required
  await courseDetailsPage.addAdditionalTrainer()
  await courseDetailsPage.clickSaveButton()
  await courseDetailsPage.checkNotesOnCoursePage('notes3')
})
