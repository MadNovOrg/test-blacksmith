import {
  Course_Status_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
  Course_Delivery_Type_Enum,
} from '@app/generated/graphql'

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
    name: 'level 1 f2f open',
    course: (() => {
      const course = UNIQUE_COURSE()
      course.level = Course_Level_Enum.Level_1
      course.type = Course_Type_Enum.Open
      course.status = Course_Status_Enum.ConfirmModules
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
      {
        name: 'Personal Safety',
        duration: '30mins',
      },
      {
        name: 'Prompts and Guides',
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
    ],
    optionalModules: [],
    modulesToMove: [],
    durationBefore: '',
    durationAfter: '',
  },
  {
    name: 'level 1 f2f',
    course: (() => {
      const course = UNIQUE_COURSE()
      course.level = Course_Level_Enum.Level_1
      course.type = Course_Type_Enum.Closed
      course.status = Course_Status_Enum.ConfirmModules
      course.organization = { name: 'London First School' }
      course.reaccreditation = false
      return course
    })(),
    mandatoryModules: [
      {
        name: 'Theory *',
        duration: '3hrs',
      },
      {
        name: 'Personal Space & Body Language *',
        duration: '1hr',
      },
      {
        name: 'Elevated Risks *',
        duration: '30mins',
      },
      {
        name: 'Physical Warm Up *',
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
      course.level = Course_Level_Enum.Level_1
      course.type = Course_Type_Enum.Closed
      course.status = Course_Status_Enum.ConfirmModules
      course.organization = { name: 'London First School' }
      course.reaccreditation = true
      return course
    })(),
    mandatoryModules: [
      {
        name: 'Theory *',
        duration: '1hr 30mins',
      },
      {
        name: 'Personal Space & Body Language *',
        duration: '1hr',
      },
      {
        name: 'Elevated Risks *',
        duration: '15mins',
      },
      {
        name: 'Physical Warm Up *',
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
      course.deliveryType = Course_Delivery_Type_Enum.Mixed
      course.level = Course_Level_Enum.Level_1
      course.type = Course_Type_Enum.Closed
      course.status = Course_Status_Enum.ConfirmModules
      course.organization = { name: 'London First School' }
      course.reaccreditation = true
      return course
    })(),
    mandatoryModules: [
      {
        name: 'Theory *',
        duration: '1hr 30mins',
      },
      {
        name: 'Personal Space & Body Language *',
        duration: '1hr',
      },
      {
        name: 'Elevated Risks *',
        duration: '15mins',
      },
      {
        name: 'Physical Warm Up *',
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
      course.deliveryType = Course_Delivery_Type_Enum.Virtual
      course.level = Course_Level_Enum.Level_1
      course.type = Course_Type_Enum.Closed
      course.status = Course_Status_Enum.ConfirmModules
      course.organization = { name: 'London First School' }
      course.reaccreditation = true
      return course
    })(),
    mandatoryModules: [
      {
        name: 'Theory *',
        duration: '1hr 30mins',
      },
      {
        name: 'Personal Space & Body Language *',
        duration: '1hr',
      },
      {
        name: 'Elevated Risks *',
        duration: '15mins',
      },
      {
        name: 'Physical Warm Up *',
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
      course.level = Course_Level_Enum.Level_1
      course.type = Course_Type_Enum.Closed
      course.status = Course_Status_Enum.ConfirmModules
      course.organization = { name: 'London First School' }
      course.deliveryType = Course_Delivery_Type_Enum.F2F
      course.go1Integration = true
      return course
    })(),
    mandatoryModules: [
      {
        name: 'Theory *',
        duration: '30mins',
      },
      {
        name: 'Personal Space & Body Language *',
        duration: '30mins',
      },
      {
        name: 'Elevated Risks *',
        duration: '30mins',
      },
      {
        name: 'Physical Warm Up *',
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
      course.deliveryType = Course_Delivery_Type_Enum.Mixed
      course.level = Course_Level_Enum.Level_1
      course.type = Course_Type_Enum.Closed
      course.status = Course_Status_Enum.ConfirmModules
      course.organization = { name: 'London First School' }
      course.deliveryType = Course_Delivery_Type_Enum.F2F
      course.go1Integration = true
      return course
    })(),
    mandatoryModules: [
      {
        name: 'Theory *',
        duration: '30mins',
      },
      {
        name: 'Personal Space & Body Language *',
        duration: '30mins',
      },
      {
        name: 'Elevated Risks *',
        duration: '30mins',
      },
      {
        name: 'Physical Warm Up *',
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
      course.level = Course_Level_Enum.Level_2
      course.type = Course_Type_Enum.Closed
      course.status = Course_Status_Enum.ConfirmModules
      course.organization = { name: 'London First School' }
      course.reaccreditation = false
      return course
    })(),
    mandatoryModules: [
      {
        name: 'Theory *',
        duration: '3hrs',
      },
      {
        name: 'Personal Space & Body Language *',
        duration: '1hr',
      },
      {
        name: 'Elevated Risks *',
        duration: '30mins',
      },
      {
        name: 'Physical Warm Up *',
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
        name: 'Seated Holds',
        duration: '1hr 30mins',
      },
      {
        name: 'Two Person Escorts',
        duration: '1hr 30mins',
      },
    ],
    modulesToMove: ['Two Person Escorts'],
    durationBefore: '5hrs',
    durationAfter: '6hrs 30mins',
  },
  {
    name: 'level 2 mixed',
    course: (() => {
      const course = UNIQUE_COURSE()
      course.deliveryType = Course_Delivery_Type_Enum.Mixed
      course.level = Course_Level_Enum.Level_2
      course.type = Course_Type_Enum.Closed
      course.status = Course_Status_Enum.ConfirmModules
      course.organization = { name: 'London First School' }
      course.reaccreditation = false
      return course
    })(),
    mandatoryModules: [
      {
        name: 'Theory *',
        duration: '3hrs',
      },
      {
        name: 'Personal Space & Body Language *',
        duration: '1hr',
      },
      {
        name: 'Elevated Risks *',
        duration: '30mins',
      },
      {
        name: 'Physical Warm Up *',
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
    modulesToMove: ['Two Person Escorts'],
    durationBefore: '5hrs',
    durationAfter: '6hrs 30mins',
  },
  {
    name: 'level 2 f2f reaccred',
    course: (() => {
      const course = UNIQUE_COURSE()
      course.level = Course_Level_Enum.Level_2
      course.type = Course_Type_Enum.Closed
      course.status = Course_Status_Enum.ConfirmModules
      course.organization = { name: 'London First School' }
      course.reaccreditation = true
      return course
    })(),
    mandatoryModules: [
      {
        name: 'Theory *',
        duration: '1hr 30mins',
      },
      {
        name: 'Personal Space & Body Language *',
        duration: '1hr',
      },
      {
        name: 'Elevated Risks *',
        duration: '15mins',
      },
      {
        name: 'Physical Warm Up *',
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
    modulesToMove: ['Two Person Escorts'],
    durationBefore: '3hrs',
    durationAfter: '3hrs 45mins',
  },
  {
    name: 'level 2 mixed reaccred',
    course: (() => {
      const course = UNIQUE_COURSE()
      course.level = Course_Level_Enum.Level_2
      course.type = Course_Type_Enum.Closed
      course.status = Course_Status_Enum.ConfirmModules
      course.organization = { name: 'London First School' }
      course.reaccreditation = true
      return course
    })(),
    mandatoryModules: [
      {
        name: 'Theory *',
        duration: '1hr 30mins',
      },
      {
        name: 'Personal Space & Body Language *',
        duration: '1hr',
      },
      {
        name: 'Elevated Risks *',
        duration: '15mins',
      },
      {
        name: 'Physical Warm Up *',
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
        name: 'Seated Holds',
        duration: '45mins',
      },
      {
        name: 'Two Person Escorts',
        duration: '45mins',
      },
    ],
    modulesToMove: ['Two Person Escorts'],
    durationBefore: '3hrs',
    durationAfter: '3hrs 45mins',
  },
  {
    name: 'level 2 f2f blended',
    course: (() => {
      const course = UNIQUE_COURSE()
      course.level = Course_Level_Enum.Level_2
      course.type = Course_Type_Enum.Closed
      course.status = Course_Status_Enum.ConfirmModules
      course.organization = { name: 'London First School' }
      course.deliveryType = Course_Delivery_Type_Enum.F2F
      course.go1Integration = true
      return course
    })(),
    mandatoryModules: [
      {
        name: 'Theory *',
        duration: '30mins',
      },
      {
        name: 'Personal Space & Body Language *',
        duration: '30mins',
      },
      {
        name: 'Elevated Risks *',
        duration: '30mins',
      },
      {
        name: 'Physical Warm Up *',
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
        name: 'Seated Holds',
        duration: '1hr 30mins',
      },
      {
        name: 'Two Person Escorts',
        duration: '1hr 30mins',
      },
    ],
    modulesToMove: ['Two Person Escorts'],
    durationBefore: '1hr 45mins',
    durationAfter: '3hrs 15mins',
  },
  {
    name: 'level 2 f2f blended reaccred',
    course: (() => {
      const course = UNIQUE_COURSE()
      course.level = Course_Level_Enum.Level_2
      course.type = Course_Type_Enum.Closed
      course.status = Course_Status_Enum.ConfirmModules
      course.organization = { name: 'London First School' }
      course.deliveryType = Course_Delivery_Type_Enum.F2F
      course.reaccreditation = true
      course.go1Integration = true
      return course
    })(),
    mandatoryModules: [
      {
        name: 'Theory *',
        duration: '30mins',
      },
      {
        name: 'Personal Space & Body Language *',
        duration: '30mins',
      },
      {
        name: 'Elevated Risks *',
        duration: '30mins',
      },
      {
        name: 'Physical Warm Up *',
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
        name: 'Seated Holds',
        duration: '45mins',
      },
      {
        name: 'Two Person Escorts',
        duration: '45mins',
      },
    ],
    modulesToMove: ['Two Person Escorts'],
    durationBefore: '1hr 45mins',
    durationAfter: '2hrs 30mins',
  },
  {
    name: 'advanced f2f @smoke',
    course: (() => {
      const course = UNIQUE_COURSE()
      course.level = Course_Level_Enum.Advanced
      course.type = Course_Type_Enum.Closed
      course.status = Course_Status_Enum.ConfirmModules
      course.organization = { name: 'London First School' }
      return course
    })(),
    mandatoryModules: [
      {
        name: 'Advanced Warm Up *',
        duration: '15mins',
      },
      {
        name: 'Legal & Health *',
        duration: '20mins',
      },
    ],
    optionalModules: [
      {
        name: 'Additional Ground Responses',
        duration: '30mins',
      },
      {
        name: 'Ground Recovery Safeguards',
        duration: '2hrs',
      },
      {
        name: 'Everyday Objects used as Weapons',
        duration: '2hrs',
      },
      {
        name: 'Transport',
        duration: '40mins',
      },
    ],
    modulesToMove: ['Ground Recovery Safeguards'],
    durationBefore: '35mins',
    durationAfter: '2hrs 35mins',
  },
]

const MODULES_BY_LEVEL: Map<Course_Level_Enum, string[]> = new Map()
  .set(Course_Level_Enum.Level_1, [
    'Theory',
    'Personal Space & Body Language',
    'Elevated Risks',
    'Physical Warm Up',
    'Personal Safety',
  ])
  .set(Course_Level_Enum.Level_2, [
    'Theory',
    'Personal Space & Body Language',
    'Elevated Risks',
    'Physical Warm Up',
    'Personal Safety',
  ])
  .set(Course_Level_Enum.Advanced, [
    'Theory',
    'Personal Space & Body Language',
    'Elevated Risks',
    'Physical Warm Up',
    'Personal Safety',
  ])
  .set(Course_Level_Enum.IntermediateTrainer, [
    'Theory',
    'Personal Space & Body Language',
    'Elevated Risks',
    'Physical Warm Up',
    'Personal Safety',
  ])
  .set(Course_Level_Enum.AdvancedTrainer, [
    'Theory',
    'Personal Space & Body Language',
    'Elevated Risks',
    'Physical Warm Up',
    'Personal Safety',
  ])

export const getModulesByLevel: (level: Course_Level_Enum) => string[] = (
  level: Course_Level_Enum,
) => {
  const moduleNames = MODULES_BY_LEVEL.get(level)
  if (!moduleNames) {
    throw Error(`No modules by level: ${level}`)
  }
  return moduleNames
}
