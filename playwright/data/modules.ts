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
    course: (() => {
      const course = UNIQUE_COURSE()
      course.level = CourseLevel.Level_1
      course.type = CourseType.CLOSED
      course.organization = { name: 'London First School' }
      course.reaccreditation = false
      return course
    })(),
    mandatoryModules: [
      {
        name: 'Theory',
        duration: '3hrs',
      },
      {
        name: 'Personal Space & Body Language',
        duration: '1hr',
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
        name: 'Small Child and One Person Holds',
        duration: '1hr',
      },
    ],
    modulesToMove: [],
    durationBefore: '4hrs 45mins',
    durationAfter: '4hrs 45mins',
  },
  {
    name: 'level 1 f2f reaccred',
    course: (() => {
      const course = UNIQUE_COURSE()
      course.level = CourseLevel.Level_1
      course.type = CourseType.CLOSED
      course.organization = { name: 'London First School' }
      course.reaccreditation = true
      return course
    })(),
    mandatoryModules: [
      {
        name: 'Theory',
        duration: '1hr 30mins',
      },
      {
        name: 'Personal Space & Body Language',
        duration: '1hr',
      },
      {
        name: 'Elevated Risks',
        duration: '15mins',
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
        name: 'Small Child and One Person Holds',
        duration: '30mins',
      },
    ],
    modulesToMove: [],
    durationBefore: '3hrs',
    durationAfter: '3hrs',
  },
  {
    name: 'level 1 mixed reaccred',
    course: (() => {
      const course = UNIQUE_COURSE()
      course.deliveryType = CourseDeliveryType.MIXED
      course.level = CourseLevel.Level_1
      course.type = CourseType.CLOSED
      course.organization = { name: 'London First School' }
      course.reaccreditation = true
      return course
    })(),
    mandatoryModules: [
      {
        name: 'Theory',
        duration: '1hr 30mins',
      },
      {
        name: 'Personal Space & Body Language',
        duration: '1hr',
      },
      {
        name: 'Elevated Risks',
        duration: '15mins',
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
        name: 'Small Child and One Person Holds',
        duration: '30mins',
      },
    ],
    modulesToMove: [],
    durationBefore: '3hrs',
    durationAfter: '3hrs',
  },
  {
    name: 'level 1 virtual reaccred',
    course: (() => {
      const course = UNIQUE_COURSE()
      course.deliveryType = CourseDeliveryType.VIRTUAL
      course.level = CourseLevel.Level_1
      course.type = CourseType.CLOSED
      course.organization = { name: 'London First School' }
      course.reaccreditation = true
      return course
    })(),
    mandatoryModules: [
      {
        name: 'Theory',
        duration: '1hr 30mins',
      },
      {
        name: 'Personal Space & Body Language',
        duration: '1hr',
      },
      {
        name: 'Elevated Risks',
        duration: '15mins',
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
        name: 'Small Child and One Person Holds',
        duration: '30mins',
      },
    ],
    modulesToMove: [],
    durationBefore: '3hrs',
    durationAfter: '3hrs',
  },
  {
    name: 'level 1 f2f blended',
    course: (() => {
      const course = UNIQUE_COURSE()
      course.level = CourseLevel.Level_1
      course.type = CourseType.CLOSED
      course.organization = { name: 'London First School' }
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
        name: 'Small Child and One Person Holds',
        duration: '1hr',
      },
    ],
    modulesToMove: [],
    durationBefore: '1hr 45mins',
    durationAfter: '1hr 45mins',
  },
  {
    name: 'level 1 virtual blended',
    course: (() => {
      const course = UNIQUE_COURSE()
      course.deliveryType = CourseDeliveryType.MIXED
      course.level = CourseLevel.Level_1
      course.type = CourseType.CLOSED
      course.organization = { name: 'London First School' }
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
        name: 'Small Child and One Person Holds',
        duration: '1hr',
      },
    ],
    modulesToMove: [],
    durationBefore: '1hr 45mins',
    durationAfter: '1hr 45mins',
  },
  {
    name: 'level 2 f2f',
    course: (() => {
      const course = UNIQUE_COURSE()
      course.level = CourseLevel.Level_2
      course.type = CourseType.CLOSED
      course.organization = { name: 'London First School' }
      course.reaccreditation = false
      return course
    })(),
    mandatoryModules: [
      {
        name: 'Theory',
        duration: '3hrs',
      },
      {
        name: 'Personal Space & Body Language',
        duration: '1hr',
      },
      {
        name: 'Elevated Risks',
        duration: '30mins',
      },
      {
        name: 'Physical Warm Up',
        duration: '30mins',
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
        name: 'Small Child and One Person Holds',
        duration: '1hr',
      },
      {
        name: 'Two Person Escorts',
        duration: '1hr 30mins',
      },
      {
        name: 'Seated Holds',
        duration: '1hr 30mins',
      },
    ],
    modulesToMove: [],
    durationBefore: '5hrs',
    durationAfter: '5hrs',
  },
  {
    name: 'level 2 mixed',
    course: (() => {
      const course = UNIQUE_COURSE()
      course.deliveryType = CourseDeliveryType.MIXED
      course.level = CourseLevel.Level_2
      course.type = CourseType.CLOSED
      course.organization = { name: 'London First School' }
      course.reaccreditation = false
      return course
    })(),
    mandatoryModules: [
      {
        name: 'Theory',
        duration: '3hrs',
      },
      {
        name: 'Personal Space & Body Language',
        duration: '1hr',
      },
      {
        name: 'Elevated Risks',
        duration: '30mins',
      },
      {
        name: 'Physical Warm Up',
        duration: '30mins',
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
        name: 'Small Child and One Person Holds',
        duration: '1hr',
      },
      {
        name: 'Two Person Escorts',
        duration: '1hr 30mins',
      },
      {
        name: 'Seated Holds',
        duration: '1hr 30mins',
      },
    ],
    modulesToMove: [],
    durationBefore: '5hrs',
    durationAfter: '5hrs',
  },
  {
    name: 'level 2 f2f reaccred',
    course: (() => {
      const course = UNIQUE_COURSE()
      course.level = CourseLevel.Level_2
      course.type = CourseType.CLOSED
      course.organization = { name: 'London First School' }
      course.reaccreditation = true
      return course
    })(),
    mandatoryModules: [
      {
        name: 'Theory',
        duration: '1hr 30mins',
      },
      {
        name: 'Personal Space & Body Language',
        duration: '1hr',
      },
      {
        name: 'Elevated Risks',
        duration: '15mins',
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
        name: 'Small Child and One Person Holds',
        duration: '30mins',
      },
      {
        name: 'Two Person Escorts',
        duration: '45mins',
      },
      {
        name: 'Seated Holds',
        duration: '45mins',
      },
    ],
    modulesToMove: [],
    durationBefore: '3hrs',
    durationAfter: '3hrs',
  },
  {
    name: 'level 2 mixed reaccred',
    course: (() => {
      const course = UNIQUE_COURSE()
      course.level = CourseLevel.Level_2
      course.type = CourseType.CLOSED
      course.organization = { name: 'London First School' }
      course.reaccreditation = true
      return course
    })(),
    mandatoryModules: [
      {
        name: 'Theory',
        duration: '1hr 30mins',
      },
      {
        name: 'Personal Space & Body Language',
        duration: '1hr',
      },
      {
        name: 'Elevated Risks',
        duration: '15mins',
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
        name: 'Small Child and One Person Holds',
        duration: '30mins',
      },
      {
        name: 'Two Person Escorts',
        duration: '45mins',
      },
      {
        name: 'Seated Holds',
        duration: '45mins',
      },
    ],
    modulesToMove: [],
    durationBefore: '3hrs',
    durationAfter: '3hrs',
  },
  {
    name: 'level 2 f2f blended',
    course: (() => {
      const course = UNIQUE_COURSE()
      course.level = CourseLevel.Level_2
      course.type = CourseType.CLOSED
      course.organization = { name: 'London First School' }
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
        name: 'Small Child and One Person Holds',
        duration: '1hr',
      },
      {
        name: 'Two Person Escorts',
        duration: '1hr 30mins',
      },
      {
        name: 'Seated Holds',
        duration: '1hr 30mins',
      },
    ],
    modulesToMove: [],
    durationBefore: '1hr 45mins',
    durationAfter: '1hr 45mins',
  },
  {
    name: 'level 2 f2f blended reaccred',
    course: (() => {
      const course = UNIQUE_COURSE()
      course.level = CourseLevel.Level_2
      course.type = CourseType.CLOSED
      course.organization = { name: 'London First School' }
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
        name: 'Small Child and One Person Holds',
        duration: '30mins',
      },
      {
        name: 'Two Person Escorts',
        duration: '45mins',
      },
      {
        name: 'Seated Holds',
        duration: '45mins',
      },
    ],
    modulesToMove: [],
    durationBefore: '1hr 45mins',
    durationAfter: '1hr 45mins',
  },
  {
    name: 'advanced f2f @smoke',
    course: (() => {
      const course = UNIQUE_COURSE()
      course.level = CourseLevel.Advanced
      course.type = CourseType.CLOSED
      course.organization = { name: 'London First School' }
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
    modulesToMove: ['Ground Recovery Techniques'],
    durationBefore: '0mins',
    durationAfter: '6hrs',
  },
]

const MODULES_BY_LEVEL: Map<CourseLevel, string[]> = new Map([
  [
    CourseLevel.Level_1,
    [
      'Theory',
      'Personal Space & Body Language',
      'Elevated Risks',
      'Physical Warm Up',
      'Personal Safety',
    ],
  ],
])

export const getModulesByLevel: (level: CourseLevel) => string[] = (
  level: CourseLevel
) => {
  const moduleNames = MODULES_BY_LEVEL.get(level)
  if (!moduleNames) {
    throw Error(`No modules by level: ${level}`)
  }
  return moduleNames
}
