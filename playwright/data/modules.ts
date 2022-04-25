import { CourseDeliveryType, CourseLevel, CourseType } from '@app/types'

import { UNIQUE_COURSE } from './courses'
import { Course, ModuleGroup } from './types'

export type ModuleSetup = {
  name: string
  course: Course
  mandatoryModules: ModuleGroup[]
  optionalModules: ModuleGroup[]
  modulesToMove: string[]
  durationBefore: string
  durationAfter: string
}

export const MODULES_SETUP: ModuleSetup[] = [
  {
    name: 'level 1 f2f',
    course: UNIQUE_COURSE(),
    mandatoryModules: [
      {
        name: 'Theory',
        duration: '2hrs',
      },
      {
        name: 'Personal Space & Body Language',
        duration: '2hrs',
      },
      {
        name: 'Elevated Risks',
        duration: '30mins',
      },
      {
        name: 'Physical Warm Up',
        duration: '15mins',
      },
    ],
    optionalModules: [
      {
        name: 'Personal Safety',
        duration: '30mins',
      },
      {
        name: 'Neck Disengagement',
        duration: '30mins',
      },
      {
        name: 'Prompts and Guides',
        duration: '20mins',
      },
      {
        name: 'Separations',
        duration: '20mins',
      },
      {
        name: 'Clothing Responses',
        duration: '20mins',
      },
      {
        name: 'Hair Responses',
        duration: '20mins',
      },
      {
        name: 'Bite Responses',
        duration: '20mins',
      },
      {
        name: 'Small Child and One Person Holds & Prompts and Guides',
        duration: '1hr 20mins',
      },
    ],
    modulesToMove: ['Personal Safety', 'Separations'],
    durationBefore: '4hrs 45mins',
    durationAfter: '5hrs 35mins',
  },
  {
    name: 'level 1 f2f reaccred',
    course: (() => {
      const course = UNIQUE_COURSE()
      course.level = CourseLevel.LEVEL_1
      course.type = CourseType.CLOSED
      course.reaccreditation = true
      return course
    })(),
    mandatoryModules: [
      {
        name: 'Theory',
        duration: '1hr',
      },
      {
        name: 'Personal Space & Body Language',
        duration: '1hr',
      },
      {
        name: 'Elevated Risks',
        duration: '45mins',
      },
      {
        name: 'Physical Warm Up',
        duration: '15mins',
      },
    ],
    optionalModules: [
      {
        name: 'Personal Safety',
        duration: '20mins',
      },
      {
        name: 'Neck Disengagement',
        duration: '20mins',
      },
      {
        name: 'Prompts and Guides',
        duration: '15mins',
      },
      {
        name: 'Separations',
        duration: '15mins',
      },
      {
        name: 'Clothing Responses',
        duration: '15mins',
      },
      {
        name: 'Hair Responses',
        duration: '15mins',
      },
      {
        name: 'Bite Responses',
        duration: '15mins',
      },
      {
        name: 'Small Child and One Person Holds & Prompts and Guides',
        duration: '45mins',
      },
    ],
    modulesToMove: ['Personal Safety', 'Separations'],
    durationBefore: '3hrs',
    durationAfter: '3hrs 35mins',
  },
  {
    name: 'level 1 blended',
    course: (() => {
      const course = UNIQUE_COURSE()
      course.level = CourseLevel.LEVEL_1
      course.type = CourseType.CLOSED
      course.deliveryType = CourseDeliveryType.F2F
      course.go1Integration = true
      return course
    })(),
    mandatoryModules: [
      {
        name: 'Theory',
        duration: '30mins',
      },
      {
        name: 'Personal Space & Body Language',
        duration: '30mins',
      },
      {
        name: 'Elevated Risks',
        duration: '30mins',
      },
      {
        name: 'Physical Warm Up',
        duration: '15mins',
      },
    ],
    optionalModules: [
      {
        name: 'Personal Safety',
        duration: '30mins',
      },
      {
        name: 'Neck Disengagement',
        duration: '30mins',
      },
      {
        name: 'Prompts and Guides',
        duration: '20mins',
      },
      {
        name: 'Separations',
        duration: '20mins',
      },
      {
        name: 'Clothing Responses',
        duration: '20mins',
      },
      {
        name: 'Hair Responses',
        duration: '20mins',
      },
      {
        name: 'Bite Responses',
        duration: '20mins',
      },
      {
        name: 'Small Child and One Person Holds & Prompts and Guides',
        duration: '1hr 20mins',
      },
    ],
    modulesToMove: ['Personal Safety', 'Separations'],
    durationBefore: '1hrs 45mins',
    durationAfter: '5hrs 35mins',
  },
  {
    name: 'level 2 f2f',
    course: (() => {
      const course = UNIQUE_COURSE()
      course.level = CourseLevel.LEVEL_2
      course.type = CourseType.CLOSED
      return course
    })(),
    mandatoryModules: [
      {
        name: 'Theory',
        duration: '2hrs',
      },
      {
        name: 'Personal Space & Body Language',
        duration: '2hrs',
      },
      {
        name: 'Elevated Risks',
        duration: '30mins',
      },
      {
        name: 'Physical Warm Up',
        duration: '15mins',
      },
    ],
    optionalModules: [
      {
        name: 'Personal Safety',
        duration: '30mins',
      },
      {
        name: 'Neck Disengagement',
        duration: '30mins',
      },
      {
        name: 'Prompts and Guides',
        duration: '20mins',
      },
      {
        name: 'Separations',
        duration: '20mins',
      },
      {
        name: 'Clothing Responses',
        duration: '20mins',
      },
      {
        name: 'Hair Responses',
        duration: '20mins',
      },
      {
        name: 'Bite Responses',
        duration: '20mins',
      },
      {
        name: 'Small Child and One Person Holds & Prompts and Guides',
        duration: '1hr 20mins',
      },
      {
        name: 'Two Person Escorts',
        duration: '1hr 30mins',
      },
      {
        name: 'Seated Holds & Two Person Escorts',
        duration: '3hrs',
      },
    ],
    modulesToMove: ['Personal Safety', 'Separations', 'Two Person Escorts'],
    durationBefore: '4hrs 45mins',
    durationAfter: '7hrs 5mins',
  },
  {
    name: 'level 2 f2f reaccred',
    course: (() => {
      const course = UNIQUE_COURSE()
      course.level = CourseLevel.LEVEL_2
      course.type = CourseType.CLOSED
      course.reaccreditation = true
      return course
    })(),
    mandatoryModules: [
      {
        name: 'Theory',
        duration: '1hr',
      },
      {
        name: 'Personal Space & Body Language',
        duration: '1hr',
      },
      {
        name: 'Elevated Risks',
        duration: '45mins',
      },
      {
        name: 'Physical Warm Up',
        duration: '15mins',
      },
    ],
    optionalModules: [
      {
        name: 'Personal Safety',
        duration: '20mins',
      },
      {
        name: 'Neck Disengagement',
        duration: '20mins',
      },
      {
        name: 'Prompts and Guides',
        duration: '15mins',
      },
      {
        name: 'Separations',
        duration: '15mins',
      },
      {
        name: 'Clothing Responses',
        duration: '15mins',
      },
      {
        name: 'Hair Responses',
        duration: '15mins',
      },
      {
        name: 'Bite Responses',
        duration: '15mins',
      },
      {
        name: 'Small Child and One Person Holds & Prompts and Guides',
        duration: '45mins',
      },
      {
        name: 'Two Person Escorts',
        duration: '45mins',
      },
      {
        name: 'Seated Holds & Two Person Escorts',
        duration: '1hr 30mins',
      },
    ],
    modulesToMove: ['Personal Safety', 'Separations', 'Two Person Escorts'],
    durationBefore: '3hrs',
    durationAfter: '5hrs 20mins',
  },
  {
    name: 'level 2 blended',
    course: (() => {
      const course = UNIQUE_COURSE()
      course.level = CourseLevel.LEVEL_2
      course.type = CourseType.CLOSED
      course.deliveryType = CourseDeliveryType.F2F
      course.go1Integration = true
      return course
    })(),
    mandatoryModules: [
      {
        name: 'Theory',
        duration: '30mins',
      },
      {
        name: 'Personal Space & Body Language',
        duration: '30mins',
      },
      {
        name: 'Elevated Risks',
        duration: '30mins',
      },
      {
        name: 'Physical Warm Up',
        duration: '15mins',
      },
    ],
    optionalModules: [
      {
        name: 'Personal Safety',
        duration: '30mins',
      },
      {
        name: 'Neck Disengagement',
        duration: '30mins',
      },
      {
        name: 'Prompts and Guides',
        duration: '20mins',
      },
      {
        name: 'Separations',
        duration: '20mins',
      },
      {
        name: 'Clothing Responses',
        duration: '20mins',
      },
      {
        name: 'Hair Responses',
        duration: '20mins',
      },
      {
        name: 'Bite Responses',
        duration: '20mins',
      },
      {
        name: 'Small Child and One Person Holds & Prompts and Guides',
        duration: '1hr 20mins',
      },
      {
        name: 'Two Person Escorts',
        duration: '1hr 30mins',
      },
      {
        name: 'Seated Holds & Two Person Escorts',
        duration: '3hrs',
      },
    ],
    modulesToMove: ['Personal Safety', 'Separations', 'Two Person Escorts'],
    durationBefore: '1hrs 45mins',
    durationAfter: '4hrs 5mins',
  },
  {
    name: 'level 2 blended reaccred',
    course: (() => {
      const course = UNIQUE_COURSE()
      course.level = CourseLevel.LEVEL_2
      course.type = CourseType.CLOSED
      course.deliveryType = CourseDeliveryType.F2F
      course.reaccreditation = true
      course.go1Integration = true
      return course
    })(),
    mandatoryModules: [
      {
        name: 'Theory',
        duration: '30mins',
      },
      {
        name: 'Personal Space & Body Language',
        duration: '30mins',
      },
      {
        name: 'Elevated Risks',
        duration: '30mins',
      },
      {
        name: 'Physical Warm Up',
        duration: '15mins',
      },
    ],
    optionalModules: [
      {
        name: 'Personal Safety',
        duration: '20mins',
      },
      {
        name: 'Neck Disengagement',
        duration: '20mins',
      },
      {
        name: 'Prompts and Guides',
        duration: '15mins',
      },
      {
        name: 'Separations',
        duration: '15mins',
      },
      {
        name: 'Clothing Responses',
        duration: '15mins',
      },
      {
        name: 'Hair Responses',
        duration: '15mins',
      },
      {
        name: 'Bite Responses',
        duration: '15mins',
      },
      {
        name: 'Small Child and One Person Holds & Prompts and Guides',
        duration: '45mins',
      },
      {
        name: 'Two Person Escorts',
        duration: '45mins',
      },
      {
        name: 'Seated Holds & Two Person Escorts',
        duration: '1hr 30mins',
      },
    ],
    modulesToMove: ['Personal Safety', 'Separations', 'Two Person Escorts'],
    durationBefore: '1hr 45mins',
    durationAfter: '3hrs 5mins',
  },
  {
    name: 'advanced f2f @smoke',
    course: (() => {
      const course = UNIQUE_COURSE()
      course.level = CourseLevel.ADVANCED
      course.type = CourseType.CLOSED
      return course
    })(),
    mandatoryModules: [],
    optionalModules: [
      {
        name: 'Advanced Warm Up',
        duration: '15mins',
      },
      {
        name: 'Ground Recovery Techniques',
        duration: '6hrs',
      },
      {
        name: 'Response to Ground Assaults',
        duration: '3hrs',
      },
      {
        name: 'Dead Weight Response',
        duration: '20mins',
      },
      {
        name: 'Everyday Objects Used As Weapons',
        duration: '6hrs',
      },
      {
        name: 'Transport',
        duration: '1hr',
      },
    ],
    modulesToMove: ['Ground Recovery Techniques', 'Transport'],
    durationBefore: '0mins',
    durationAfter: '7hrs',
  },
]

export const MODULES_BY_LEVEL: Map<CourseLevel, string[]> = new Map([
  [
    CourseLevel.LEVEL_1,
    [
      'Theory',
      'Personal Space & Body Language',
      'Elevated Risks',
      'Physical Warm Up',
      'Personal Safety',
    ],
  ],
])
