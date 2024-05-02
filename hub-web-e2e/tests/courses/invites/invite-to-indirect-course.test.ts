import { test as base, expect } from '@playwright/test'

import * as API from '@qa/api'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'
import { AcceptCoursePage } from '@qa/fixtures/pages/courses/AcceptCoursePage.fixture'
import { MyCoursesPage } from '@qa/fixtures/pages/courses/MyCoursesPage.fixture'
import { Course_Status_Enum, Course_Type_Enum } from '@qa/generated/graphql'
import { stateFilePath, StoredCredentialKey } from '@qa/util'

const test = base.extend<{ course: Course }>({
  course: async ({}, use) => {
    const course = UNIQUE_COURSE()
    course.status = Course_Status_Enum.Scheduled
    course.type = Course_Type_Enum.Indirect
    course.organization = { name: 'London First School' }
    course.id = await API.course
      .insertCourse(course, users.trainer.email)
      .then(res => res.id)
    await use(course)
    await API.course.deleteCourse(course.id)
  },
})
test.use({ storageState: stateFilePath('admin') })

test.describe(
  'Invite to Indirect Course',
  {
    tag: ['@smoke'],
  },

  () => {
    test.describe.configure({
      mode: 'parallel',
    })

    test('Should not allow inviting 0 attendees', async ({ page, course }) => {
      const trainerCoursesPage = new MyCoursesPage(page)
      await trainerCoursesPage.goto(`${course.id}`)
      const courseDetailsPage = await trainerCoursesPage.clickCourseDetailsPage(
        course.id
      )
      await courseDetailsPage.goto(String(course.id))
      await expect(courseDetailsPage.inviteAttendeesButton).toBeVisible()
      const inviteAttendeesDialog =
        await courseDetailsPage.clickInviteAttendeesButton()
      await inviteAttendeesDialog.clickSendButton()
      await expect(inviteAttendeesDialog.error).toBeVisible()
      await inviteAttendeesDialog.enterEmails([users.user1.email])
      await inviteAttendeesDialog.clickSendButton()
      await courseDetailsPage.checkPendingTabText('Pending (1)')
    })

    const roles: StoredCredentialKey[] = [
      'admin',
      'ops',
      'salesAdmin',
      'trainer',
    ]

    for (const role of roles) {
      test(`Should be able to invite to indirect course as the ${role} role`, async ({
        page,
        course,
      }) => {
        await page.context().storageState({
          path: stateFilePath(role),
        })
        const trainerCoursesPage = new MyCoursesPage(page)
        await trainerCoursesPage.goto(`${course.id}`)
        const courseDetailsPage =
          await trainerCoursesPage.clickCourseDetailsPage(course.id)

        await expect(courseDetailsPage.inviteAttendeesButton).toBeVisible()
      })
    }

    test(`Should add the invited attendees to the pending list`, async ({
      page,
      course,
    }) => {
      const trainerCoursesPage = new MyCoursesPage(page)
      await trainerCoursesPage.goto(`${course.id}`)
      const courseDetailsPage = await trainerCoursesPage.clickCourseDetailsPage(
        course.id
      )
      await courseDetailsPage.goto(String(course.id))
      await expect(courseDetailsPage.inviteAttendeesButton).toBeVisible()

      const inviteAttendeesDialog =
        await courseDetailsPage.clickInviteAttendeesButton()
      const inviteEmails = [users.user1.email, users.user2.email]
      await inviteAttendeesDialog.enterEmails(inviteEmails)
      await inviteAttendeesDialog.clickSendButton()
      await expect(courseDetailsPage.pendingTab).toHaveText('Pending (2)')
      await courseDetailsPage.pendingTab.click()
      await expect(courseDetailsPage.pendingAttendeesTable.rows).toHaveCount(2)
    })

    test('Should show the attendees in the attending table after they accept their invites', async ({
      course,
      page,
      browser,
    }) => {
      const trainerCoursesPage = new MyCoursesPage(page)
      await trainerCoursesPage.goto(`${course.id}`)
      const courseDetailsPage = await trainerCoursesPage.clickCourseDetailsPage(
        course.id
      )
      await courseDetailsPage.goto(String(course.id))

      const inviteAttendeesDialog =
        await courseDetailsPage.clickInviteAttendeesButton()
      const inviteEmails = [users.user1.email, users.user2.email]
      await inviteAttendeesDialog.enterEmails(inviteEmails)
      await inviteAttendeesDialog.clickSendButton()
      await courseDetailsPage.checkPendingTabText('Pending (2)')

      const user1InviteId = await API.invites.getInviteId(
        course.id,
        users.user1.email
      )

      const user1Page = await browser
        .newContext({
          storageState: stateFilePath('user1'),
        })
        .then(context => context.newPage())

      const user1AcceptCoursePage = new AcceptCoursePage(user1Page)
      await user1AcceptCoursePage.gotoAccept(course.id, user1InviteId)
      await user1AcceptCoursePage.waitForAcceptConfirmation()

      await page.reload({
        waitUntil: 'networkidle',
      })
      await courseDetailsPage.waitForPageLoad()
      await courseDetailsPage.checkAttendingTabText('Attending (1)')
      await expect(courseDetailsPage.attendeesTable.rows).toHaveCount(1)
    })
  }
)
