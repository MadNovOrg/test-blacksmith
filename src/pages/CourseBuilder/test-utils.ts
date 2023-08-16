import {
  ModuleGroupsQuery,
  Course_Level_Enum,
  Color_Enum,
  ModuleFragment,
  Module_Category_Enum,
  CourseToBuildQuery,
  Course_Type_Enum,
  Course_Delivery_Type_Enum,
} from '@app/generated/graphql'

import { chance } from '@test/index'

export function buildModuleGroup(
  overrides?: Partial<ModuleGroupsQuery['groups'][0]>
): NonNullable<ModuleGroupsQuery['groups'][0]> {
  return {
    id: chance.guid(),
    name: chance.name(),
    level: Course_Level_Enum.Level_1,
    color: Color_Enum.Navy,
    mandatory: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    modules: [buildModule()],
    duration: {
      aggregate: {
        sum: {
          duration: 30,
        },
      },
    },
    ...overrides,
  }
}

export function buildModule(
  overrides?: Partial<ModuleFragment>
): ModuleFragment {
  return {
    id: chance.guid(),
    name: chance.name(),
    description: chance.sentence(),
    level: Course_Level_Enum.Level_1,
    type: Module_Category_Enum.Physical,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}

export function buildCourse(
  overrides?: Partial<CourseToBuildQuery['course']>
): NonNullable<CourseToBuildQuery['course']> {
  return {
    id: chance.integer(),
    name: chance.sentence(),
    updatedAt: new Date().toISOString(),
    type: Course_Type_Enum.Open,
    level: Course_Level_Enum.Advanced,
    go1Integration: false,
    deliveryType: Course_Delivery_Type_Enum.F2F,
    start: new Date().toISOString(),
    end: new Date().toISOString(),
    organization: {
      name: chance.name({ full: true }),
    },
    schedule: [
      {
        venue: {
          name: chance.name(),
          city: chance.name(),
        },
      },
    ],
    moduleGroupIds: [],
    bildModules: [],
    bildStrategies: [],
    ...overrides,
  }
}
