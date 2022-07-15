import { build, fake } from '@jackfranklin/test-data-bot'
import { addHours } from 'date-fns'

import {
  Course_Level_Enum,
  Course_Status_Enum,
  Course_Type_Enum,
  Grade_Enum,
  UserCourseFragment,
} from '@app/generated/graphql'

export const buildUserCourse = build<UserCourseFragment>({
  fields: {
    id: fake(f => f.datatype.number()),
    name: fake(f => f.random.words()),
    type: Course_Type_Enum.Open,
    level: Course_Level_Enum.Level_1,
    status: Course_Status_Enum.Scheduled,
    trainers: [
      {
        id: fake(f => f.datatype.uuid()),
        profile: { fullName: fake(f => f.random.words()) },
      },
    ],
    schedule: [
      {
        id: fake(f => f.datatype.uuid()),
        start: new Date().toISOString(),
        end: addHours(new Date(), 8),
        venue: {
          id: fake(f => f.datatype.uuid()),
          name: fake(f => f.random.words()),
          city: fake(f => f.random.words()),
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
    modulesAgg: null,
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
