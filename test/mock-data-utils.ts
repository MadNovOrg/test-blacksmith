import { build, fake, perBuild } from '@jackfranklin/test-data-bot'

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
    title: fake(f => f.random.word()),
    status: '',
    addresses: {},
    attributes: [],
    contactDetails: [],
    email: fake(f => f.internet.email()),
    tags: null,
    preferences: {},
    roles: [{ role: { name: fake(f => f.random.word()) } }],
    organizations: [{ organization: buildOrganization() }],
  },
})

export const buildVenue = build<Venue>({
  fields: {
    id: fake(f => f.datatype.uuid()),
    name: fake(f => f.random.words(3)),
    address: { city: fake(f => f.address.city()) },
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
  },
})

export const buildCourse = build<Course>({
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
    reaccreditation: () => false,
    organization: buildOrganization(),
    schedule: [buildCourseSchedule()],
    level: CourseLevel.LEVEL_1,
    trainer: buildProfile(),
    dates: {},
    modulesAgg: {},
    moduleGroupIds: [],
  },
})

export const buildParticipant = build<CourseParticipant>({
  fields: {
    id: fake(f => f.datatype.uuid()),
    profile: perBuild(() => buildProfile()),
    course: perBuild(() => buildCourse()),
    go1EnrolmentStatus: BlendedLearningStatus.IN_PROGRESS,
  },
})

export const buildInvite = build<CourseInvite>({
  fields: {
    id: fake(f => f.datatype.uuid()),
    email: fake(f => f.internet.email()),
    status: 'PENDING',
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
