import { useMemo } from 'react'
import { useQuery } from 'urql'

import {
  ResourceDetailsQuery,
  ResourceDetailsQueryVariables,
} from '@app/generated/graphql'

import { RESOURCE_DETAILS_QUERY } from '../queries/get-resource-details'

import { useResourcePermission } from './useResourcePermission'

export function useResourceCategory(
  id: string | undefined,
  searchTerm?: string
) {
  const [{ data, error, fetching }] = useQuery<
    ResourceDetailsQuery,
    ResourceDetailsQueryVariables
  >({
    query: RESOURCE_DETAILS_QUERY,
    variables: {
      id: String(id),
      term: searchTerm,
    },
  })

  const canAccessResource = useResourcePermission()

  const canAcceessCategory = data?.content?.resourceCategory
    ?.resourcePermissions
    ? canAccessResource(data?.content?.resourceCategory?.resourcePermissions)
    : false

  const filteredResources = useMemo(() => {
    if (data?.content?.resourceCategory) {
      return data.content.resourceCategory.resources?.nodes?.filter(
        resource => {
          const permissions = resource?.resourcePermissions

          return permissions ? canAccessResource(permissions) : false
        }
      )
    }

    return []
  }, [canAccessResource, data?.content?.resourceCategory])

  return [
    {
      data:
        data?.content?.resourceCategory && canAcceessCategory
          ? {
              content: {
                resourceCategory: {
                  ...data?.content?.resourceCategory,
                  resources: { nodes: filteredResources },
                },
              },
            }
          : null,
      error,
      fetching,
    },
  ]
}
