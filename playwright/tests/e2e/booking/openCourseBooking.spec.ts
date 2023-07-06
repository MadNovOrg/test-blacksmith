import { test as base } from '@playwright/test'

import { CourseType } from '@app/types'

import { deleteCourse, insertCourse } from '@qa/api/hasura/course'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { stateFilePath } from '@qa/hooks/global-setup'
import { BookingDetailsPage } from '@qa/pages/booking/BookingDetailsPage'

const test = base.extend<{ courseId: number }>({
  courseId: async ({}, use) => {
    const openCourse = UNIQUE_COURSE()
    openCourse.type = CourseType.OPEN

    const id = await insertCourse(
      openCourse,
      'trainer@teamteach.testinator.com'
    )

    await use(id)

    await deleteCourse(id)
  },
})

test.use({ storageState: stateFilePath('user1') })

test('@smoke renders booking page', async ({ page, courseId }) => {
  const bookingDetailsPage = new BookingDetailsPage(page)
  await bookingDetailsPage.goto(String(courseId))

  test.expect(page.getByTestId('booking-form')).toBeVisible()
})
