import { test as base } from '@playwright/test'

import { Course_Status_Enum } from '@app/generated/graphql'
import { InviteStatus, CourseType } from '@app/types'

import { insertCourse, deleteCourse } from '../../../api/hasura-api'
import { UNIQUE_COURSE } from '../../../data/courses'
import { Course } from '../../../data/types'
import { users } from '../../../data/users'
import { stateFilePath } from '../../../hooks/global-setup'
import { MyCoursesPage } from '../../../pages/courses/MyCoursesPage'

const test = base.extend<{ course: Course }>({
  course: async ({}, use) => {
    const course = UNIQUE_COURSE()
    course.type = CourseType.INDIRECT
    course.organization = { name: 'London First School' }
    course.status = Course_Status_Enum.Scheduled
    course.id = await insertCourse(
      course,
      users.trainer.email,
      InviteStatus.ACCEPTED
    )
    await use(course)
    await deleteCourse(course.id)
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
  await courseDetailsPage.clickCancelCourseButton()
  await courseDetailsPage.enterCancellationReason()
  await courseDetailsPage.clickCancelEntireCourseButton()
  await trainerCoursesPage.goto(`${course.id}`)
  await trainerCoursesPage.checkCourseStatus(course.id, 'Cancelled')
})
