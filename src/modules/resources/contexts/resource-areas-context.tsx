import React, {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useState,
  useEffect,
} from 'react'
import { useQuery } from 'urql'

import {
  AllResourceCategoriesQuery,
  ResourceCategory,
} from '@app/generated/graphql'
import { ALL_RESOURCE_CATEGORIES_QUERY } from '@app/modules/resources/queries/get-all-resource-categories'
import { hasAtLeastOneItem } from '@app/util'

import { useResourcePermission } from '../hooks/useResourcePermission'

type ResourceArea = 'basic' | 'additional'

interface ResourceAreasContextValue {
  allResourcesByArea: Record<string, ResourceCategory[]> | undefined
  fetching: boolean
  hasAnyResourceAccess: boolean
}

const ResourceAreasContext = createContext<
  ResourceAreasContextValue | undefined
>(undefined)

interface ResourceAreasProviderProps {
  children: ReactNode
}

export const ResourceAreasProvider: React.FC<ResourceAreasProviderProps> = ({
  children,
}) => {
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)

  const [{ data, fetching }] = useQuery<AllResourceCategoriesQuery>({
    query: ALL_RESOURCE_CATEGORIES_QUERY,
    requestPolicy: 'cache-and-network',
    pause: initialLoadComplete,
  })

  useEffect(() => {
    if (data && !initialLoadComplete) {
      setInitialLoadComplete(true)
    }
  }, [data, initialLoadComplete])

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

  const hasAnyResourceAccess = useMemo(
    () => hasAtLeastOneItem(allResourcesByArea || {}),
    [allResourcesByArea],
  )

  const value = useMemo(
    () => ({
      allResourcesByArea,
      fetching,
      hasAnyResourceAccess,
    }),
    [allResourcesByArea, fetching, hasAnyResourceAccess],
  )

  return (
    <ResourceAreasContext.Provider value={value}>
      {children}
    </ResourceAreasContext.Provider>
  )
}

export const useResourceAreas = (): ResourceAreasContextValue => {
  const context = useContext(ResourceAreasContext)

  if (context === undefined) {
    throw new Error(
      'useResourceAreas must be used within a ResourceAreasProvider',
    )
  }

  return context
}

export { ResourceAreasContext }
