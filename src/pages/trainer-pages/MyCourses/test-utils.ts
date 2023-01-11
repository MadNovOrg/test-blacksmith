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

const chance = new Chance()

export const buildTrainerCourse = build<TrainerCourseFragment>({
  fields: {
    id: perBuild(() => chance.integer()),
    name: perBuild(() => chance.word({ length: 3 })),
    type: Course_Type_Enum.Open,
    level: Course_Level_Enum.Level_1,
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
