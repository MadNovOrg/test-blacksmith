import {
  CourseDeliveryType,
  CourseLevel,
  CourseStatus,
  CourseType,
} from '../../src/types'
import { setNextMonth } from '../util'

import { Course } from './types'

export const COURSES_TO_VIEW: Course[] = [
  {
    name: 'Positive Behaviour Training: Level One',
    description: 'Some description 1 V',
    level: CourseLevel.LEVEL_1,
    status: CourseStatus.PENDING,
    deliveryType: CourseDeliveryType.VIRTUAL,
    type: CourseType.OPEN,
    reaccreditation: false,
    schedule: [
      {
        name: 'name',
        type: 'WEBINAR',
        start: setNextMonth(new Date('2022-07-10T09:00:00Z')),
        end: setNextMonth(new Date('2022-07-10T17:00:00Z')),
      },
    ],
  },
  {
    name: 'Positive Behaviour Training: Level One',
    description: 'Some description 1 F2F',
    level: CourseLevel.LEVEL_1,
    status: CourseStatus.PENDING,
    deliveryType: CourseDeliveryType.F2F,
    type: CourseType.OPEN,
    reaccreditation: false,
    schedule: [
      {
        name: 'name',
        type: 'PHYSICAL',
        start: setNextMonth(new Date('2022-06-10T09:00:00Z')),
        end: setNextMonth(new Date('2022-06-10T17:00:00Z')),
        venue: 'Queen Elizabeth II Centre',
      },
    ],
  },
  {
    name: 'Positive Behaviour Training: Level One Reaccreditation',
    description: 'Some description 1 F2F reaccr',
    level: CourseLevel.LEVEL_1,
    status: CourseStatus.PENDING,
    deliveryType: CourseDeliveryType.F2F,
    type: CourseType.CLOSED,
    reaccreditation: true,
    organization: { name: 'London First School' },
    schedule: [
      {
        name: 'name',
        type: 'PHYSICAL',
        start: setNextMonth(new Date('2022-06-10T09:00:00Z')),
        end: setNextMonth(new Date('2022-06-10T17:00:00Z')),
        venue: 'Queen Elizabeth II Centre',
      },
    ],
  },
  {
    name: 'Positive Behaviour Training: Level Two',
    description: 'Some description 2 F2F',
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
        start: setNextMonth(new Date('2022-07-15T09:00:00Z')),
        end: setNextMonth(new Date('2022-07-16T16:00:00Z')),
        venue: 'Queen Elizabeth II Centre',
      },
    ],
  },
  {
    name: 'Positive Behaviour Training: Level Two Reaccreditation',
    description: 'Some description 2 F2F reaccr',
    level: CourseLevel.LEVEL_2,
    status: CourseStatus.PENDING,
    deliveryType: CourseDeliveryType.F2F,
    type: CourseType.CLOSED,
    reaccreditation: true,
    organization: { name: 'London First School' },
    schedule: [
      {
        name: 'name',
        type: 'PHYSICAL',
        start: setNextMonth(new Date('2022-07-15T09:00:00Z')),
        end: setNextMonth(new Date('2022-07-16T16:00:00Z')),
        venue: 'Queen Elizabeth II Centre',
      },
    ],
  },
  {
    name: 'Positive Behaviour Training: Level Two',
    description: 'Some description 2 BL',
    level: CourseLevel.LEVEL_2,
    status: CourseStatus.PENDING,
    deliveryType: CourseDeliveryType.F2F,
    go1Integration: true,
    type: CourseType.INDIRECT,
    reaccreditation: false,
    organization: { name: 'London First School' },
    schedule: [
      {
        name: 'name',
        type: 'PHYSICAL',
        start: setNextMonth(new Date('2022-07-15T09:00:00Z')),
        end: setNextMonth(new Date('2022-07-16T16:00:00Z')),
        venue: 'Queen Elizabeth II Centre',
      },
    ],
  },
  {
    name: 'Positive Behaviour Training: Advanced Modules',
    description: 'Some description 3 F2F',
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
        start: setNextMonth(new Date('2022-07-18T09:00:00Z')),
        end: setNextMonth(new Date('2022-07-19T16:00:00Z')),
        venue: 'Queen Elizabeth II Centre',
      },
    ],
  },
]

export const UNIQUE_COURSE: () => Course = () => ({
  name: 'Positive Behaviour Training: Level One',
  description: `Some description ${Date.now()}`,
  level: CourseLevel.LEVEL_1,
  status: CourseStatus.PENDING,
  deliveryType: CourseDeliveryType.F2F,
  type: CourseType.OPEN,
  reaccreditation: false,
  go1Integration: false,
  organization: { name: 'London First School' },
  schedule: [
    {
      name: 'name',
      type: 'PHYSICAL',
      start: setNextMonth(new Date('2022-07-10T09:00:00Z')),
      end: setNextMonth(new Date('2022-07-10T17:00:00Z')),
      venue: 'Queen Elizabeth II Centre',
    },
  ],
})
