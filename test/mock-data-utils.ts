import { build, fake, perBuild } from '@jackfranklin/test-data-bot'
import { add, sub } from 'date-fns'

import {
  Address,
  Course,
  CourseDeliveryType,
  CourseLevel,
  CourseParticipant,
  CourseSchedule,
  CourseType,
  Organization,
  Profile,
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
    status: 'ENABLED',
    contactDetails: [{ type: 'email', value: fake(f => f.internet.email()) }],
    attributes: [{ attribute: 'value' }],
    addresses: [buildAddress()],
    preferences: [],
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
    status: '',
    addresses: {},
    attributes: [],
    contactDetails: [],
    email: fake(f => f.internet.email()),
    avatar: fake(f => f.internet.avatar()),
    phone: fake(f => f.phone.phoneNumber()),
    dob: fake(f => f.date.past()),
    jobTitle: fake(f => f.name.jobTitle()),
    tags: null,
    preferences: {},
    roles: [{ role: { name: fake(f => f.random.word()) } }],
    organizations: [{ organization: buildOrganization() }],
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
    name: fake(f => f.random.words(3)),
    type: fake(f => f.random.word()),
    start: sub(new Date(), { days: 2 }).toISOString(),
    end: sub(new Date(), { days: 1 }).toISOString(),
    venue: buildVenue(),
  },
})

export const buildCourseScheduleNotStartedCourse = build<CourseSchedule>({
  fields: {
    id: fake(f => f.datatype.uuid()),
    createdAt: new Date().toISOString(),
    name: fake(f => f.random.words(3)),
    type: fake(f => f.random.word()),
    start: add(new Date(), { days: 1 }).toISOString(),
    end: add(new Date(), { days: 2 }).toISOString(),
    venue: buildVenue(),
  },
})

export const buildCourseSchedule = build<CourseSchedule>({
  fields: {
    id: fake(f => f.datatype.uuid()),
    createdAt: new Date().toISOString(),
    name: fake(f => f.random.words(3)),
    type: fake(f => f.random.word()),
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
    id: fake(f => f.datatype.uuid()),
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
    trainers: [buildCourseTrainer()],
    dates: {},
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
    trainers: [buildCourseTrainer()],
    dates: {
      aggregate: {
        start: { date: sub(new Date(), { days: 2 }).toISOString() },
        end: { date: sub(new Date(), { days: 1 }).toISOString() },
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
    trainers: [buildCourseTrainer()],
    dates: {
      aggregate: {
        start: { date: add(new Date(), { days: 1 }).toISOString() },
        end: { date: add(new Date(), { days: 2 }).toISOString() },
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
  },
})
