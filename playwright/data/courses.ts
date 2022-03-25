import {
  CourseDeliveryType,
  CourseLevel,
  CourseStatus,
  CourseType,
} from '../../src/types'

import { Course } from './types'

export const COURSES_TO_VIEW: Course[] = [
  {
    name: 'Positive behaviour 1 V',
    description: 'Some description.',
    level: CourseLevel.LEVEL_1,
    status: CourseStatus.PENDING,
    deliveryType: CourseDeliveryType.VIRTUAL,
    type: CourseType.OPEN,
    reaccreditation: false,
    schedule: [
      {
        name: 'name',
        type: 'WEBINAR',
        start: new Date('2022-07-10T09:00:00Z'),
        end: new Date('2022-07-10T17:00:00Z'),
      },
    ],
  },
  {
    name: 'Positive behaviour 1 F2F',
    description: 'Some description.',
    level: CourseLevel.LEVEL_1,
    status: CourseStatus.PENDING,
    deliveryType: CourseDeliveryType.F2F,
    type: CourseType.OPEN,
    reaccreditation: false,
    schedule: [
      {
        name: 'name',
        type: 'PHYSICAL',
        start: new Date('2022-06-10T09:00:00Z'),
        end: new Date('2022-06-10T17:00:00Z'),
        venue: 'Queen Elizabeth II Centre',
      },
    ],
  },
  {
    name: 'Positive behaviour 2 F2F',
    description: 'Some description.',
    level: CourseLevel.LEVEL_2,
    status: CourseStatus.PENDING,
    deliveryType: CourseDeliveryType.F2F,
    type: CourseType.CLOSED,
    reaccreditation: false,
    organization: { name: 'London First School' },
    schedule: [
      {
        name: 'name',
        type: 'PHYSICAL',
        start: new Date('2022-07-15T09:00:00Z'),
        end: new Date('2022-07-16T16:00:00Z'),
        venue: 'Queen Elizabeth II Centre',
      },
    ],
  },
  {
    name: 'Positive behaviour 2 BL',
    description: 'Some description.',
    level: CourseLevel.LEVEL_2,
    status: CourseStatus.PENDING,
    deliveryType: CourseDeliveryType.BLENDED,
    type: CourseType.INDIRECT,
    reaccreditation: false,
    schedule: [
      {
        name: 'name',
        type: 'PHYSICAL',
        start: new Date('2022-07-15T09:00:00Z'),
        end: new Date('2022-07-16T16:00:00Z'),
        venue: 'Queen Elizabeth II Centre',
      },
    ],
  },
  {
    name: 'Positive behaviour 3 F2F',
    description: 'Some description.',
    level: CourseLevel.ADVANCED,
    status: CourseStatus.PENDING,
    deliveryType: CourseDeliveryType.F2F,
    type: CourseType.CLOSED,
    reaccreditation: false,
    organization: { name: 'London First School' },
    schedule: [
      {
        name: 'name',
        type: 'PHYSICAL',
        start: new Date('2022-07-18T09:00:00Z'),
        end: new Date('2022-07-19T16:00:00Z'),
        venue: 'Queen Elizabeth II Centre',
      },
    ],
  },
  {
    name: 'Positive behaviour Inter F2F',
    description: 'Some description.',
    level: CourseLevel.INTERMEDIATE,
    status: CourseStatus.PENDING,
    deliveryType: CourseDeliveryType.F2F,
    type: CourseType.CLOSED,
    reaccreditation: false,
    organization: { name: 'London First School' },
    schedule: [
      {
        name: 'name',
        type: 'PHYSICAL',
        start: new Date('2022-07-22T09:00:00Z'),
        end: new Date('2022-07-23T16:00:00Z'),
        venue: 'Queen Elizabeth II Centre',
      },
    ],
  },
]
