/* eslint-disable no-empty-pattern */
import { test as base } from '@playwright/test'

import { CourseType, InviteStatus } from '@app/types'

import { deleteCourse, insertCourse } from '../../api/hasura-api'
import { BASE_URL } from '../../constants'
import { UNIQUE_COURSE } from '../../data/courses'
import { Course } from '../../data/types'
import { users } from '../../data/users'

const test = base.extend<{ course: Course }>({
  course: async ({}, use) => {
    const course = UNIQUE_COURSE()
    course.type = CourseType.CLOSED

    course.id = await insertCourse(
      course,
      users.trainer.email,
      InviteStatus.ACCEPTED
    )

    await use(course)
    await deleteCourse(course.id)
  },
})

test('saves closed course booking', async ({ page, course }) => {
  await page.goto(`${BASE_URL}/book-private-course?course_id=${course.id}`)
  await page.waitForLoadState('domcontentloaded')

  await page.locator('text=Number of course participants').type('5')
  await page.locator('text=First Name *').type('John')
  await page.locator('text=Last Name *').type('Doe')
  await page.locator('text=Work email *').type('example@example.com')
  await page.locator('text=Organisation Name *').type('Org example')
  await page.locator('text=Phone *').type('1111111111')
  await page.locator('text=Message (optional)').type('Message')

  await page.locator('data-testid=sector-select').click()
  await page.locator('data-testid=sector-edu').click()

  await page.locator('data-testid=source-select').click()
  await page.locator('data-testid=source-facebook').click()

  await page.locator('button:has-text("Enquire now")').click()

  await test
    .expect(page.locator('text=Thank you for your enquiry'))
    .toBeVisible()
})
