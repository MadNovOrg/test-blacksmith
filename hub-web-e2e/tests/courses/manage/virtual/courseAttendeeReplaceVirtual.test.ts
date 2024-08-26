/* eslint-disable playwright/expect-expect */
import { test as base } from '@playwright/test'

import {
  Course_Delivery_Type_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'

import * as API from '@qa/api'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'
import { MyCoursesPage } from '@qa/fixtures/pages/courses/MyCoursesPage.fixture'
import { stateFilePath, StoredCredentialKey } from '@qa/util'

const allowedUsers = ['admin', 'ops', 'salesAdmin', 'userOrgAdmin']
const countriesForRole: { [key: string]: string } = {
  admin: 'England',
  ops: 'Wales',
  salesAdmin: 'Scotland',
  userOrgAdmin: 'Northern Ireland',
}

allowedUsers.forEach(role => {
  const data = {
    user: `${role}`,
    newAttendee: users.user1WithOrg,
    newAttendeeAddress: {
      addresLine1: '123 Fake Street',
      addresLine2: 'Fake Town',
      city: 'Fake City',
      postcode: 'TW1 1AA',
      country: countriesForRole[role],
    },

    smoke: role === 'admin' ? '@smoke' : '',
  }

  const test = base.extend<{ course: Course }>({
    course: async ({}, use) => {
      const course = UNIQUE_COURSE()
      course.organization = { name: 'London First School' }
      course.deliveryType = Course_Delivery_Type_Enum.Virtual
      course.type = Course_Type_Enum.Open
      course.id = (
        await API.course.insertCourse(course, users.trainer.email)
      ).id
      await API.course.insertCourseParticipants(course.id, [users.user2WithOrg])
      await use(course)
      await API.course.deleteCourse(course.id)
    },
  })

  test.use({ storageState: stateFilePath(data.user as StoredCredentialKey) })

  test(`replace an attendee on a L1 Virtual Open course as ${data.user} ${data.smoke}`, async ({
    course,
    page,
  }) => {
    const myCoursesPage = new MyCoursesPage(page)
    await myCoursesPage.gotoManageCourses(`${course.id}`)
    const courseDetailsPage = await myCoursesPage.clickCourseDetailsPage(
      course.id,
    )
    await courseDetailsPage.clickManageAttendance()
    const replaceAttendeePopup = await courseDetailsPage.clickAttendeeReplace()
    await replaceAttendeePopup.replaceAttendee(
      data.newAttendee,
      data.newAttendeeAddress,
    )
    await replaceAttendeePopup.clickConfirmReplace(data.newAttendee.email)
  })
})
