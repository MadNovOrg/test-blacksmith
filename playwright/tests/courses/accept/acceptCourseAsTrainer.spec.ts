import { test as base } from '@playwright/test'

import { Course_Status_Enum } from '@app/generated/graphql'
import { InviteStatus } from '@app/types'

import { insertCourse, deleteCourse } from '../../../api/hasura-api'
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
      course.id = await insertCourse(
        course,
        users.trainer.email,
        InviteStatus.PENDING
      )
      return course
    },
  },
  // TODO uncomment after implementing https://behaviourhub.atlassian.net/browse/TTHP-575
  // {
  //   name: 'accept indirect course as trainer',
  //   course: async () => {
  //     const course = UNIQUE_COURSE()
  //     course.type = CourseType.INDIRECT
  //     course.id = await insertCourse(
  //       course,
  //       users.trainer.email,
  //       InviteStatus.PENDING
  //     )
  //     return course
  //   },
  // },
  // {
  //   name: 'accept closed course as trainer @smoke',
  //   course: async () => {
  //     const course = UNIQUE_COURSE()
  //     course.type = CourseType.CLOSED
  //     course.id = await insertCourse(
  //       course,
  //       users.trainer.email,
  //       InviteStatus.PENDING
  //     )
  //     return course
  //   },
  // },
]

for (const data of testData) {
  const test = base.extend<{ course: Course }>({
    course: async ({}, use) => {
      const course = await data.course()
      await use(course)
      await deleteCourse(course.id)
    },
  })

  test.use({ storageState: stateFilePath('trainer') })

  // `Fails due to schedule status of course reporting back as 'null' after clicking confirmModules`
  test.fixme(data.name, async ({ page, course }) => {
    const myCoursesPage = new MyCoursesPage(page)
    await myCoursesPage.goto()
    await myCoursesPage.searchCourse(`${course.id}`)
    await myCoursesPage.acceptCourse(course.id)
    await myCoursesPage.goToCourseBuilder()
    await myCoursesPage.submitDefaultModules()
    const courseDetails = await myCoursesPage.confirmModules()
    await courseDetails.waitForLoad()
    await myCoursesPage.goto()
    await myCoursesPage.searchCourse(`${course.id}`)
    await myCoursesPage.checkCourseStatus(course.id, 'Scheduled')
  })
}
