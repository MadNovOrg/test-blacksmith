import { useMemo } from 'react'
import { useQuery } from 'urql'

import {
  ResourceDetailsQuery,
  ResourceDetailsQueryVariables,
} from '@app/generated/graphql'
import { isNotNullish } from '@app/util'

import { RESOURCE_DETAILS_QUERY } from '../queries/get-resource-details'

import { useResourcePermission } from './useResourcePermission'

export type ResourceCategory = NonNullable<
  ResourceDetailsQuery['content']
>['resourceCategory']

export function useResourceCategory(
  id: string | undefined,
  searchTerm?: string,
) {
  const [{ data, error, fetching }] = useQuery<
    ResourceDetailsQuery,
    ResourceDetailsQueryVariables
  >({
    query: RESOURCE_DETAILS_QUERY,
    variables: {
      id: String(id),
    },
  })

  const canAccessResource = useResourcePermission()

  const canAccessCategory = data?.content?.resourceCategory?.resourcePermissions
    ? canAccessResource(data?.content?.resourceCategory?.resourcePermissions)
    : false

  const filteredResourceCategory = useMemo(
    () =>
      data?.content?.resourceCategory && canAccessCategory
        ? filterCategoryResources(
            data.content.resourceCategory,
            canAccessResource,
            searchTerm ?? '',
          )
        : null,
    [
      canAccessCategory,
      canAccessResource,
      data?.content?.resourceCategory,
      searchTerm,
    ],
  )

  return [
    {
      data:
        data?.content?.resourceCategory && canAccessCategory
          ? {
              content: {
                resourceCategory: filteredResourceCategory,
              },
            }
          : null,
      error,
      fetching,
    },
  ]
}

function filterCategoryResources(
  resourceCategory: ResourceCategory,
  canAccessResource: ReturnType<typeof useResourcePermission>,
  searchTerm: string,
): ResourceCategory {
  if (!resourceCategory?.id) {
    return undefined
  }

  return {
    id: resourceCategory?.id,
    name: resourceCategory?.name,
    description: resourceCategory?.description,
    resourcePermissions: resourceCategory?.resourcePermissions,
    resources: resourceCategory?.resources?.nodes?.length
      ? {
          nodes: resourceCategory.children?.nodes?.length
            ? resourceCategory.resources.nodes.filter(
                resource =>
                  resource?.resourcePermissions &&
                  canAccessResource(resource.resourcePermissions),
              )
            : resourceCategory.resources.nodes.filter(
                resource =>
                  resource?.resourcePermissions &&
                  canAccessResource(resource.resourcePermissions) &&
                  (resource?.title ?? '')
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()),
              ),
        }
      : undefined,
    children: {
      nodes: resourceCategory.children?.nodes
        ?.map(childCategory =>
          filterCategoryResources(childCategory, canAccessResource, searchTerm),
        )
        .filter(isNotNullish),
    },
  }
}
