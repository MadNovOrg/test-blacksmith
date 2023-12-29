import { gql } from 'urql'

export const MODULE_SETTINGS = gql`
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
      module {
        id
        name
        displayName
        lessons
      }
    }
  }
`
