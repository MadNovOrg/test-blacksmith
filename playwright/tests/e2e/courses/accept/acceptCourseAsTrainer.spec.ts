import { test as base } from '@playwright/test'

import { CourseType, InviteStatus } from '@app/types'

import * as API from '@qa/api'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'
import { stateFilePath } from '@qa/hooks/global-setup'
import { MyCoursesPage } from '@qa/pages/courses/MyCoursesPage'

const testData = [
  {
    name: 'accept open course as trainer @smoke',
    course: async () => {
      const course = UNIQUE_COURSE()
      course.id = await API.course.insertCourse(
        course,
        users.trainer.email,
        InviteStatus.PENDING
      )
      return course
    },
  },
  {
    name: 'accept indirect course as trainer @smoke',
    course: async () => {
      const course = UNIQUE_COURSE()
      course.type = CourseType.INDIRECT
      course.id = await API.course.insertCourse(
        course,
        users.trainer.email,
        InviteStatus.PENDING
      )
      return course
    },
  },
  {
    name: 'accept closed course as trainer @smoke',
    course: async () => {
      const course = UNIQUE_COURSE()
      course.type = CourseType.CLOSED
      course.id = await API.course.insertCourse(
        course,
        users.trainer.email,
        InviteStatus.PENDING
      )
      return course
    },
  },
]

for (const data of testData) {
  const test = base.extend<{ course: Course }>({
    course: async ({}, use) => {
      const course = await data.course()
      await use(course)
      await API.course.deleteCourse(course.id)
    },
  })

  test.use({ storageState: stateFilePath('trainer') })

  test(data.name, async ({ page, course }) => {
    const myCoursesPage = new MyCoursesPage(page)

    await myCoursesPage.goto(`${course.id}`)
    await myCoursesPage.acceptCourse(course.id)
    await myCoursesPage.goToCourseBuilder()
    await myCoursesPage.submitDefaultModules()
    await myCoursesPage.confirmModules()
    await myCoursesPage.goto(`${course.id}`)
    await myCoursesPage.checkCourseStatus(course.id, 'Scheduled')
  })
}
