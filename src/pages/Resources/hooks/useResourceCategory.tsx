import { useMemo } from 'react'
import { useQuery } from 'urql'

import { useAuth } from '@app/context/auth'
import {
  ResourceDetailsQuery,
  ResourceDetailsQueryVariables,
} from '@app/generated/graphql'
import { CourseLevel, TrainerRoleTypeName } from '@app/types'

import { RESOURCE_DETAILS_QUERY } from '../queries/get-resource-details'

export function useResourceCategory(
  id: string | undefined,
  searchTerm?: string
) {
  const { activeCertificates, trainerRoles } = useAuth()

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

  const filteredResources = useMemo(() => {
    if (data?.content?.resourceCategory) {
      return data.content.resourceCategory.resources?.nodes?.filter(
        resource => {
          const filteredPermissions =
            resource?.resourcePermissions?.certificateLevels?.filter(
              certificateLevel =>
                activeCertificates?.includes(certificateLevel as CourseLevel)
            )

          return (
            (filteredPermissions && filteredPermissions?.length > 0) ||
            (resource?.resourcePermissions?.principalTrainer &&
              trainerRoles?.includes(TrainerRoleTypeName.PRINCIPAL))
          )
        }
      )
    }

    return []
  }, [activeCertificates, data?.content?.resourceCategory, trainerRoles])

  return [
    {
      data: data?.content?.resourceCategory
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
