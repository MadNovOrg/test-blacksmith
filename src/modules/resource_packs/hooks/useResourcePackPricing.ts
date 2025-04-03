import { useMemo } from 'react'
import { gql, useQuery } from 'urql'

import {
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
  GetResourcePackPricingsQuery,
  GetResourcePackPricingsQueryVariables,
  Resource_Packs_Pricing_Bool_Exp,
} from '@app/generated/graphql'
import { ResourcePacksOptions } from '@app/modules/course/components/CourseForm/components/ResourcePacksTypeSection/types'
import { getResourcePacksType, Resource_Pack_Delivery_Type } from '@app/util'

export type UseResourcePackPricingProps = {
  course_type: Course_Type_Enum
  course_level: Course_Level_Enum
  course_delivery_type: Course_Delivery_Type_Enum
  reaccreditation: boolean
  organisation_id: string
  resourcePacksOptions?: ResourcePacksOptions
  pause?: boolean
}

export const GET_RESOURCE_PACK_PRICINGS = gql`
  query GetResourcePackPricings(
    $where: resource_packs_pricing_bool_exp!
    $organisation_id: uuid
    $forSpecificOrg: Boolean!
  ) {
    resource_packs_pricing(where: $where) {
      id
      AUD_price
      NZD_price
      org_resource_packs_pricings(
        where: { organisation_id: { _eq: $organisation_id } }
      ) @include(if: $forSpecificOrg) {
        id
        AUD_price
        NZD_price
      }
    }
  }
`

export const useResourcePackPricing = ({
  course_type,
  course_level,
  course_delivery_type,
  reaccreditation,
  organisation_id,
  resourcePacksOptions,
  pause = false,
}: UseResourcePackPricingProps) => {
  const where = useMemo(() => {
    return {
      _and: [
        {
          course_level: {
            _eq: course_level,
          },
        },
        {
          course_type: {
            _eq: course_type,
          },
        },
        {
          resource_packs_type: {
            _eq: getResourcePacksType(
              course_type,
              course_delivery_type,
              resourcePacksOptions,
            ),
          },
        },
        // We have the same prices for both reaccred and non reaccred on indirect
        {
          reaccred: {
            _eq:
              course_type === Course_Type_Enum.Indirect
                ? false
                : reaccreditation,
          },
        },
        resourcePacksOptions &&
        resourcePacksOptions !== ResourcePacksOptions.DigitalWorkbook
          ? {
              resource_packs_delivery_type: {
                _eq: Resource_Pack_Delivery_Type[resourcePacksOptions],
              },
            }
          : {},
      ],
    } as Resource_Packs_Pricing_Bool_Exp
  }, [
    course_delivery_type,
    course_level,
    course_type,
    reaccreditation,
    resourcePacksOptions,
  ])
  const [{ data, error, fetching }] = useQuery<
    GetResourcePackPricingsQuery,
    GetResourcePackPricingsQueryVariables
  >({
    query: GET_RESOURCE_PACK_PRICINGS,
    variables: {
      where,
      organisation_id,
      forSpecificOrg: !!organisation_id,
    },
    pause: pause,
    requestPolicy: 'network-only',
  })
  return {
    data,
    error,
    fetching,
  }
}
