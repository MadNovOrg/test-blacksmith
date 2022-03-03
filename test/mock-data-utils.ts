import { build, fake } from '@jackfranklin/test-data-bot'

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
} from '@app/types'

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
    contactDetails: [{ type: 'email', value: fake(f => f.internet.email()) }],
    tags: null,
    preferences: {},
  },
})

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
    status: 'ENABLED',
    contactDetails: [{ type: 'email', value: fake(f => f.internet.email()) }],
    attributes: [{ attribute: 'value' }],
    addresses: [buildAddress()],
    preferences: [],
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
    deliveryType: CourseDeliveryType.F2F,
    reaccreditation: () => false,
    organization: buildOrganization(),
    schedule: [buildCourseSchedule()],
    level: CourseLevel.LEVEL_1,
    trainer: buildProfile(),
    dates: {},
    modulesAgg: {},
  },
})

export const buildParticipant = build<CourseParticipant>({
  fields: {
    id: fake(f => f.datatype.uuid()),
    firstName: fake(f => f.name.firstName()),
    lastName: fake(f => f.name.lastName()),
    organization: buildOrganization(),
    contactDetails: [{ type: 'email', value: fake(f => f.internet.email()) }],
    course: buildCourse(),
  },
})
