import { useMemo } from 'react'
import { gql, useQuery } from 'urql'

import {
  OrgResourcePacksQuery,
  OrgResourcePacksQueryVariables,
  Resource_Packs_Type_Enum,
} from '@app/generated/graphql'

export const ORG_RESOURCE_PACKS = gql`
  query OrgResourcePacks($orgId: uuid!) {
    resourcePacks: organization_resource_packs(
      where: { orgId: { _eq: $orgId } }
    ) {
      id
      orgId
      reservedResourcePacks
      resourcePacksType
      totalResourcePacks
    }
  }
`

export function useOrgResourcePacks({
  orgId,
  pause = false,
}: {
  orgId: string | undefined
  pause?: boolean
}): {
  balance: Record<Resource_Packs_Type_Enum, number | undefined>
  reserved: Record<Resource_Packs_Type_Enum, number | undefined>
} {
  const [{ data }] = useQuery<
    OrgResourcePacksQuery,
    OrgResourcePacksQueryVariables
  >({
    pause: !orgId || pause,
    query: ORG_RESOURCE_PACKS,
    requestPolicy: 'cache-and-network',
    variables: { orgId },
  })

  const resourcePacks = useMemo(
    () => ({
      balance: {
        [Resource_Packs_Type_Enum.DigitalWorkbook]: data?.resourcePacks.find(
          resourcePack =>
            resourcePack.resourcePacksType ===
            Resource_Packs_Type_Enum.DigitalWorkbook,
        )?.totalResourcePacks,
        [Resource_Packs_Type_Enum.PrintWorkbook]: data?.resourcePacks.find(
          resourcePack =>
            resourcePack.resourcePacksType ===
            Resource_Packs_Type_Enum.PrintWorkbook,
        )?.totalResourcePacks,
      },
      reserved: {
        [Resource_Packs_Type_Enum.DigitalWorkbook]: data?.resourcePacks.find(
          resourcePack =>
            resourcePack.resourcePacksType ===
            Resource_Packs_Type_Enum.DigitalWorkbook,
        )?.reservedResourcePacks,
        [Resource_Packs_Type_Enum.PrintWorkbook]: data?.resourcePacks.find(
          resourcePack =>
            resourcePack.resourcePacksType ===
            Resource_Packs_Type_Enum.PrintWorkbook,
        )?.reservedResourcePacks,
      },
    }),
    [data?.resourcePacks],
  )

  return resourcePacks
}
