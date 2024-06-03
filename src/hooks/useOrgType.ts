import { useMemo } from 'react'
import { useQuery } from 'urql'

import {
  GetOrgTypesQuery,
  GetOrgTypesQueryVariables,
  Organisation_Sector_Enum,
} from '@app/generated/graphql'
import { GET_ORG_TYPES } from '@app/queries/organization/get-org-types'

export const useOrgType = (sector: string) => {
  const sectorMap = new Map()
  switch (sector) {
    case 'edu':
      sectorMap.set(sector, Organisation_Sector_Enum.Edu)
      break
    case 'hsc_child':
      sectorMap.set(sector, Organisation_Sector_Enum.HscChildren)
      break
    case 'hsc_adult':
      sectorMap.set(sector, Organisation_Sector_Enum.HscAdult)
      break
    default:
      'other'
  }

  const [{ data: orgTypes }] = useQuery<
    GetOrgTypesQuery,
    GetOrgTypesQueryVariables
  >({
    query: GET_ORG_TYPES,
    variables: {
      sector: sectorMap.get(sector),
    },
    pause: !sector,
  })

  return useMemo(
    () => ({
      data: orgTypes,
    }),
    [orgTypes]
  )
}
