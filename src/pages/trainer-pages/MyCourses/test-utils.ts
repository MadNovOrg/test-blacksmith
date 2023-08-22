import { build, perBuild } from '@jackfranklin/test-data-bot'
import { Chance } from 'chance'
import { addHours } from 'date-fns'

import {
  Course_Invite_Status_Enum,
  Course_Level_Enum,
  Course_Status_Enum,
  Course_Trainer_Type_Enum,
  Course_Type_Enum,
  TrainerCourseFragment,
} from '@app/generated/graphql'

import { waitFor, within } from '@test/index'

const chance = new Chance()

export const buildTrainerCourse = build<TrainerCourseFragment>({
  fields: {
    id: perBuild(() => chance.integer()),
    name: perBuild(() => chance.word({ length: 3 })),
    type: Course_Type_Enum.Open,
    level: Course_Level_Enum.Level_1,
    createdAt: Date.now(),
    status: Course_Status_Enum.Scheduled,
    course_code: 'OP-L1-10000',
    go1Integration: false,
    organization: {
      name: perBuild(() => chance.word({ length: 3 })),
    },
    trainers: [
      {
        id: perBuild(() => chance.guid()),
        type: Course_Trainer_Type_Enum.Leader,
        status: Course_Invite_Status_Enum.Accepted,
        profile: {
          id: perBuild(() => chance.guid()),
          fullName: perBuild(() => chance.name({ full: true })),
        },
      },
    ],
    max_participants: 12,
    participantsAgg: {
      aggregate: {
        count: 12,
      },
    },
    waitlistAgg: {
      aggregate: {
        count: 2,
      },
    },
    schedule: [
      {
        id: perBuild(() => chance.guid()),
        venue: {
          id: perBuild(() => chance.guid()),
          name: perBuild(() => chance.word()),
          city: perBuild(() => chance.city()),
        },
        virtualLink: null,
      },
    ],
    modulesAgg: {
      aggregate: {
        count: 5,
      },
    },
    dates: {
      aggregate: {
        start: {
          date: new Date().toISOString(),
        },
        end: {
          date: addHours(new Date(), 8),
        },
      },
    },
  },
})

export const buildTrainerCourseWithDates = (
  start: Date,
  end: Date
): TrainerCourseFragment =>
  buildTrainerCourse({
    overrides: {
      dates: {
        aggregate: {
          start: {
            date: start.toISOString(),
          },
          end: {
            date: end.toISOString(),
          },
        },
      },
    },
  })

export const buildCourseTrainer = (
  overrides?: Partial<TrainerCourseFragment['trainers'][0]>
): TrainerCourseFragment['trainers'][0] => {
  return {
    id: chance.guid(),
    profile: { id: chance.guid() },
    type: Course_Trainer_Type_Enum.Leader,
    ...overrides,
  }
}

export const buildActionableTrainerCourse = (
  overrides?: Partial<TrainerCourseFragment>
) =>
  buildTrainerCourse({
    overrides: {
      status: Course_Status_Enum.TrainerPending,
      trainers: [buildCourseTrainer()],
      ...overrides,
    },
  })

export const buildActionableTrainerCourseWithDates = (
  start: Date,
  end: Date
): TrainerCourseFragment =>
  buildActionableTrainerCourse({
    dates: {
      aggregate: {
        start: {
          date: start.toISOString(),
        },
        end: {
          date: end.toISOString(),
        },
      },
    },
  })

type ExpectTableToContainArgs = {
  table: HTMLElement
  rowIdPrefix: string
  include?: TrainerCourseFragment[]
  exclude?: TrainerCourseFragment[]
  timeout?: number
}

const expectTableTo = async ({
  table,
  rowIdPrefix,
  include = [],
  exclude = [],
  timeout = 2000,
}: ExpectTableToContainArgs) => {
  await waitFor(
    () => {
      expect(table.querySelectorAll('.MyCoursesRow')).toHaveLength(
        include.length
      )

      include.forEach(course => {
        expect(
          within(table).getByTestId(`${rowIdPrefix}${course.id}`)
        ).toBeInTheDocument()
      })

      exclude.forEach(course => {
        expect(
          within(table).queryByTestId(`${rowIdPrefix}${course.id}`)
        ).not.toBeInTheDocument()
      })
    },
    { timeout }
  )
}

export const expectCourseTableTo = async ({
  table,
  include,
  exclude,
  timeout,
}: Omit<ExpectTableToContainArgs, 'rowIdPrefix'>) =>
  expectTableTo({
    table,
    rowIdPrefix: 'course-row-',
    include,
    exclude,
    timeout,
  })

export const expectActionableTableTo = async ({
  table,
  include,
  exclude,
  timeout,
}: Omit<ExpectTableToContainArgs, 'rowIdPrefix'>) =>
  expectTableTo({
    table,
    rowIdPrefix: 'actionable-course-',
    include,
    exclude,
    timeout,
  })
