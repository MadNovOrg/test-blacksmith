import { addMonths, subDays } from 'date-fns'

import {
  Course_Status_Enum,
  Course_Source_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
  Course_Delivery_Type_Enum,
} from '@app/generated/graphql'

import { Accreditors_Enum } from '@qa/generated/graphql'

import { buildVenue } from '@test/mock-data-utils'

import { Course } from './types' // best to replace this with generated course type

export const COURSES_TO_VIEW: Course[] = [
  {
    id: 0,
    name: 'Positive Behaviour Training: Level One',
    description: 'Some description 1 F2F',
    level: Course_Level_Enum.Level_1,
    status: Course_Status_Enum.ConfirmModules,
    deliveryType: Course_Delivery_Type_Enum.F2F,
    type: Course_Type_Enum.Open,
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
    level: Course_Level_Enum.Level_2,
    status: Course_Status_Enum.ConfirmModules,
    deliveryType: Course_Delivery_Type_Enum.Mixed,
    type: Course_Type_Enum.Closed,
    reaccreditation: false,
    organization: { name: 'London First School' },
    course_code: '',
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
    level: Course_Level_Enum.Advanced,
    status: Course_Status_Enum.ConfirmModules,
    deliveryType: Course_Delivery_Type_Enum.Virtual,
    type: Course_Type_Enum.Closed,
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
  accreditedBy: Accreditors_Enum.Icm,
  curriculum: [
    {
      id: '696749a5-689e-4866-9dab-37579a16d2f7',
      name: 'Theory',
      lessons: {
        items: [
          { name: 'Values Exercise', covered: true },
          { name: 'Legal Framework', covered: true },
          { name: 'Policies Practices & Procedure', covered: true },
          { name: 'Understanding Emotions & Behaviour', covered: true },
          { name: 'Six Stages Of Crisis', covered: true },
          { name: 'Conflict Spiral', covered: true },
          { name: 'Fizzy Pop Challenge', covered: true },
          { name: 'Behaviours That Challenge', covered: true },
          { name: 'De-escalation Scenario', covered: true },
          { name: 'Handling Plans', covered: true },
          { name: 'Scripts', covered: true },
          { name: 'Post Listening & Learning', covered: true },
          { name: 'Quiz', covered: true },
        ],
      },
      mandatory: true,
      __typename: 'module_v2',
      displayName: null,
    },
    {
      id: 'c9c4fb88-e68e-4f9b-a394-d6c1a95876c0',
      name: 'Personal Space & Body Language',
      lessons: {
        items: [
          { name: 'Circles Of Danger', covered: true },
          { name: 'Posturing And Body Language', covered: true },
          { name: 'Experiencing Feeling', covered: true },
          { name: 'Calm Stance', covered: true },
          { name: 'Calming Scripts', covered: true },
        ],
      },
      mandatory: true,
      __typename: 'module_v2',
      displayName: null,
    },
    {
      id: '0d8e3892-e200-45dc-bf4f-5039ac1cf8c7',
      name: 'Elevated Risks',
      lessons: {
        items: [
          { name: 'Positional Asphyxia & Hyper Flexion', covered: true },
          { name: 'Pressure on Abdomen & ribcage', covered: true },
          { name: 'Leaning forward', covered: true },
          { name: 'Prone restraint', covered: true },
        ],
      },
      mandatory: true,
      __typename: 'module_v2',
      displayName: null,
    },
  ],
  deliveryType: Course_Delivery_Type_Enum.F2F,
  description: `Some description ${Date.now()}`,
  go1Integration: false,
  gradingConfirmed: false,
  invoiceDetails: {
    email: 'john.doe@londonschool.co.uk',
    firstName: 'John',
    lastName: 'Doe',
    organisation: 'London First School',
    phone: '+445555555555',
    purchaseOrder: '12345',
  },
  level: Course_Level_Enum.Level_1,
  min_participants: 1,
  max_participants: 11,
  name: 'Positive Behaviour Training: Level One',
  reaccreditation: false,
  schedule: [
    {
      start: addMonths(new Date(new Date().setHours(8, 0)), 2),
      end: addMonths(new Date(new Date().setHours(17, 0)), 2),
      venue: buildVenue({
        overrides: { name: 'Queen Elizabeth II Centre' },
      }),
    },
  ],
  source: Course_Source_Enum.EmailEnquiry,
  status: Course_Status_Enum.Scheduled,
  type: Course_Type_Enum.Open,
})

export const FINISHED_COURSE: () => Course = () => ({
  ...UNIQUE_COURSE(),
  status: Course_Status_Enum.Completed,
  schedule: [{ start: subDays(new Date(), 2), end: subDays(new Date(), 1) }],
})
