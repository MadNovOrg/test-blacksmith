import { gql } from 'graphql-request'

import { CourseDeliveryType, CourseLevel, ModuleGroup } from '@app/types'

import { MODULE, MODULE_GROUP } from '../fragments'

export type ResponseType = { groups: ModuleGroup[] }

export type ParamsType = {
  level: CourseLevel
  courseDeliveryType: CourseDeliveryType
  reaccreditation: boolean
}

export const QUERY = gql`
  ${MODULE}
  ${MODULE_GROUP}
  query ModuleGroups(
    $level: course_level_enum!
    $courseDeliveryType: course_delivery_type_enum!
    $reaccreditation: Boolean!
  ) {
    groups: module_group(where: { level: { _eq: $level } }) {
      ...ModuleGroup
      modules {
        ...Module
      }
      duration: durations_aggregate(
        where: {
          reaccreditation: { _eq: $reaccreditation }
          courseDeliveryType: { _eq: $courseDeliveryType }
        }
        limit: 1
      ) {
        aggregate {
          sum {
            duration
          }
        }
      }
    }
  }
`
