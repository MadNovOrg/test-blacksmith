import { useMemo } from 'react'
import { useQuery } from 'urql'

import {
  AllResourceCategoriesQuery,
  ResourceCategory,
} from '@app/generated/graphql'
import { ALL_RESOURCE_CATEGORIES_QUERY } from '@app/pages/Resources/queries/get-all-resource-categories'

type ResourceArea = 'basic' | 'additional'

export const useResourceAreas = () => {
  const [{ data, fetching }] = useQuery<AllResourceCategoriesQuery>({
    query: ALL_RESOURCE_CATEGORIES_QUERY,
  })

  const allResources = data?.content?.resourceCategories?.nodes

  const allResourcesByArea = useMemo(() => {
    return allResources?.reduce<Record<string, ResourceCategory[]>>(
      (acc, current) => {
        const areaType = current?.resourceArea?.resourcearea as ResourceArea

        if (areaType) {
          acc[areaType] = acc[areaType] ?? []
          acc[areaType]?.push(current as ResourceCategory)
        }
        return acc
      },
      {}
    )
  }, [allResources])

  return {
    allResourcesByArea,
    fetching,
  }
}
