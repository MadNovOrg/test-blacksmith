import { test as base } from '@playwright/test'

import { Course_Status_Enum } from '@app/generated/graphql'
import { CourseType, InviteStatus } from '@app/types'

import * as API from '../../../api'
import { TARGET_ENV } from '../../../constants'
import { UNIQUE_COURSE } from '../../../data/courses'
import { Course } from '../../../data/types'
import { users } from '../../../data/users'
import { stateFilePath } from '../../../hooks/global-setup'
import { MyCoursesPage } from '../../../pages/courses/MyCoursesPage'

const testData = [
  {
    name: 'accept open course as trainer @smoke',
    course: async () => {
      const course = UNIQUE_COURSE()
      course.status = Course_Status_Enum.TrainerPending
      course.id = await API.course.insertCourse(
        course,
        users.trainer.email,
        InviteStatus.PENDING
      )
      return course
    },
  },
  {
    name: 'accept indirect course as trainer',
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
    //We skip this test when running as a smoke test as there is no backend
    //eslint-disable-next-line playwright/no-skipped-test
    test.skip(Boolean(process.env.CI) && TARGET_ENV === 'local')
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
