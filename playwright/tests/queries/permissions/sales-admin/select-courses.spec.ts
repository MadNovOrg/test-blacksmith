import { expect, test as base } from '@playwright/test'

import { TrainerCoursesQuery } from '@app/generated/graphql'
import { QUERY as GetTrainerCourses } from '@app/queries/courses/get-trainer-courses'
import { CourseType, RoleName } from '@app/types'

import * as API from '@qa/api'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { users } from '@qa/data/users'

import { runQueryAsRole } from '../../../queries/gql-query'

const test = base.extend<{ courseIds: number[] }>({
  courseIds: async ({}, use) => {
    const ids = await Promise.all([
      API.course.insertCourse(
        {
          ...UNIQUE_COURSE(),
          type: CourseType.OPEN,
        },
        users.trainer.email
      ),
      API.course.insertCourse(
        {
          ...UNIQUE_COURSE(),
          type: CourseType.CLOSED,
        },
        users.trainer.email
      ),
    ])
    await use(ids)
    await Promise.all(ids.map(id => API.course.deleteCourse(id)))
  },
})

test('@query sales admin can select open and closed courses', async ({
  courseIds,
}) => {
  const coursesResponse = await runQueryAsRole<TrainerCoursesQuery>(
    GetTrainerCourses,
    { offset: 0, limit: 10, orderBy: { createdAt: 'desc' } },
    RoleName.SALES_ADMIN
  )
  for (const id of courseIds) {
    expect(
      coursesResponse.courses.find((c: { id: number }) => c.id === id)
    ).not.toBeUndefined()
  }
})
