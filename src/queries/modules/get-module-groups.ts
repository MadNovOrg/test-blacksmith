import { gql } from 'graphql-request'

import { Course_Level_Enum } from '@app/generated/graphql'
import { CourseDeliveryType, ModuleGroup } from '@app/types'

import { MODULE, MODULE_GROUP } from '../fragments'

export type ResponseType = { groups: ModuleGroup[] }

export type ParamsType = {
  level: Course_Level_Enum
  courseDeliveryType: CourseDeliveryType
  reaccreditation: boolean
  go1Integration: boolean
}

export const QUERY = gql`
  ${MODULE}
  ${MODULE_GROUP}
  query ModuleGroups(
    $level: course_level_enum!
    $courseDeliveryType: course_delivery_type_enum!
    $reaccreditation: Boolean!
    $go1Integration: Boolean!
  ) {
    groups: module_group(
      where: { level: { _eq: $level } }
      order_by: { color: asc, mandatory: desc, name: asc }
    ) {
      ...ModuleGroup
      modules {
        ...Module
      }
      duration: durations_aggregate(
        where: {
          reaccreditation: { _eq: $reaccreditation }
          courseDeliveryType: { _eq: $courseDeliveryType }
          go1Integration: { _eq: $go1Integration }
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
