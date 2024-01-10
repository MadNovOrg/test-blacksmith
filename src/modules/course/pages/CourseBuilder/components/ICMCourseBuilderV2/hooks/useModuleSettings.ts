import { gql, useQuery } from 'urql'

import {
  CourseToBuildQuery,
  ModuleSettingsQuery,
  ModuleSettingsQueryVariables,
} from '@app/generated/graphql'

export const MODULE_SETTINGS_QUERY = gql`
  query ModuleSettings(
    $courseType: course_type_enum!
    $courseLevel: course_level_enum!
    $courseDeliveryType: course_delivery_type_enum!
    $go1Integration: Boolean!
    $reaccreditation: Boolean
  ) {
    moduleSettings: module_setting(
      where: {
        courseType: { _eq: $courseType }
        courseLevel: { _eq: $courseLevel }
        courseDeliveryType: { _eq: $courseDeliveryType }
        go1Integration: { _eq: $go1Integration }
        reaccreditation: { _eq: $reaccreditation }
      }
      order_by: { sort: asc }
    ) {
      id
      color
      mandatory
      duration
      sort
      module {
        id
        name
        displayName
        lessons
      }
    }
  }
`

export function useModuleSettings(course: CourseToBuildQuery['course']) {
  return useQuery<ModuleSettingsQuery, ModuleSettingsQueryVariables>({
    query: MODULE_SETTINGS_QUERY,
    pause: !course,
    requestPolicy: 'cache-and-network',
    ...(course
      ? {
          variables: {
            courseType: course.type,
            courseLevel: course.level,
            courseDeliveryType: course.deliveryType,
            reaccreditation: course.reaccreditation,
            go1Integration: course.go1Integration,
          },
        }
      : null),
  })
}
