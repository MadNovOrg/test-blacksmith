import { useMemo } from 'react'
import { useQuery } from 'urql'

import {
  AllResourceCategoriesQuery,
  ResourceCategory,
} from '@app/generated/graphql'
import { ALL_RESOURCE_CATEGORIES_QUERY } from '@app/modules/resources/queries/get-all-resource-categories'

import { useResourcePermission } from '../hooks/useResourcePermission'

type ResourceArea = 'basic' | 'additional'

export const useResourceAreas = () => {
  const [{ data, fetching }] = useQuery<AllResourceCategoriesQuery>({
    query: ALL_RESOURCE_CATEGORIES_QUERY,
    requestPolicy: 'cache-and-network',
  })

  const canAccessResource = useResourcePermission()

  const allResources = data?.content?.resourceCategories?.nodes

  const allResourcesByArea = useMemo(() => {
    return allResources?.reduce<Record<string, ResourceCategory[]>>(
      (acc, current) => {
        const areaType = current?.resourceArea?.resourcearea as ResourceArea

        const hasAccess = current?.resourcePermissions
          ? canAccessResource(current.resourcePermissions)
          : false

        if (areaType && hasAccess) {
          acc[areaType] = acc[areaType] ?? []
          acc[areaType]?.push(current as ResourceCategory)
        }
        return acc
      },
      {},
    )
  }, [allResources, canAccessResource])

  return {
    allResourcesByArea,
    fetching,
  }
}
