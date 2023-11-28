import { test as base } from '@playwright/test'

import { Course_Type_Enum } from '@app/generated/graphql'

import { deleteCourse, insertCourse } from '@qa/api/hasura/course'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { BookingDetailsPage } from '@qa/fixtures/pages/booking/BookingDetailsPage.fixture'
import { stateFilePath } from '@qa/util'

const test = base.extend<{ courseId: number }>({
  courseId: async ({}, use) => {
    const openCourse = UNIQUE_COURSE()
    openCourse.type = Course_Type_Enum.Open

    const id = await insertCourse(
      openCourse,
      'trainer@teamteach.testinator.com'
    )

    await use(id)

    await deleteCourse(id)
  },
})

test.use({ storageState: stateFilePath('user1') })

test('renders booking page', async ({ page, courseId }) => {
  const bookingDetailsPage = new BookingDetailsPage(page)
  await bookingDetailsPage.goto(String(courseId))

  await test.expect(page.getByTestId('booking-form')).toBeVisible()
})
