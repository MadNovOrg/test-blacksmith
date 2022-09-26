import { build, fake } from '@jackfranklin/test-data-bot'
import { addHours } from 'date-fns'

import {
  Course_Invite_Status_Enum,
  Course_Level_Enum,
  Course_Status_Enum,
  Course_Trainer_Type_Enum,
  Course_Type_Enum,
  TrainerCourseFragment,
} from '@app/generated/graphql'

export const buildTrainerCourse = build<TrainerCourseFragment>({
  fields: {
    id: fake(f => f.datatype.uuid()),
    name: fake(f => f.random.words()),
    type: Course_Type_Enum.Open,
    level: Course_Level_Enum.Level_1,
    status: Course_Status_Enum.Scheduled,
    course_code: 'OP-L1-10000',
    organization: {
      name: fake(f => f.random.words()),
    },
    trainers: [
      {
        id: fake(f => f.datatype.uuid()),
        type: Course_Trainer_Type_Enum.Leader,
        status: Course_Invite_Status_Enum.Accepted,
        profile: {
          id: fake(f => f.datatype.uuid()),
          fullName: fake(f => f.random.words()),
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
        id: fake(f => f.datatype.uuid()),
        venue: {
          id: fake(f => f.datatype.uuid()),
          name: fake(f => f.random.words()),
          city: fake(f => f.random.words()),
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
