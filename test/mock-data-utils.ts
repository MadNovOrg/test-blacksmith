import {
  build,
  BuildTimeConfig,
  fake,
  perBuild,
} from '@jackfranklin/test-data-bot'
import { add, sub } from 'date-fns'

import { getAccountCode } from '@app/components/CourseForm/helpers'
import {
  CategorySummaryFragment,
  EbookSummaryFragment,
  Podcast,
  PostSummaryFragment,
  ResearchSummaryDetailsFragment,
  TagSummaryFragment,
  VideoItemSummaryFragment,
  WebinarSummaryFragment,
  WaitlistSummaryFragment,
} from '@app/generated/graphql'
import {
  Address,
  Course,
  CourseDeliveryType,
  CourseLevel,
  CourseParticipant,
  CourseSchedule,
  CourseType,
  ExpensesInput,
  Organization,
  Profile,
  TrainerInput,
  TransportMethod,
  Venue,
  CourseInvite,
  ModuleGroup,
  Color,
  Module,
  CourseModule,
  BlendedLearningStatus,
  CourseParticipantModule,
  CourseTrainerType,
  CourseTrainer,
  InviteStatus,
} from '@app/types'

export const buildAddress = build<Address>({
  fields: {
    id: fake(f => f.datatype.uuid()),
    createdAt: new Date().toISOString(),
    line1: fake(f => f.address.streetPrefix()),
    line2: fake(f => f.address.streetSuffix()),
    city: fake(f => f.address.city()),
    postCode: fake(f => f.address.zipCode()),
    country: fake(f => f.address.country()),
    state: fake(f => f.address.state()),
    type: fake(f => f.random.word()),
  },
})

export const buildOrganization = build<Organization>({
  fields: {
    id: fake(f => f.datatype.uuid()),
    createdAt: new Date().toISOString(),
    name: fake(f => f.random.words(3)),
    tags: [
      fake(f => f.random.word()),
      fake(f => f.random.word()),
      fake(f => f.random.word()),
    ],
    members_aggregate: {
      aggregate: { count: fake(f => f.datatype.number(100)) },
    },
    contactDetails: [{ type: 'email', value: fake(f => f.internet.email()) }],
    attributes: [{ attribute: 'value' }],
    address: buildAddress(),
    preferences: [],
    region: fake(f => f.random.word()),
    sector: fake(f => f.random.word()),
    trustName: fake(f => f.random.word()),
    trustType: fake(f => f.random.word()),
  },
})

export const buildProfile = build<Profile>({
  fields: {
    id: fake(f => f.datatype.uuid()),
    createdAt: new Date().toISOString(),
    givenName: fake(f => f.name.firstName()),
    familyName: fake(f => f.name.lastName()),
    fullName: '',
    title: fake(f => f.random.word()),
    addresses: {},
    attributes: [],
    contactDetails: [],
    email: fake(f => f.internet.email()),
    avatar: fake(f => f.internet.avatar()),
    phone: fake(f => f.phone.phoneNumber()),
    dob: fake(f => f.date.past().toISOString().substring(0, 10)),
    jobTitle: fake(f => f.name.jobTitle()),
    tags: null,
    preferences: {},
    roles: [{ role: { name: fake(f => f.random.word()) } }],
    organizations: [{ organization: buildOrganization() }],
    dietaryRestrictions: null,
    disabilities: null,
    lastActivity: new Date().toISOString(),
  },
  postBuild: profile => ({
    ...profile,
    fullName: `${profile.givenName} ${profile.familyName}`,
  }),
})

export const buildVenue = build<Venue>({
  fields: {
    id: fake(f => f.datatype.uuid()),
    name: fake(f => f.random.words(3)),
    city: fake(f => f.address.city()),
    addressLineOne: fake(f => f.address.streetAddress()),
    postCode: fake(f => f.address.zipCode()),
    geoCoordinates: fake(
      f => `(${f.address.latitude()},${f.address.longitude()})`
    ),
  },
})

export const buildCourseScheduleEndedCourse = build<CourseSchedule>({
  fields: {
    id: fake(f => f.datatype.uuid()),
    createdAt: new Date().toISOString(),
    start: sub(new Date(), { days: 2 }).toISOString(),
    end: sub(new Date(), { days: 1 }).toISOString(),
    venue: buildVenue(),
  },
})

export const buildCourseScheduleNotStartedCourse = build<CourseSchedule>({
  fields: {
    id: fake(f => f.datatype.uuid()),
    createdAt: new Date().toISOString(),
    start: add(new Date(), { days: 1 }).toISOString(),
    end: add(new Date(), { days: 2 }).toISOString(),
    venue: buildVenue(),
  },
})

export const buildCourseSchedule = build<CourseSchedule>({
  fields: {
    id: fake(f => f.datatype.uuid()),
    createdAt: new Date().toISOString(),
    start: new Date().toISOString(),
    end: new Date().toISOString(),
    venue: buildVenue(),
    virtualLink: fake(f => f.internet.url()),
  },
})

export const buildCourseTrainer = build<CourseTrainer>({
  fields: {
    id: fake(f => f.datatype.uuid()),
    type: CourseTrainerType.LEADER,
    status: InviteStatus.ACCEPTED,
    profile: perBuild(() => buildProfile()),
  },
})

export const buildCourseLeader = (overrides?: Partial<CourseTrainer>) => {
  return buildCourseTrainer({
    overrides: { ...overrides, type: CourseTrainerType.LEADER },
  })
}

export const buildCourseAssistant = (overrides?: Partial<CourseTrainer>) => {
  return buildCourseTrainer({
    overrides: { ...overrides, type: CourseTrainerType.ASSISTANT },
  })
}

export const buildCourse = build<Course>({
  fields: {
    id: fake(f => f.datatype.number({ min: 10000, max: 10999 })),
    name: fake(f => f.random.words(3)),
    status: '',
    createdAt: new Date().toISOString(),
    type: CourseType.CLOSED,
    min_participants: 6,
    max_participants: 12,
    deliveryType: CourseDeliveryType.F2F,
    gradingConfirmed: null,
    reaccreditation: perBuild(() => false),
    go1Integration: perBuild(() => false),
    organization: buildOrganization(),
    schedule: [buildCourseSchedule()],
    level: CourseLevel.LEVEL_1,
    course_code: 'CL-L1-10000',
    trainers: [buildCourseTrainer()],
    dates: {
      aggregate: {
        start: { date: sub(new Date(), { days: 2 }).toISOString() },
        end: { date: sub(new Date(), { days: 1 }).toISOString() },
      },
    },
    participantsAgg: {
      aggregate: {
        count: 0,
      },
    },
    modulesAgg: {},
    moduleGroupIds: [],
    contactProfile: perBuild(() => buildProfile()),
    aolCostOfCourse: null,
    salesRepresentative: perBuild(() => buildProfile()),
    accountCode: getAccountCode(),
    freeSpaces: 0,
  },
})

export const buildStartedCourse = build<Course>({
  fields: {
    id: fake(f => f.datatype.number({ min: 10000, max: 10999 })),
    name: fake(f => f.random.words(3)),
    status: '',
    createdAt: new Date().toISOString(),
    type: CourseType.CLOSED,
    min_participants: 6,
    max_participants: 12,
    deliveryType: CourseDeliveryType.F2F,
    gradingConfirmed: null,
    reaccreditation: perBuild(() => false),
    go1Integration: perBuild(() => false),
    organization: buildOrganization(),
    schedule: [buildCourseSchedule()],
    level: CourseLevel.LEVEL_1,
    course_code: 'CL-L1-10000',
    trainers: [buildCourseTrainer()],
    dates: {
      aggregate: {
        start: { date: sub(new Date(), { days: 1 }).toISOString() },
        end: { date: add(new Date(), { days: 1 }).toISOString() },
      },
    },
    participantsAgg: {
      aggregate: {
        count: 0,
      },
    },
    modulesAgg: {},
    moduleGroupIds: [],
    contactProfileId: null,
    aolCostOfCourse: null,
  },
})

export const buildEndedCourse = build<Course>({
  fields: {
    id: fake(f => f.datatype.uuid()),
    name: fake(f => f.random.words(3)),
    status: '',
    createdAt: new Date().toISOString(),
    type: CourseType.OPEN,
    min_participants: 6,
    max_participants: 12,
    deliveryType: CourseDeliveryType.F2F,
    gradingConfirmed: null,
    reaccreditation: perBuild(() => false),
    go1Integration: perBuild(() => false),
    organization: buildOrganization(),
    schedule: [buildCourseScheduleEndedCourse()],
    level: CourseLevel.LEVEL_1,
    course_code: 'OP-L1-10000',
    trainers: [buildCourseTrainer()],
    dates: {
      aggregate: {
        start: { date: sub(new Date(), { days: 2 }).toISOString() },
        end: { date: sub(new Date(), { days: 1 }).toISOString() },
      },
    },
    participantsAgg: {
      aggregate: {
        count: 0,
      },
    },
    modulesAgg: {},
    moduleGroupIds: [],
  },
})

export const buildNotStartedCourse = build<Course>({
  fields: {
    id: fake(f => f.datatype.uuid()),
    name: fake(f => f.random.words(3)),
    status: '',
    createdAt: new Date().toISOString(),
    type: CourseType.OPEN,
    min_participants: 6,
    max_participants: 12,
    deliveryType: CourseDeliveryType.F2F,
    gradingConfirmed: null,
    reaccreditation: perBuild(() => false),
    go1Integration: perBuild(() => false),
    organization: buildOrganization(),
    schedule: [buildCourseScheduleNotStartedCourse()],
    level: CourseLevel.LEVEL_1,
    course_code: 'OP-L1-10000',
    trainers: [buildCourseTrainer()],
    dates: {
      aggregate: {
        start: { date: add(new Date(), { days: 1 }).toISOString() },
        end: { date: add(new Date(), { days: 2 }).toISOString() },
      },
    },
    participantsAgg: {
      aggregate: {
        count: 0,
      },
    },
    modulesAgg: {},
    moduleGroupIds: [],
  },
})

export const buildModuleGroup = build<ModuleGroup>({
  fields: {
    id: fake(f => f.datatype.uuid()),
    createdAt: new Date().toISOString(),
    name: fake(f => f.random.words(3)),
    level: CourseLevel.LEVEL_1,
    mandatory: () => false,
    modules: [],
    color: Color.FUSCHIA,
    duration: {},
  },
})

export const buildModule = build<Module>({
  fields: {
    id: fake(f => f.datatype.uuid()),
    name: fake(f => f.random.words(3)),
    createdAt: new Date().toISOString(),
    description: fake(f => f.random.words(3)),
    level: CourseLevel.LEVEL_1,
    type: '',
    moduleGroup: perBuild(() => buildModuleGroup()),
  },
})

export const buildCourseModule = build<CourseModule>({
  fields: {
    id: fake(f => f.datatype.uuid()),
    createdAt: new Date().toISOString(),
    course: perBuild(() => buildCourse()),
    module: perBuild(() => buildModule()),
  },
})

export const buildParticipantModule = build<CourseParticipantModule>({
  fields: {
    id: fake(f => f.datatype.uuid()),
    module: perBuild(() => buildModule()),
    completed: perBuild(() => true),
  },
})

export const buildParticipant = build<CourseParticipant>({
  fields: {
    id: fake(f => f.datatype.uuid()),
    createdAt: new Date().toISOString(),
    profile: perBuild(() => buildProfile()),
    course: perBuild(() => buildCourse()),
    go1EnrolmentStatus: BlendedLearningStatus.IN_PROGRESS,
    gradingModules: [buildParticipantModule(), buildParticipantModule()],
    grade: perBuild(() => null),
    gradingFeedback: fake(f => f.random.word()),
    dateGraded: new Date().toISOString(),
  },
})

export const buildInvite = build<CourseInvite>({
  fields: {
    id: fake(f => f.datatype.uuid()),
    email: fake(f => f.internet.email()),
    status: 'PENDING',
    createdAt: new Date(),
  },
})

export const buildPodcast = build<Podcast>({
  fields: {
    id: fake(f => f.datatype.uuid()),
    name: fake(f => f.random.words()),
    author: fake(f => f.name.findName()),
    description: fake(f => f.lorem.sentences()),
    publishedDate: fake(f => f.date.past().toISOString()),
    thumbnail: fake(f => f.image.imageUrl()),
    mediaUrl: fake(f => f.internet.url()),
    episodeNumber: fake(f => f.datatype.number({ max: 50, min: 1 })),
  },
})

export const buildVideoItem = build<VideoItemSummaryFragment>({
  fields: {
    id: fake(f => f.datatype.uuid()),
    title: fake(f => f.random.words()),
    excerpt: fake(f => f.lorem.sentences()),
    featuredImage: {
      node: {
        mediaItemUrl: fake(f => f.random.image()),
      },
    },
    youtube: {
      url: fake(f => f.internet.url()),
    },
    date: fake(f => f.date.past().toISOString()),
    downloads: null,
  },
})

export const buildTag = build<TagSummaryFragment>({
  fields: {
    id: fake(f => f.datatype.uuid()),
    name: fake(f => f.random.words()),
  },
})

export const buildCategory = build<CategorySummaryFragment>({
  fields: {
    id: fake(f => f.datatype.uuid()),
    name: fake(f => f.random.words()),
  },
})

export const buildPost = build<PostSummaryFragment>({
  fields: {
    id: fake(f => f.datatype.uuid()),
    title: fake(f => f.random.words()),
    excerpt: fake(f => f.lorem.sentences()),
    featuredImage: {
      node: {
        mediaItemUrl: fake(f => f.random.image()),
      },
    },
    tags: [buildTag(), buildTag()],
    date: fake(f => f.date.past().toISOString()),
    customAuthor: {
      displayAuthor: true,
    },
    author: null,
  },
})

export const buildEbook = build<EbookSummaryFragment>({
  fields: {
    id: fake(f => f.datatype.uuid()),
    title: fake(f => f.random.words()),
    excerpt: fake(f => f.lorem.sentences()),
    featuredImage: {
      node: {
        mediaItemUrl: fake(f => f.random.image()),
      },
    },
    downloads: {
      researchSummaryFile: {
        mediaItemUrl: fake(f => f.internet.url()),
      },
    },
    date: fake(f => f.date.past().toISOString()),
  },
})

export const buildResearchSummary = build<ResearchSummaryDetailsFragment>({
  fields: {
    id: fake(f => f.datatype.uuid()),
    title: fake(f => f.random.words()),
    excerpt: fake(f => f.lorem.sentences()),
    featuredImage: {
      node: {
        mediaItemUrl: fake(f => f.random.image()),
      },
    },
    downloads: {
      researchSummaryFile: {
        mediaItemUrl: fake(f => f.internet.url()),
      },
    },
    date: fake(f => f.date.past().toISOString()),
  },
})

export const buildWebinar = build<WebinarSummaryFragment>({
  fields: {
    id: fake(f => f.datatype.uuid()),
    title: fake(f => f.random.words()),
    excerpt: fake(f => f.lorem.sentences()),
    featuredImage: {
      node: {
        mediaItemUrl: fake(f => f.random.image()),
      },
    },
    youtube: {
      url: fake(f => f.internet.url()),
    },
    date: fake(f => f.date.past().toISOString()),
  },
})

export const buildWaitlistEntry = build<WaitlistSummaryFragment>({
  fields: {
    id: fake(f => f.datatype.uuid()),
    email: fake(f => f.internet.email()),
    phone: fake(f => f.phone.phoneNumber()),
    orgName: fake(f => f.lorem.words(2)),
    courseId: fake(f => f.datatype.number({ min: 10000, max: 10999 })),
    confirmed: fake(() => true),
    createdAt: fake(f => f.date.past().toISOString()),
    givenName: fake(f => f.random.word()),
    familyName: fake(f => f.random.word()),
  },
})

export function buildEntities<T>(
  count: number,
  buildFunction: (buildTimeConfig?: BuildTimeConfig<T> | undefined) => T
): T[] {
  const entities: T[] = []

  for (let i = 0; i < count; i++) {
    entities.push(buildFunction())
  }

  return entities
}

export const buildExpensesInput = build<ExpensesInput>({
  fields: {
    transport: fake(f =>
      new Array(f.datatype.number({ min: 0, max: 3 })).fill(null).map(() => {
        const method = f.random.objectElement(
          TransportMethod
        ) as TransportMethod
        const tripData: ExpensesInput['transport'][number] = { method }

        if (method !== TransportMethod.NONE) {
          tripData.value = f.datatype.number({
            min: 0.01,
            max: 50,
            precision: 0.01,
          })
          tripData.accommodationNights = f.datatype.number({ min: 0, max: 2 })

          if (method === TransportMethod.FLIGHTS) {
            tripData.flightDays = f.datatype.number({ min: 1, max: 2 })
          }
        }

        return tripData
      })
    ),
    miscellaneous: fake(f =>
      new Array(f.datatype.number({ min: 0, max: 2 })).fill(null).map(() => ({
        name: f.lorem.words(2),
        value: f.datatype.number({ min: 0.01, max: 50, precision: 0.01 }),
      }))
    ),
  },
})

export const buildTrainerInput = build<TrainerInput>({
  fields: {
    profile_id: fake(f => f.datatype.uuid()),
    type: CourseTrainerType.LEADER,
    fullName: fake(f => `${f.name.firstName()} ${f.name.lastName()}`),
    status: InviteStatus.ACCEPTED,
  },
})

export const buildTrainerInputAssistant = (
  overrides?: Partial<TrainerInput>
) => {
  return buildTrainerInput({
    overrides: { ...overrides, type: CourseTrainerType.ASSISTANT },
  })
}

export const buildTrainerInputModerator = (
  overrides?: Partial<TrainerInput>
) => {
  return buildTrainerInput({
    overrides: { ...overrides, type: CourseTrainerType.MODERATOR },
  })
}
