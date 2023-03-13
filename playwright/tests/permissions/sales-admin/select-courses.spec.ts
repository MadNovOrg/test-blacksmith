import { test as base } from '@playwright/test'

import { TrainerCoursesQuery } from '@app/generated/graphql'
import { QUERY as GetTrainerCourses } from '@app/queries/courses/get-trainer-courses'
import { CourseType, RoleName } from '@app/types'

import { deleteCourse, insertCourse } from '../../../api/hasura-api'
import { UNIQUE_COURSE } from '../../../data/courses'
import { runQueryAsRole } from '../../queries/gql-query'

const test = base.extend<{ courseIds: number[] }>({
  courseIds: async ({}, use) => {
    const ids = await Promise.all([
      insertCourse(
        {
          ...UNIQUE_COURSE(),
          type: CourseType.OPEN,
        },
        'trainer@teamteach.testinator.com'
      ),
      insertCourse(
        {
          ...UNIQUE_COURSE(),
          type: CourseType.CLOSED,
        },
        'trainer@teamteach.testinator.com'
      ),
    ])
    await use(ids)
    await Promise.all(ids.map(id => deleteCourse(id)))
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
    await test.expect(coursesResponse.courses.find(c => c.id === id))
  }
})
