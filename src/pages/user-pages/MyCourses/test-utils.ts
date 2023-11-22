import { build, perBuild } from '@jackfranklin/test-data-bot'
import { Chance } from 'chance'
import { addHours } from 'date-fns'

import {
  Course_Level_Enum,
  Course_Status_Enum,
  Course_Trainer_Type_Enum,
  Course_Type_Enum,
  Grade_Enum,
  UserCourseFragment,
} from '@app/generated/graphql'

const chance = new Chance()

export const buildUserCourse = build<
  UserCourseFragment & {
    waitlistAgg: {
      aggregate?: {
        count: number
      } | null
    }
    participantsAgg: {
      aggregate?: {
        count: number
      } | null
    }
  }
>({
  fields: {
    id: perBuild(() => chance.integer()),
    name: perBuild(() => chance.name({ full: true })),
    type: Course_Type_Enum.Open,
    level: Course_Level_Enum.Level_1,
    createdAt: new Date(),
    status: Course_Status_Enum.Scheduled,
    trainers: [
      {
        id: perBuild(() => chance.guid()),
        type: Course_Trainer_Type_Enum.Leader,
        profile: {
          id: perBuild(() => chance.guid()),
          fullName: perBuild(() => chance.name({ full: true })),
        },
      },
    ],
    schedule: [
      {
        id: perBuild(() => chance.guid()),
        start: new Date().toISOString(),
        end: addHours(new Date(), 8),
        venue: {
          id: perBuild(() => chance.guid()),
          name: perBuild(() => chance.word()),
          city: perBuild(() => chance.city()),
        },
        virtualLink: null,
      },
    ],
    participants: [
      { healthSafetyConsent: true, grade: Grade_Enum.Pass, attended: true },
    ],

    evaluation_answers_aggregate: {
      aggregate: {
        count: 5,
      },
    },
    modulesAgg: { aggregate: null },
    max_participants: 0,
    waitlistAgg: { aggregate: null },
    participantsAgg: { aggregate: null },
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
