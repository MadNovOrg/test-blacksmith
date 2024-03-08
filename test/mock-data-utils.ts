import { build, BuildTimeConfig, perBuild } from '@jackfranklin/test-data-bot'
import { Chance } from 'chance'
import { add, sub } from 'date-fns'

import { getAccountCode } from '@app/components/CourseForm/helpers'
import {
  Accreditors_Enum,
  BlendedLearningAttendeeExportData,
  CategorySummaryFragment,
  CertificateStatus,
  Course_Delivery_Type_Enum,
  Course_Invite_Status_Enum,
  Course_Level_Enum,
  Course_Status_Enum,
  Course_Trainer_Type_Enum,
  Course_Type_Enum,
  EbookSummaryFragment,
  ExportBlendedLearningCourseDataQuery,
  GetCourseAuditLogsQuery,
  GetCourseInvitesQuery,
  GetOrgTypesQuery,
  Grade_Enum,
  Podcast,
  PostSummaryFragment,
  ResearchSummaryDetailsFragment,
  ResourceCategory,
  TagSummaryFragment,
  VideoItemSummaryFragment,
  WaitlistSummaryFragment,
  WebinarSummaryFragment,
} from '@app/generated/graphql'
import {
  Address,
  BlendedLearningStatus,
  Color,
  Course,
  CourseCertificate,
  CourseModule,
  CourseParticipant,
  CourseParticipantModule,
  CourseSchedule,
  CourseTrainer,
  ExpensesInput,
  InviteStatus,
  Module,
  ModuleGroup,
  Order,
  Organization,
  Profile,
  Role,
  RoleName,
  TrainerInput,
  TransportMethod,
  Venue,
} from '@app/types'

const chance = new Chance()

export const buildAddress = build<Address>({
  fields: {
    id: perBuild(() => chance.guid()),
    createdAt: new Date().toISOString(),
    line1: perBuild(() => chance.address()),
    line2: perBuild(() => chance.address()),
    city: perBuild(() => chance.city()),
    postCode: perBuild(() => chance.zip()),
    country: perBuild(() => chance.country()),
    countryCode: 'GB-ENG',
    state: perBuild(() => chance.state()),
    type: perBuild(() => chance.word()),
  },
})

export const buildBlExportDataAttendee =
  build<BlendedLearningAttendeeExportData>({
    fields: {
      email: perBuild(() => chance.email()),
      blendedLearningEndDate: sub(new Date(), { days: 2 }).toISOString(),
      blendedLearningStartDate: sub(new Date(), {
        days: 1,
      }).toISOString(),
      userName: perBuild(() => chance.first()),
      blendedLearningPass: 'FALSE',
      blendedLearningStatus: 'in-progress',
    },
  })

export const buildBlExportData = build<{
  data: ExportBlendedLearningCourseDataQuery
}>({
  fields: {
    data: {
      attendees: {
        attendees: [buildBlExportDataAttendee(), buildBlExportDataAttendee()],
        commissioningOrganisationName: perBuild(() =>
          chance.word({ length: 3 })
        ),
        courseCode: 'CL-L1-10000',
        courseEndDate: sub(new Date(), { days: 2 }).toISOString(),
        courseName: perBuild(() => chance.word({ length: 3 })),
        courseStartDate: sub(new Date(), { days: 1 }).toISOString(),
        leadTrainerName: perBuild(() => chance.first()),
      },
    },
  },
})

export const buildOrganization = build<Organization>({
  fields: {
    id: perBuild(() => chance.guid()),
    createdAt: new Date().toISOString(),
    name: perBuild(() => chance.word({ length: 3 })),
    tags: [
      perBuild(() => chance.word()),
      perBuild(() => chance.word()),
      perBuild(() => chance.word()),
    ],
    members_aggregate: {
      aggregate: { count: perBuild(() => chance.integer({ max: 100 })) },
    },
    contactDetails: [{ type: 'email', value: perBuild(() => chance.email()) }],
    attributes: { attribute: 'value' },
    address: buildAddress(),
    region: perBuild(() => chance.word()),
    sector: perBuild(() => chance.word()),
    preferences: {},
    go1Licenses: 0,
    organizationType: perBuild(() => chance.word()),
  },
})

export const buildRole = build<Role>({
  fields: {
    id: perBuild(() => chance.guid()),
    name: RoleName.USER,
  },
})

export const buildProfile = build<Profile>({
  fields: {
    id: perBuild(() => chance.guid()),
    createdAt: new Date().toISOString(),
    givenName: perBuild(() => chance.first()),
    familyName: perBuild(() => chance.last()),
    fullName: '',
    title: perBuild(() => chance.word()),
    addresses: [],
    country: undefined,
    attributes: [],
    contactDetails: [],
    email: perBuild(() => chance.email()),
    avatar: perBuild(() => chance.avatar()),
    phone: perBuild(() => chance.phone()),
    dob: perBuild(() => chance.date().toISOString().substring(0, 10)),
    jobTitle: 'CEO',
    tags: null,
    preferences: [],
    roles: [
      {
        role: buildRole(),
      },
    ],
    trainer_role_types: [],
    organizations: [{ organization: buildOrganization(), isAdmin: false }],
    dietaryRestrictions: null,
    disabilities: null,
    lastActivity: perBuild(() => chance.date()),
    courses: [
      {
        grade: 'PASS' as Grade_Enum,
        course: {
          start: perBuild(() => chance.date().toISOString()).toString(),
          end: perBuild(() => chance.date().toISOString()).toString(),
          level: 'LEVEL_1' as Course_Level_Enum,
        },
      },
      {
        grade: null,
        course: {
          start: perBuild(() => chance.date().toISOString()).toString(),
          end: perBuild(() => chance.date().toISOString()).toString(),
          level: 'BILD_ADVANCED_TRAINER' as Course_Level_Enum,
        },
      },
    ],
  },
  postBuild: profile => ({
    ...profile,
    fullName: `${profile.givenName} ${profile.familyName}`,
  }),
})

export const buildVenue = build<Venue>({
  fields: {
    id: perBuild(() => chance.guid()),
    name: perBuild(() => chance.word({ length: 3 })),
    city: perBuild(() => chance.city()),
    addressLineOne: perBuild(() => chance.street()),
    postCode: perBuild(() => chance.zip()),
    country: perBuild(() => chance.country()),
    geoCoordinates: `(${perBuild(() => chance.latitude())},${perBuild(() =>
      chance.longitude()
    )}`,
  },
})

export const buildCourseScheduleEndedCourse = build<CourseSchedule>({
  fields: {
    id: perBuild(() => chance.guid()),
    createdAt: new Date().toISOString(),
    start: sub(new Date(), { days: 2 }).toISOString(),
    end: sub(new Date(), { days: 1 }).toISOString(),
    venue: buildVenue(),
  },
})

export const buildCourseScheduleNotStartedCourse = build<CourseSchedule>({
  fields: {
    id: perBuild(() => chance.guid()),
    createdAt: new Date().toISOString(),
    start: add(new Date(), { days: 1 }).toISOString(),
    end: add(new Date(), { days: 2 }).toISOString(),
    venue: buildVenue(),
  },
})

export const buildCourseSchedule = build<CourseSchedule>({
  fields: {
    id: perBuild(() => chance.guid()),
    createdAt: new Date().toISOString(),
    start: new Date().toISOString(),
    end: new Date().toISOString(),
    venue: buildVenue(),
    virtualLink: perBuild(() => chance.url()),
  },
})

export const buildCourseTrainer = build<CourseTrainer>({
  fields: {
    id: perBuild(() => chance.guid()),
    type: Course_Trainer_Type_Enum.Leader,
    status: InviteStatus.ACCEPTED,
    profile: perBuild(() => buildProfile()),
    levels: [],
  },
})

export const buildCourseLeader = (overrides?: Partial<CourseTrainer>) => {
  return buildCourseTrainer({
    overrides: { ...overrides, type: Course_Trainer_Type_Enum.Leader },
  })
}

export const buildCourseAssistant = (overrides?: Partial<CourseTrainer>) => {
  return buildCourseTrainer({
    overrides: { ...overrides, type: Course_Trainer_Type_Enum.Assistant },
  })
}

export const buildCourse = build<Course>({
  fields: {
    id: perBuild(() => chance.integer({ min: 10000 })),
    name: perBuild(() => chance.sentence({ words: 5 })),
    status: Course_Status_Enum.Scheduled,
    createdAt: new Date().toISOString(),
    type: Course_Type_Enum.Closed,
    min_participants: 6,
    max_participants: 12,
    deliveryType: Course_Delivery_Type_Enum.F2F,
    gradingConfirmed: false,
    gradingStarted: false,
    reaccreditation: perBuild(() => false),
    go1Integration: perBuild(() => false),
    conversion: perBuild(() => false),
    organization: buildOrganization(),
    schedule: [buildCourseSchedule()],
    level: Course_Level_Enum.Level_1,
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
    modulesAgg: { aggregate: { count: 0 } },
    moduleGroupIds: [],
    bookingContact: perBuild(() => buildProfile()),
    organizationKeyContact: perBuild(() => buildProfile()),
    aolCostOfCourse: undefined,
    accountCode: getAccountCode(),
    freeSpaces: 0,
    accreditedBy: Accreditors_Enum.Icm,
    bildStrategies: [],
    residingCountry: chance.country(),
    orders: [
      {
        order: {
          salesRepresentative: perBuild(() => buildProfile()),
          id: chance.guid(),
          xeroInvoiceNumber: chance.string(),
        },
      },
    ],
    curriculum: null,
    courseExceptions: [],
    price: chance.integer({ min: 0, max: 200 }),
  },
})

export const buildStartedCourse = build<Course>({
  fields: {
    id: perBuild(() => chance.integer()),
    name: perBuild(() => chance.word({ length: 3 })),
    status: Course_Status_Enum.Scheduled,
    createdAt: new Date().toISOString(),
    type: Course_Type_Enum.Closed,
    min_participants: 6,
    max_participants: 12,
    deliveryType: Course_Delivery_Type_Enum.F2F,
    gradingConfirmed: false,
    gradingStarted: false,
    reaccreditation: perBuild(() => false),
    go1Integration: perBuild(() => false),
    conversion: perBuild(() => false),
    organization: buildOrganization(),
    schedule: [buildCourseSchedule()],
    level: Course_Level_Enum.Level_1,
    course_code: 'CL-L1-10000',
    residingCountry: chance.country(),
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
    modulesAgg: { aggregate: { count: 0 } },
    moduleGroupIds: [],
    bookingContactProfileId: undefined,
    aolCostOfCourse: undefined,
    accreditedBy: Accreditors_Enum.Icm,
    bildStrategies: [],
    curriculum: null,
    courseExceptions: [],
  },
})

export const buildEndedCourse = build<Course>({
  fields: {
    id: perBuild(() => chance.integer()),
    name: perBuild(() => chance.word({ length: 3 })),
    status: Course_Status_Enum.GradeMissing,
    createdAt: new Date().toISOString(),
    residingCountry: chance.country(),
    type: Course_Type_Enum.Open,
    min_participants: 6,
    max_participants: 12,
    deliveryType: Course_Delivery_Type_Enum.F2F,
    gradingConfirmed: false,
    gradingStarted: false,
    reaccreditation: perBuild(() => false),
    go1Integration: perBuild(() => false),
    conversion: perBuild(() => false),
    organization: buildOrganization(),
    schedule: [buildCourseScheduleEndedCourse()],
    level: Course_Level_Enum.Level_1,
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
    modulesAgg: { aggregate: { count: 0 } },
    moduleGroupIds: [],
    accreditedBy: Accreditors_Enum.Icm,
    bildStrategies: [],
    curriculum: null,
    courseExceptions: [],
  },
})

export const buildNotStartedCourse = build<Course>({
  fields: {
    id: perBuild(() => chance.integer()),
    name: perBuild(() => chance.word({ length: 3 })),
    status: Course_Status_Enum.Scheduled,
    createdAt: new Date().toISOString(),
    type: Course_Type_Enum.Open,
    min_participants: 6,
    max_participants: 12,
    residingCountry: chance.country(),
    deliveryType: Course_Delivery_Type_Enum.F2F,
    gradingConfirmed: false,
    gradingStarted: false,
    reaccreditation: perBuild(() => false),
    go1Integration: perBuild(() => false),
    conversion: perBuild(() => false),
    organization: buildOrganization(),
    schedule: [buildCourseScheduleNotStartedCourse()],
    level: Course_Level_Enum.Level_1,
    course_code: 'OP-L1-10000',
    trainers: [buildCourseTrainer()],
    curriculum: null,
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
    modulesAgg: { aggregate: { count: 0 } },
    moduleGroupIds: [],
    accreditedBy: Accreditors_Enum.Icm,
    bildStrategies: [],
    courseExceptions: [],
  },
})

export const buildModuleGroup = build<ModuleGroup>({
  fields: {
    id: perBuild(() => chance.guid()),
    createdAt: new Date().toISOString(),
    name: perBuild(() => chance.word({ length: 3 })),
    level: Course_Level_Enum.Level_1,
    mandatory: false,
    modules: [],
    color: Color.FUSCHIA,
    duration: { aggregate: { sum: { duration: 0 } } },
  },
})

export const buildModule = build<Module>({
  fields: {
    id: perBuild(() => chance.guid()),
    name: perBuild(() => chance.word({ length: 3 })),
    createdAt: new Date().toISOString(),
    description: perBuild(() => chance.word({ length: 3 })),
    level: Course_Level_Enum.Level_1,
    type: '',
    moduleGroup: perBuild(() => buildModuleGroup()),
    submodules: [],
  },
})

export const buildCourseModule = build<CourseModule>({
  fields: {
    id: perBuild(() => chance.guid()),
    createdAt: new Date().toISOString(),
    course: perBuild(() => buildCourse()),
    module: perBuild(() => buildModule()),
    submodules: [],
  },
})

export const buildParticipantModule = build<CourseParticipantModule>({
  fields: {
    id: perBuild(() => chance.guid()),
    module: perBuild(() => buildModule()),
    completed: perBuild(() => true),
  },
})

export const buildParticipant = build<CourseParticipant>({
  fields: {
    id: perBuild(() => chance.guid()),
    createdAt: new Date().toISOString(),
    profile: perBuild(() => buildProfile()),
    course: perBuild(() => buildCourse()),
    go1EnrolmentStatus: BlendedLearningStatus.IN_PROGRESS,
    go1EnrolmentProgress: 50,
    gradingModules: [buildParticipantModule(), buildParticipantModule()],
    grade: perBuild(() => undefined),
    gradingFeedback: perBuild(() => chance.word()),
    dateGraded: new Date().toISOString(),
    order: {} as Order,
    attended: undefined,
    completed_evaluation: false,
  },
})

export const buildCertificate = build<CourseCertificate>({
  fields: {
    id: perBuild(() => chance.guid()),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    profileId: perBuild(() => chance.guid()),
    profile: perBuild(() => buildProfile()),
    number: perBuild(() => chance.word().toLowerCase()),
    courseId: perBuild(() => chance.guid()),
    courseName: perBuild(() => chance.word({ length: 3 })),
    expiryDate: add(new Date(), { days: 1 }).toISOString(),
    certificationDate: new Date().toISOString(),
    courseLevel: Course_Level_Enum.Level_1,
    status: CertificateStatus.Active,
    blendedLearning: false,
    reaccreditation: false,
    courseAccreditedBy: Accreditors_Enum.Icm,
  },
})

export const buildInvite = build<GetCourseInvitesQuery['courseInvites'][0]>({
  fields: {
    id: perBuild(() => chance.guid()),
    email: perBuild(() => chance.email()),
    status: Course_Invite_Status_Enum.Pending,
    createdAt: new Date(),
    note: perBuild(() => chance.string()),
  },
})

export const buildPodcast = build<Podcast>({
  fields: {
    id: perBuild(() => chance.guid()),
    name: perBuild(() => chance.word()),
    author: perBuild(() => chance.name({ full: true })),
    description: perBuild(() => chance.sentence()),
    publishedDate: perBuild(() => chance.date().toISOString()),
    thumbnail: perBuild(() => chance.url({ extensions: ['jpg'] })),
    mediaUrl: perBuild(() => chance.url()),
    episodeNumber: perBuild(() => chance.integer()),
  },
})

export const buildVideoItem = build<VideoItemSummaryFragment>({
  fields: {
    id: perBuild(() => chance.guid()),
    title: perBuild(() => chance.word()),
    excerpt: perBuild(() => chance.sentence()),
    featuredImage: {
      node: {
        mediaItemUrl: perBuild(() => chance.url({ extensions: ['jpg'] })),
      },
    },
    youtube: {
      url: perBuild(() => chance.url()),
    },
    date: (chance.date({ year: 2021 }) as Date).toISOString(),
    downloads: null,
  },
})

export const buildTag = build<TagSummaryFragment>({
  fields: {
    id: perBuild(() => chance.guid()),
    name: perBuild(() => chance.word()),
  },
})

export const buildCategory = build<CategorySummaryFragment>({
  fields: {
    id: perBuild(() => chance.guid()),
    name: perBuild(() => chance.word()),
  },
})

export const buildPost = build<PostSummaryFragment>({
  fields: {
    id: perBuild(() => chance.guid()),
    title: perBuild(() => chance.string()),
    excerpt: perBuild(() => chance.sentence()),
    featuredImage: {
      node: {
        mediaItemUrl: perBuild(() => chance.url({ extensions: ['jpg'] })),
      },
    },
    tags: { nodes: [buildTag(), buildTag()] },
    date: (chance.date({ year: 2021 }) as Date).toISOString(),
    customAuthor: {
      displayAuthor: true,
    },
    author: null,
  },
})

export const buildEbook = build<EbookSummaryFragment>({
  fields: {
    id: perBuild(() => chance.guid()),
    title: perBuild(() => chance.word()),
    excerpt: perBuild(() => chance.sentence()),
    featuredImage: {
      node: {
        mediaItemUrl: perBuild(() => chance.url()),
      },
    },
    downloads: {
      file: {
        mediaItemUrl: perBuild(() => chance.url()),
      },
    },
    date: perBuild(() => chance.date().toISOString()),
  },
})

export const buildResearchSummary = build<ResearchSummaryDetailsFragment>({
  fields: {
    id: perBuild(() => chance.guid()),
    title: perBuild(() => chance.word()),
    excerpt: perBuild(() => chance.sentence()),
    featuredImage: {
      node: {
        mediaItemUrl: perBuild(() => chance.url({ extensions: ['jpg'] })),
      },
    },
    downloads: {
      file: {
        mediaItemUrl: perBuild(() => chance.url()),
      },
    },
    date: perBuild(() => chance.date().toISOString()),
  },
})

export const buildWebinar = build<WebinarSummaryFragment>({
  fields: {
    id: perBuild(() => chance.guid()),
    title: perBuild(() => chance.word()),
    excerpt: perBuild(() => chance.sentence()),
    featuredImage: {
      node: {
        mediaItemUrl: perBuild(() => chance.url({ extensions: ['jpg'] })),
      },
    },
    youtube: {
      url: perBuild(() => chance.url()),
    },
    date: perBuild(() => chance.date().toISOString()),
  },
})

export const buildWaitlistEntry = build<WaitlistSummaryFragment>({
  fields: {
    id: perBuild(() => chance.guid()),
    email: perBuild(() => chance.email()),
    phone: perBuild(() => chance.phone()),
    orgName: perBuild(() => chance.word({ length: 2 })),
    courseId: perBuild(() => chance.integer({ min: 10000, max: 10999 })),
    confirmed: true,
    createdAt: perBuild(() => chance.date().toISOString()),
    givenName: perBuild(() => chance.name()),
    familyName: perBuild(() => chance.name()),
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
    transport: new Array(chance.integer({ min: 0, max: 3 }))
      .fill(null)
      .map(() => {
        const method = chance.pickone(
          Object.keys(TransportMethod)
        ) as TransportMethod
        const tripData: ExpensesInput['transport'][number] = {
          method,
          accommodationCost: chance.integer({ min: 1, max: 150 }),
          accommodationNights: chance.integer({ min: 0, max: 2 }),
          flightDays: undefined,
          value: chance.integer({ min: 0, max: 5 }),
        }

        if (method !== TransportMethod.NONE) {
          tripData.value = chance.integer({
            min: 0.01,
            max: 50,
          })
          tripData.accommodationNights = chance.integer({ min: 0, max: 2 })

          if (method === TransportMethod.FLIGHTS) {
            tripData.flightDays = chance.integer({ min: 1, max: 2 })
          }
        }

        return tripData
      }),
    miscellaneous: new Array(chance.integer({ min: 0, max: 2 }))
      .fill(null)
      .map(() => ({
        name: perBuild(() => chance.word({ length: 5 })),
        value: perBuild(() => chance.integer({ min: 0.01, max: 50 })),
      })),
  },
})

export const buildTrainerInput = build<TrainerInput>({
  fields: {
    profile_id: perBuild(() => chance.guid()),
    type: Course_Trainer_Type_Enum.Leader,
    fullName: perBuild(() => chance.name({ full: true })),
    status: InviteStatus.ACCEPTED,
    levels: [],
    trainer_role_types: [],
  },
})

export const buildTrainerInputAssistant = (
  overrides?: Partial<TrainerInput>
) => {
  return buildTrainerInput({
    overrides: { ...overrides, type: Course_Trainer_Type_Enum.Assistant },
  })
}

export const buildTrainerInputModerator = (
  overrides?: Partial<TrainerInput>
) => {
  return buildTrainerInput({
    overrides: { ...overrides, type: Course_Trainer_Type_Enum.Moderator },
  })
}

export const buildResourceCategory = build<
  Omit<ResourceCategory, 'databaseId' | 'isContentNode' | 'isTermNode'>
>({
  fields: {
    id: perBuild(() => chance.guid()),
    name: perBuild(() => chance.word()),
    description: perBuild(() => chance.sentence()),
    resourceArea: {
      resourcearea: 'basic',
    },
    resourcePermissions: {
      certificateLevels: [],
      principalTrainer: false,
    },
  },
})

export const buildLogs = build<GetCourseAuditLogsQuery['logs'][0]>({
  fields: {
    id: perBuild(() => chance.guid()),
    authorizedBy: {
      avatar: perBuild(() => chance.avatar()),
      fullName: perBuild(() => chance.name()),
      id: perBuild(() => chance.guid()),
    },
    course: {
      id: perBuild(() => chance.integer()),
      course_code: 'OP-L1-10000',
      start: sub(new Date(), { days: 2 }).toISOString(),
      type: Course_Type_Enum.Closed,
      orders: [
        {
          order: {
            id: perBuild(() => chance.guid()),
            xeroInvoiceNumber: perBuild(() => chance.string()),
          },
        },
      ],
      organization: {
        id: perBuild(() => chance.guid()),
        name: perBuild(() => chance.name()),
      },
      trainers: [
        {
          type: Course_Trainer_Type_Enum.Leader,
          id: perBuild(() => chance.guid()),
          profile: {
            avatar: perBuild(() => chance.avatar()),
            fullName: perBuild(() => chance.name()),
            id: perBuild(() => chance.guid()),
          },
        },
      ],
    },
    payload: {
      reason: perBuild(() => chance.string()),
    },
    created_at: sub(new Date(), { days: 2 }).toISOString(),
    updated_at: sub(new Date(), { days: 2 }).toISOString(),
  },
})

export const buildOrgType = build<GetOrgTypesQuery>({
  fields: {
    organization_type: [
      {
        id: perBuild(() => chance.guid()),
        name: perBuild(() => chance.name()),
      },
    ],
  },
})
