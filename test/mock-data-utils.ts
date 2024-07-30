import { build, BuildTimeConfig, perBuild } from '@jackfranklin/test-data-bot'
import { Chance } from 'chance'
import { add, sub } from 'date-fns'

import {
  Accreditors_Enum,
  BlendedLearningAttendeeExportData,
  CategorySummaryFragment,
  CertificateStatus,
  Course_Delivery_Type_Enum,
  Course_Evaluation_Question_Group_Enum,
  Course_Evaluation_Question_Type_Enum,
  Course_Invite_Status_Enum,
  CourseLevel as Course_Level,
  Course_Level_Enum,
  Course_Pricing,
  Course_Pricing_Schedule,
  Course_Renewal_Cycle_Enum,
  Course_Source_Enum,
  Course_Status_Enum,
  Course_Trainer_Type_Enum,
  Course_Type_Enum,
  Currency,
  EbookSummaryFragment,
  ExportBlendedLearningCourseDataQuery,
  GetCourseAuditLogsQuery,
  GetCourseEvaluationQuestionsQuery,
  GetCourseInvitesQuery,
  GetCourseParticipantIdQuery,
  GetEvaluationQuery,
  GetFeedbackUsersQuery,
  GetOrgTypesQuery,
  Grade_Enum,
  Podcast,
  PostSummaryFragment,
  PricingChangelogQuery,
  ResearchSummaryDetailsFragment,
  ResourceCategory,
  TagSummaryFragment,
  VideoItemSummaryFragment,
  WaitlistSummaryFragment,
  WebinarSummaryFragment,
} from '@app/generated/graphql'
import { getAccountCode } from '@app/modules/course/components/CourseForm/helpers'
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
import { UKTimezone } from '@app/util'

const chance = new Chance()

export const buildSchedulePriceChangelog = (
  overrides?: Partial<
    PricingChangelogQuery['course_pricing_changelog'][number]
  >,
) => {
  const buildChangelog = build<
    PricingChangelogQuery['course_pricing_changelog'][number]
  >({
    fields: {
      id: chance.guid(),
      author: {
        id: chance.guid(),
        archived: false,
        fullName: chance.name(),
      },
      courseSchedulePrice: null,
      coursePricing: {
        priceCurrency: 'GBP',
      },
      createdAt: Date.now(),
      newEffectiveFrom: null,
      newEffectiveTo: null,
      newPrice: null,
      oldEffectiveFrom: null,
      oldEffectiveTo: null,
      oldPrice: null,
      indefiniteEffectiveTo: false,
    },
  })

  return buildChangelog({ overrides })
}

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
          chance.word({ length: 3 }),
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

export const buildProfile = build<
  Profile & {
    levels: {
      courseLevel: Course_Level
      expiryDate: string
    }[]
  }
>({
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
    levels: [],
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
      chance.longitude(),
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
    timeZone: UKTimezone,
  },
})

export const buildCourseTrainer = build<CourseTrainer>({
  fields: {
    id: perBuild(() => chance.guid()),
    type: Course_Trainer_Type_Enum.Leader,
    status: InviteStatus.ACCEPTED,
    profile: perBuild(() => buildProfile()),
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
    bookingContactInviteData: undefined,
    bookingContact: perBuild(() => buildProfile()),
    organizationKeyContactInviteData: undefined,
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
          source: Course_Source_Enum.Event,
        },
      },
    ],
    curriculum: null,
    courseExceptions: [],
    price: chance.integer({ min: 0, max: 200 }),
    includeVAT: chance.bool(),
    priceCurrency: Currency.Gbp,
    renewalCycle: Course_Renewal_Cycle_Enum.One,
    free_course_materials: undefined,
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
    healthSafetyConsent: true,
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
  buildFunction: (buildTimeConfig?: BuildTimeConfig<T> | undefined) => T,
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
          Object.keys(TransportMethod),
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
  overrides?: Partial<TrainerInput>,
) => {
  return buildTrainerInput({
    overrides: { ...overrides, type: Course_Trainer_Type_Enum.Assistant },
  })
}

export const buildTrainerInputModerator = (
  overrides?: Partial<TrainerInput>,
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
      start: {
        aggregate: {
          date: { start: sub(new Date(), { days: 2 }).toISOString() },
        },
      },
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

export const buildCourseEvaluationQuestions =
  build<GetCourseEvaluationQuestionsQuery>({
    fields: {
      questions: [
        {
          id: 'd37c26a3-10f1-405e-b06c-6ca2e87d2c2b',
          type: Course_Evaluation_Question_Type_Enum.Rating,
          questionKey: 'WORKBOOK_AND_PRESENTATION_MATERIALS',
          group: Course_Evaluation_Question_Group_Enum.MaterialsAndVenue,
          displayOrder: 0,
          required: true,
        },
        {
          id: 'fa1258f6-8397-45bf-8883-7134da99af75',
          type: Course_Evaluation_Question_Type_Enum.Rating,
          questionKey: 'ATTITUDE_AND_APPROACH_OF_TRAINERS',
          group: Course_Evaluation_Question_Group_Enum.TrainerStandards,
          displayOrder: 0,
          required: true,
          __typename: 'course_evaluation_questions',
        },
        {
          id: '2a8fb50e-e9fb-4720-91d4-4b010b1e1856',
          type: Course_Evaluation_Question_Type_Enum.Rating,
          questionKey: 'OBJECTIVES_CLEARLY_STATED',
          group: Course_Evaluation_Question_Group_Enum.TrainingRating,
          displayOrder: 0,
          required: true,
          __typename: 'course_evaluation_questions',
        },
        {
          id: 'e0a443aa-ec78-4545-9b29-977f828e8a87',
          type: Course_Evaluation_Question_Type_Enum.Rating,
          questionKey: 'VALUE_OF_TRAINING',
          group: Course_Evaluation_Question_Group_Enum.TrainingRelevance,
          displayOrder: 0,
          required: true,
          __typename: 'course_evaluation_questions',
        },
        {
          id: '92c47603-6203-4707-89c4-792acfb6cf95',
          type: Course_Evaluation_Question_Type_Enum.Rating,
          questionKey: 'SUITABILITY_OF_TRAINING_ENVIRONMENT',
          group: Course_Evaluation_Question_Group_Enum.MaterialsAndVenue,
          displayOrder: 1,
          required: true,
          __typename: 'course_evaluation_questions',
        },
        {
          id: 'c33a5448-e426-4eb7-8f91-aca428459ec4',
          type: Course_Evaluation_Question_Type_Enum.Rating,
          questionKey: 'KNOWLEDGE_OF_SUBJECT',
          group: Course_Evaluation_Question_Group_Enum.TrainerStandards,
          displayOrder: 1,
          required: true,
          __typename: 'course_evaluation_questions',
        },
        {
          id: '7fa7a24c-875f-4563-b873-50d0aa617fad',
          type: Course_Evaluation_Question_Type_Enum.Rating,
          questionKey: 'OBJECTIVES_ACHIEVED',
          group: Course_Evaluation_Question_Group_Enum.TrainingRating,
          displayOrder: 1,
          required: true,
          __typename: 'course_evaluation_questions',
        },
        {
          id: 'b096a54a-cb25-4a47-a64a-c542e3b1daeb',
          type: Course_Evaluation_Question_Type_Enum.Rating,
          questionKey: 'PERTINENCE_TO_WORK_ROLE',
          group: Course_Evaluation_Question_Group_Enum.TrainingRelevance,
          displayOrder: 1,
          required: true,
          __typename: 'course_evaluation_questions',
        },
        {
          id: '6eef2fba-d9cf-4107-bae1-f1eea48b719b',
          type: Course_Evaluation_Question_Type_Enum.Rating,
          questionKey: 'PREPARATION_AND_ORGANISATION',
          group: Course_Evaluation_Question_Group_Enum.TrainerStandards,
          displayOrder: 2,
          required: true,
          __typename: 'course_evaluation_questions',
        },
        {
          id: 'ca5dee24-d669-4f99-a06e-9de2bbca4d37',
          type: Course_Evaluation_Question_Type_Enum.Rating,
          questionKey: 'EMPHASIS_ON_DEESCALATION',
          group: Course_Evaluation_Question_Group_Enum.TrainingRating,
          displayOrder: 2,
          required: true,
          __typename: 'course_evaluation_questions',
        },
        {
          id: 'f7063f35-ed55-4f09-aa36-d6fde44b36fd',
          type: Course_Evaluation_Question_Type_Enum.Rating,
          questionKey: 'GROUP_PARTICIPATION',
          group: Course_Evaluation_Question_Group_Enum.TrainerStandards,
          displayOrder: 3,
          required: true,
          __typename: 'course_evaluation_questions',
        },
        {
          id: '9e42499c-b583-4ae9-928f-084b700dfb16',
          type: Course_Evaluation_Question_Type_Enum.Rating,
          questionKey: 'RISK_REDUCTION',
          group: Course_Evaluation_Question_Group_Enum.TrainingRating,
          displayOrder: 3,
          required: true,
          __typename: 'course_evaluation_questions',
        },
        {
          id: '3372bc24-47e5-47d6-8b99-e513458e724b',
          type: Course_Evaluation_Question_Type_Enum.Text,
          questionKey: 'ATTENDEE_ADDITIONAL_COMMENTS',
          group: null,
          displayOrder: 998,
          required: false,
          __typename: 'course_evaluation_questions',
        },
        {
          id: '191123c4-d070-4e93-9a72-d870decef8b3',
          type: null,
          questionKey: 'SIGNATURE',
          group: null,
          displayOrder: 999,
          required: true,
          __typename: 'course_evaluation_questions',
        },
      ],
    },
  })

export const buildCourseParticipantOliver = build<GetCourseParticipantIdQuery>({
  fields: {
    course_participant: [
      {
        profile: {
          fullName: 'Oliver Participant',
          avatar: null,
          archived: false,
          __typename: 'profile',
        },
        id: '18288b61-5e31-413c-a4f1-9c51eee925fa',
        completed_evaluation: false,
        grade: Grade_Enum.Pass,
        dateGraded: '2024-05-16T12:10:18.586+00:00',
        attended: true,
        healthSafetyConsent: true,
        gradingModules: [],
        certificate: {
          id: '96e9b791-9697-4f47-97ed-4285b974de85',
          createdAt: '2024-05-16T12:10:32.59732+00:00',
          updatedAt: '2024-05-16T12:10:32.59732+00:00',
          number: 'L1.F.OP-11005-4',
          expiryDate: '2025-04-19',
          certificationDate: '2024-04-19',
          courseName: 'Positive Behaviour Training: Level One ',
          courseLevel: 'LEVEL_1',
          status: 'ACTIVE',
          legacyCourseCode: null,
          blendedLearning: false,
          reaccreditation: false,
          courseAccreditedBy: Accreditors_Enum.Icm,
          __typename: 'course_certificate',
        },
        __typename: 'course_participant',
      },
    ],
  },
})

export const buildFeedbackUsers = build<GetFeedbackUsersQuery>({
  fields: {
    users: [
      {
        profile: {
          id: '467b4ac5-d86e-40ee-b25f-87e4ed2ce618',
          fullName: 'TeamTeach Org-Admin',
          avatar: null,
          archived: false,
          __typename: 'profile',
        },
      },
      {
        profile: {
          id: '6b72504a-6447-4b30-9909-e8e6fc1d300f',
          fullName: 'Oliver Participant',
          avatar: '',
          archived: false,
          __typename: 'profile',
        },
      },
      {
        profile: {
          id: '88072bb2-10e0-4417-b9ce-ec05265b8b56',
          fullName: 'TeamTeach Principal-Trainer',
          avatar: null,
          archived: false,
          __typename: 'profile',
        },
      },
    ],
  },
})

export const buildAttendeeCourseEvaluationAnswers = build<GetEvaluationQuery>({
  fields: {
    answers: [
      {
        id: '59d880ba-de29-4c31-af66-e0179538927b',
        question: {
          id: '191123c4-d070-4e93-9a72-d870decef8b3',
          type: null,
          __typename: 'course_evaluation_questions',
        },
        profile: {
          fullName: 'Oliver Participant',
          avatar: '',
          archived: false,
          __typename: 'profile',
        },
        answer: 'Oliver Participant',
        __typename: 'course_evaluation_answers',
      },
      {
        id: '23ad3ce8-6beb-4b17-a162-8a119ed8c3d7',
        question: {
          id: '3372bc24-47e5-47d6-8b99-e513458e724b',
          type: Course_Evaluation_Question_Type_Enum.Text,
          __typename: 'course_evaluation_questions',
        },
        profile: {
          fullName: 'Oliver Participant',
          avatar: '',
          archived: false,
          __typename: 'profile',
        },
        answer: 'Testing additional comments',
        __typename: 'course_evaluation_answers',
      },
      {
        id: 'bdd0fa2b-04bb-4d55-8edd-4f00513a38a9',
        question: {
          id: '2a8fb50e-e9fb-4720-91d4-4b010b1e1856',
          type: Course_Evaluation_Question_Type_Enum.Rating,
          __typename: 'course_evaluation_questions',
        },
        profile: {
          fullName: 'Oliver Participant',
          avatar: '',
          archived: false,
          __typename: 'profile',
        },
        answer: '5',
        __typename: 'course_evaluation_answers',
      },
      {
        id: '7282f4cb-2286-442d-99b4-407a77cebca1',
        question: {
          id: '7fa7a24c-875f-4563-b873-50d0aa617fad',
          type: Course_Evaluation_Question_Type_Enum.Rating,
          __typename: 'course_evaluation_questions',
        },
        profile: {
          fullName: 'Oliver Participant',
          avatar: '',
          archived: false,
          __typename: 'profile',
        },
        answer: '5',
        __typename: 'course_evaluation_answers',
      },
      {
        id: 'd9ae94bb-d586-48e5-8941-fc674c874ce6',
        question: {
          id: 'ca5dee24-d669-4f99-a06e-9de2bbca4d37',
          type: Course_Evaluation_Question_Type_Enum.Rating,
          __typename: 'course_evaluation_questions',
        },
        profile: {
          fullName: 'Oliver Participant',
          avatar: '',
          archived: false,
          __typename: 'profile',
        },
        answer: '5',
        __typename: 'course_evaluation_answers',
      },
      {
        id: '9db119ac-ab09-4501-81ad-bd1e214a0ac7',
        question: {
          id: '9e42499c-b583-4ae9-928f-084b700dfb16',
          type: Course_Evaluation_Question_Type_Enum.Rating,
          __typename: 'course_evaluation_questions',
        },
        profile: {
          fullName: 'Oliver Participant',
          avatar: '',
          archived: false,
          __typename: 'profile',
        },
        answer: '5',
        __typename: 'course_evaluation_answers',
      },
      {
        id: '12a76ac1-3abc-49bc-b261-b3b1a90a5ef4',
        question: {
          id: 'e0a443aa-ec78-4545-9b29-977f828e8a87',
          type: Course_Evaluation_Question_Type_Enum.Rating,
          __typename: 'course_evaluation_questions',
        },
        profile: {
          fullName: 'Oliver Participant',
          avatar: '',
          archived: false,
          __typename: 'profile',
        },
        answer: '5',
        __typename: 'course_evaluation_answers',
      },
      {
        id: '977b7e98-94fb-4586-a08f-c1d508e5f908',
        question: {
          id: 'b096a54a-cb25-4a47-a64a-c542e3b1daeb',
          type: Course_Evaluation_Question_Type_Enum.Rating,
          __typename: 'course_evaluation_questions',
        },
        profile: {
          fullName: 'Oliver Participant',
          avatar: '',
          archived: false,
          __typename: 'profile',
        },
        answer: '5',
        __typename: 'course_evaluation_answers',
      },
      {
        id: 'd4f3a2f1-7260-46c4-9d1a-6a7cb1fd6eaa',
        question: {
          id: 'fa1258f6-8397-45bf-8883-7134da99af75',
          type: Course_Evaluation_Question_Type_Enum.Rating,
          __typename: 'course_evaluation_questions',
        },
        profile: {
          fullName: 'Oliver Participant',
          avatar: '',
          archived: false,
          __typename: 'profile',
        },
        answer: '5',
        __typename: 'course_evaluation_answers',
      },
      {
        id: 'e304fa90-196c-4527-9906-32d9c4b9b626',
        question: {
          id: 'c33a5448-e426-4eb7-8f91-aca428459ec4',
          type: Course_Evaluation_Question_Type_Enum.Rating,
          __typename: 'course_evaluation_questions',
        },
        profile: {
          fullName: 'Oliver Participant',
          avatar: '',
          archived: false,
          __typename: 'profile',
        },
        answer: '5',
        __typename: 'course_evaluation_answers',
      },
      {
        id: '24b609c8-7d17-4ea2-b1c2-9007290d3fdb',
        question: {
          id: '6eef2fba-d9cf-4107-bae1-f1eea48b719b',
          type: Course_Evaluation_Question_Type_Enum.Rating,
          __typename: 'course_evaluation_questions',
        },
        profile: {
          fullName: 'Oliver Participant',
          avatar: '',
          archived: false,
          __typename: 'profile',
        },
        answer: '5',
        __typename: 'course_evaluation_answers',
      },
      {
        id: '3ceb5ae3-373c-446d-8c64-e12a52b3879b',
        question: {
          id: 'f7063f35-ed55-4f09-aa36-d6fde44b36fd',
          type: Course_Evaluation_Question_Type_Enum.Rating,
          __typename: 'course_evaluation_questions',
        },
        profile: {
          fullName: 'Oliver Participant',
          avatar: '',
          archived: false,
          __typename: 'profile',
        },
        answer: '5',
        __typename: 'course_evaluation_answers',
      },
      {
        id: 'ba82ae54-8f49-4588-b45c-200437576773',
        question: {
          id: 'd37c26a3-10f1-405e-b06c-6ca2e87d2c2b',
          type: Course_Evaluation_Question_Type_Enum.Rating,
          __typename: 'course_evaluation_questions',
        },
        profile: {
          fullName: 'Oliver Participant',
          avatar: '',
          archived: false,
          __typename: 'profile',
        },
        answer: '5',
        __typename: 'course_evaluation_answers',
      },
      {
        id: 'ac437511-d7f0-43cf-b9ad-aa533514d7bb',
        question: {
          id: '92c47603-6203-4707-89c4-792acfb6cf95',
          type: Course_Evaluation_Question_Type_Enum.Rating,
          __typename: 'course_evaluation_questions',
        },
        profile: {
          fullName: 'Oliver Participant',
          avatar: '',
          archived: false,
          __typename: 'profile',
        },
        answer: '5',
        __typename: 'course_evaluation_answers',
      },
    ],
  },
})

export const buildPricingSchedule = build<Course_Pricing_Schedule>({
  fields: {
    coursePricingId: chance.guid(),
    effectiveFrom: new Date(2024, 0, 1),
    priceAmount: 130,
    priceCurrency: Currency.Gbp,
    effectiveTo: new Date(2024, 11, 31),
    id: chance.guid(),
  },
})

export const buildCoursePricing = build<Course_Pricing>({
  fields: {
    blended: false,
    id: chance.guid(),
    level: Course_Level_Enum.Level_1,
    priceAmount: 130,
    priceCurrency: Currency.Gbp,
    pricingSchedules: [buildPricingSchedule()],
    pricingSchedules_aggregate: { aggregate: { count: 1 }, nodes: [] },
    reaccreditation: false,
    type: Course_Type_Enum.Open,
    xeroCode: '',
  },
})

export const buildPricing = build<
  PricingChangelogQuery['course_pricing_changelog'][0]
>({
  fields: {
    createdAt: chance.date(),
    id: chance.guid(),
    newPrice: chance.integer(),
    oldPrice: chance.integer(),
    author: {
      archived: false,
      fullName: chance.name(),
      id: chance.guid(),
    },
    coursePricing: buildCoursePricing(),
    indefiniteEffectiveTo: false,
  },
})
