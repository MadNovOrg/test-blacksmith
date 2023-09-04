import { expect, test as base } from '@playwright/test'
import { addMonths, format } from 'date-fns'

import { Course_Source_Enum, Course_Status_Enum } from '@app/generated/graphql'
import { CourseType, InviteStatus } from '@app/types'

import * as API from '@qa/api'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { UNIQUE_ORDER } from '@qa/data/order'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'
import { ConfirmRescheduleModal } from '@qa/fixtures/pages/courses/ConfirmRescheduleModal.fixture'
import { CourseDetailsPage } from '@qa/fixtures/pages/courses/course-details/CourseDetailsPage.fixture'
import { CreateCoursePage } from '@qa/fixtures/pages/courses/CreateCoursePage.fixture'
import { stateFilePath } from '@qa/util'

const testDataMovingEarlier = [
  {
    name: 'open course to earlier date',
    user: 'ops',
    attendee: users.user1WithOrg,
    newStartDate: addMonths(new Date().setHours(9, 0), 1),
    newEndDate: addMonths(new Date().setHours(17, 0), 1),
    course: async () => {
      const course = UNIQUE_COURSE()
      course.status = Course_Status_Enum.Scheduled
      course.schedule[0].start = addMonths(new Date().setHours(9, 0), 2)
      course.schedule[0].end = addMonths(new Date().setHours(17, 0), 2)
      course.id = await API.course.insertCourse(
        course,
        users.trainer.email,
        InviteStatus.ACCEPTED
      )
      return course
    },
  },
  {
    name: 'closed course to earlier date',
    user: 'salesAdmin',
    attendee: users.user1WithOrg,
    newStartDate: addMonths(new Date().setHours(9, 0), 2),
    newEndDate: addMonths(new Date().setHours(17, 0), 2),
    course: async () => {
      const course = UNIQUE_COURSE()
      const order = await UNIQUE_ORDER(users.salesAdmin, [])
      course.type = CourseType.CLOSED
      course.status = Course_Status_Enum.Scheduled
      course.organization = { name: 'London First School' }
      course.assistTrainer = users.assistant
      course.source = Course_Source_Enum.EmailEnquiry
      course.salesRepresentative = users.salesAdmin
      course.bookingContactProfile = users.user1WithOrg
      course.freeSpaces = 0
      course.max_participants = 3
      course.schedule[0].start = addMonths(new Date().setHours(9, 0), 3)
      course.schedule[0].end = addMonths(new Date().setHours(17, 0), 3)
      course.id = await API.course.insertCourse(
        course,
        users.trainer.email,
        InviteStatus.ACCEPTED,
        true,
        order
      )
      return course
    },
  },
  {
    name: 'indirect course to earlier date',
    user: 'trainer',
    attendee: users.user1WithOrg,
    newStartDate: addMonths(new Date().setHours(9, 0), 2),
    newEndDate: addMonths(new Date().setHours(17, 0), 2),
    course: async () => {
      const course = UNIQUE_COURSE()
      course.type = CourseType.INDIRECT
      course.status = Course_Status_Enum.Scheduled
      course.schedule[0].start = addMonths(new Date().setHours(9, 0), 3)
      course.schedule[0].end = addMonths(new Date().setHours(17, 0), 3)
      course.organization = { name: 'London First School' }
      course.assistTrainer = users.assistant
      course.id = await API.course.insertCourse(
        course,
        users.trainer.email,
        InviteStatus.ACCEPTED
      )
      return course
    },
  },
]

for (const data of testDataMovingEarlier) {
  const test = base.extend<{ course: Course }>({
    course: async ({}, use) => {
      const course = await data.course()
      await use(course)
    },
  })

  test(`reschedule the ${data.name} using ${data.user}`, async ({
    browser,
    course,
  }) => {
    const userContext = await browser.newContext({
      storageState: stateFilePath(data.user),
    })

    const page = await userContext.newPage()
    const confirmRescheduleModal = new ConfirmRescheduleModal(page)
    const createCoursePage = new CreateCoursePage(page)
    const courseDetailsPage = new CourseDetailsPage(page)
    await courseDetailsPage.goto(`${course.id}`)

    const formattedStartDate = format(
      course.schedule[0].start,
      courseDetailsPage.dateFormat
    )
    const formattedEndDate = format(
      course.schedule[0].end,
      courseDetailsPage.dateFormat
    )

    await expect(await courseDetailsPage.startDateLabel).toContainText(
      formattedStartDate
    )
    await expect(await courseDetailsPage.endDateLabel).toContainText(
      formattedEndDate
    )
    await courseDetailsPage.clickEditCourseButton()
    await createCoursePage.setStartDateTime(data.newStartDate)
    await createCoursePage.setEndDateTime(data.newEndDate)
    await createCoursePage.clickSaveChangesButton()
    await confirmRescheduleModal.confirmChange(
      'trainer availability',
      course.type
    )

    const formattedNewStartDate = format(
      data.newStartDate,
      courseDetailsPage.dateFormat
    )
    const formattedNewEndDate = format(
      data.newEndDate,
      courseDetailsPage.dateFormat
    )

    await expect(await courseDetailsPage.startDateLabel).toContainText(
      formattedNewStartDate
    )
    await expect(await courseDetailsPage.endDateLabel).toContainText(
      formattedNewEndDate
    )
  })
}

const testDataMovingLater = [
  {
    name: 'open course to later date',
    user: 'ops',
    attendee: users.user1WithOrg,
    newStartDate: addMonths(new Date().setHours(9, 0), 4),
    newEndDate: addMonths(new Date().setHours(17, 0), 4),
    course: async () => {
      const course = UNIQUE_COURSE()
      course.status = Course_Status_Enum.Scheduled
      course.schedule[0].start = addMonths(new Date().setHours(9, 0), 2)
      course.schedule[0].end = addMonths(new Date().setHours(17, 0), 2)
      course.id = await API.course.insertCourse(
        course,
        users.trainer.email,
        InviteStatus.ACCEPTED
      )
      return course
    },
  },
  {
    name: 'closed course to later date',
    user: 'salesAdmin',
    attendee: users.user1WithOrg,
    newStartDate: addMonths(new Date().setHours(9, 0), 6),
    newEndDate: addMonths(new Date().setHours(17, 0), 6),
    course: async () => {
      const course = UNIQUE_COURSE()
      const order = await UNIQUE_ORDER(users.salesAdmin, [])
      course.type = CourseType.CLOSED
      course.status = Course_Status_Enum.Scheduled
      course.organization = { name: 'London First School' }
      course.assistTrainer = users.assistant
      course.source = Course_Source_Enum.EmailEnquiry
      course.salesRepresentative = users.salesAdmin
      course.bookingContactProfile = users.user1WithOrg
      course.freeSpaces = 0
      course.max_participants = 3
      course.schedule[0].start = addMonths(new Date().setHours(9, 0), 3)
      course.schedule[0].end = addMonths(new Date().setHours(17, 0), 3)
      course.id = await API.course.insertCourse(
        course,
        users.trainer.email,
        InviteStatus.ACCEPTED,
        true,
        order
      )
      return course
    },
  },
  {
    name: 'indirect course to later date',
    user: 'trainer',
    attendee: users.user1WithOrg,
    newStartDate: addMonths(new Date().setHours(9, 0), 4),
    newEndDate: addMonths(new Date().setHours(17, 0), 4),
    course: async () => {
      const course = UNIQUE_COURSE()
      course.type = CourseType.INDIRECT
      course.status = Course_Status_Enum.Scheduled
      course.schedule[0].start = addMonths(new Date().setHours(9, 0), 3)
      course.schedule[0].end = addMonths(new Date().setHours(17, 0), 3)
      course.organization = { name: 'London First School' }
      course.assistTrainer = users.assistant
      course.id = await API.course.insertCourse(
        course,
        users.trainer.email,
        InviteStatus.ACCEPTED
      )
      return course
    },
  },
]

for (const data of testDataMovingLater) {
  const test = base.extend<{ course: Course }>({
    course: async ({}, use) => {
      const course = await data.course()
      await use(course)
    },
  })

  test(`reschedule the ${data.name} using ${data.user}`, async ({
    browser,
    course,
  }) => {
    const userContext = await browser.newContext({
      storageState: stateFilePath(data.user),
    })
    const page = await userContext.newPage()
    const createCoursePage = new CreateCoursePage(page)
    const courseDetailsPage = new CourseDetailsPage(page)
    await courseDetailsPage.goto(`${course.id}`)

    const formattedStartDate = format(
      course.schedule[0].start,
      courseDetailsPage.dateFormat
    )
    const formattedEndDate = format(
      course.schedule[0].end,
      courseDetailsPage.dateFormat
    )

    await expect(await courseDetailsPage.startDateLabel).toContainText(
      formattedStartDate
    )
    await expect(await courseDetailsPage.endDateLabel).toContainText(
      formattedEndDate
    )
    await courseDetailsPage.clickEditCourseButton()
    await createCoursePage.setStartDateTime(data.newStartDate)
    await createCoursePage.setEndDateTime(data.newEndDate)
    await createCoursePage.clickSaveChangesButton()
    const formattedNewStartDate = format(
      data.newStartDate,
      courseDetailsPage.dateFormat
    )
    const formattedNewEndDate = format(
      data.newEndDate,
      courseDetailsPage.dateFormat
    )

    await expect(await courseDetailsPage.startDateLabel).toContainText(
      formattedNewStartDate
    )
    await expect(await courseDetailsPage.endDateLabel).toContainText(
      formattedNewEndDate
    )
  })
}
