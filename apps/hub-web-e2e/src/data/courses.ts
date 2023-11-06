import { addMonths, subDays } from 'date-fns'

import { Course_Status_Enum, Course_Source_Enum } from '@app/generated/graphql'
import { CourseDeliveryType, CourseLevel, CourseType } from '@app/types'

import { Accreditors_Enum } from '@qa/generated/graphql'

import { buildVenue } from '@test/mock-data-utils'

import { Course } from './types'

export const COURSES_TO_VIEW: Course[] = [
  {
    id: 0,
    name: 'Positive Behaviour Training: Level One',
    description: 'Some description 1 F2F',
    level: CourseLevel.Level_1,
    status: Course_Status_Enum.ConfirmModules,
    deliveryType: CourseDeliveryType.F2F,
    type: CourseType.OPEN,
    reaccreditation: false,
    schedule: [
      {
        start: addMonths(new Date(), 2),
        end: addMonths(new Date(), 2),
        venue: buildVenue({
          overrides: { name: 'Queen Elizabeth II Centre' },
        }),
      },
    ],
    min_participants: 6,
    max_participants: 11,
    gradingConfirmed: false,
    accreditedBy: Accreditors_Enum.Icm,
  },
  {
    id: 0,
    name: 'Positive Behaviour Training: Level Two',
    description: 'Some description 2 Mixed',
    level: CourseLevel.Level_2,
    status: Course_Status_Enum.ConfirmModules,
    deliveryType: CourseDeliveryType.MIXED,
    type: CourseType.CLOSED,
    reaccreditation: false,
    organization: { name: 'London First School' },
    schedule: [
      {
        start: addMonths(new Date(), 2),
        end: addMonths(new Date(), 2),
        venue: buildVenue({
          overrides: { name: 'Queen Elizabeth II Centre' },
        }),
        virtualLink: 'https://zoom.us/dummy.link',
      },
    ],
    min_participants: 6,
    max_participants: 11,
    gradingConfirmed: false,
    accreditedBy: Accreditors_Enum.Icm,
  },
  {
    id: 0,
    name: 'Positive Behaviour Training: Advanced Modules',
    description: 'Some description 3 Virtual',
    level: CourseLevel.Advanced,
    status: Course_Status_Enum.ConfirmModules,
    deliveryType: CourseDeliveryType.VIRTUAL,
    type: CourseType.CLOSED,
    reaccreditation: false,
    organization: { name: 'London First School' },
    accreditedBy: Accreditors_Enum.Icm,
    schedule: [
      {
        start: addMonths(new Date(), 2),
        end: addMonths(new Date(), 2),
        virtualLink: 'https://zoom.us/dummy.link',
      },
    ],
    min_participants: 6,
    max_participants: 11,
    gradingConfirmed: false,
  },
]

export const UNIQUE_COURSE: () => Course = () => ({
  id: 0,
  name: 'Positive Behaviour Training: Level One',
  description: `Some description ${Date.now()}`,
  level: CourseLevel.Level_1,
  status: Course_Status_Enum.Scheduled,
  source: Course_Source_Enum.EmailEnquiry,
  deliveryType: CourseDeliveryType.F2F,
  type: CourseType.OPEN,
  reaccreditation: false,
  go1Integration: false,
  accreditedBy: Accreditors_Enum.Icm,
  schedule: [
    {
      start: addMonths(new Date(new Date().setHours(8, 0)), 2),
      end: addMonths(new Date(new Date().setHours(17, 0)), 2),
      venue: buildVenue({
        overrides: { name: 'Queen Elizabeth II Centre' },
      }),
    },
  ],
  min_participants: 1,
  max_participants: 11,
  gradingConfirmed: false,
  invoiceDetails: {
    organisation: 'London First School',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@londonschool.co.uk',
    phone: '1939394939',
    purchaseOrder: '12345',
  },
})

export const FINISHED_COURSE: () => Course = () => ({
  ...UNIQUE_COURSE(),
  status: Course_Status_Enum.Completed,
  schedule: [{ start: subDays(new Date(), 2), end: subDays(new Date(), 1) }],
})
