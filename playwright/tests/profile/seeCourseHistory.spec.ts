import { test as base } from '@playwright/test'
import { addSeconds } from 'date-fns'

import { Grade_Enum } from '@app/generated/graphql'

import * as API from '../../api'
import { UNIQUE_COURSE } from '../../data/courses'
import { Course } from '../../data/types'
import { users } from '../../data/users'
import { stateFilePath } from '../../hooks/global-setup'
import { ProfilePage } from '../../pages/profile/ProfilePage'

const test = base.extend<{ course: Course }>({
  course: async ({}, use) => {
    const course = UNIQUE_COURSE()
    course.schedule = [
      {
        start: addSeconds(new Date(), 1),
        end: addSeconds(new Date(), 2),
      },
    ]
    course.id = await API.course.insertCourse(course, users.trainer.email)
    await API.course.insertCourseParticipants(course.id, [users.user1])
    await API.course.insertCourseGradingForParticipants(
      course,
      [users.user1],
      Grade_Enum.Pass
    )
    await use(course)
    await API.course.deleteCourse(course.id)
  },
})

test.use({ storageState: stateFilePath('user1') })

test('user can see their course history', async ({ page, course }) => {
  test.fail(true, 'History as an attendee is not being populated')
  const profilePage = new ProfilePage(page)
  await profilePage.goto()
  await profilePage.checkCourseHistory(course.id, 'Transferred')
})
