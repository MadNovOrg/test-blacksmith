import { gql } from 'graphql-request'

import { MODULE, MODULE_GROUP } from '../fragments'

import { CourseLevel, ModuleGroup } from '@app/types'

export type ResponseType = { groups: ModuleGroup[] }

export type ParamsType = { level: CourseLevel }

export const QUERY = gql`
  ${MODULE}
  ${MODULE_GROUP}
  query ModuleGroups($level: course_level_enum!) {
    groups: module_group(where: { level: { _eq: $level } }) {
      ...ModuleGroup
      modules {
        ...Module
      }
      durations {
        courseDeliveryType
        reaccreditation
        duration
      }
    }
  }
`
