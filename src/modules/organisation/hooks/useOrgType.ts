import { useMemo } from 'react'
import { useQuery } from 'urql'

import {
  GetOrgTypesQuery,
  GetOrgTypesQueryVariables,
  Organisation_Sector_Enum,
  Organization_Type_Bool_Exp,
} from '@app/generated/graphql'
import { GET_ORG_TYPES } from '@app/modules/organisation/queries/get-org-types'

export const useOrgType = (sector: string, international = false) => {
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
    case 'anz_edu':
      sectorMap.set(sector, Organisation_Sector_Enum.AnzEdu)
      break
    case 'anz_ss':
      sectorMap.set(sector, Organisation_Sector_Enum.AnzSs)
      break
    case 'anz_health':
      sectorMap.set(sector, Organisation_Sector_Enum.AnzHealth)
      break
    default:
      sectorMap.set(sector, 'other')
      break
  }

  const where: Organization_Type_Bool_Exp = {
    sector: { _eq: sectorMap.get(sector) },
    ...(!international ? { nonUK: { _eq: false } } : {}),
  }

  const [{ data: orgTypes }] = useQuery<
    GetOrgTypesQuery,
    GetOrgTypesQueryVariables
  >({
    query: GET_ORG_TYPES,
    variables: {
      where,
    },
    pause: !sector,
  })

  return useMemo(
    () => ({
      data: orgTypes,
    }),
    [orgTypes],
  )
}
