import { useMemo } from 'react'
import { gql, useQuery } from 'urql'
import { useDebounce } from 'use-debounce'

import {
  GetMergeOrgsLogsQuery,
  GetMergeOrgsLogsQueryVariables,
  GetOrgsByIdsQuery,
  GetOrgsByIdsQueryVariables,
  Merge_Organizations_Logs_Bool_Exp,
} from '@app/generated/graphql'
import { NonNullish } from '@app/types'

const MERGE_ORGS_LOGS = gql`
  query GetMergeOrgsLogs(
    $limit: Int!
    $offset: Int!
    $where: merge_organizations_logs_bool_exp!
  ) {
    logs: merge_organizations_logs(
      limit: $limit
      offset: $offset
      where: $where
      order_by: { createdAt: desc }
    ) {
      id
      actionedById
      createdAt
      primaryOrganizationId
      primaryOrganizationName

      actionedBy {
        fullName
      }

      mergedOrganizations {
        id
        organizationId
        organizationName
      }
    }

    aggregate: merge_organizations_logs_aggregate {
      aggregate {
        count
      }
    }
  }
`
const useGetMergeOrgsLogsQuery = ({
  limit,
  offset,
  where = {},
}: GetMergeOrgsLogsQueryVariables) => {
  return useQuery<GetMergeOrgsLogsQuery, GetMergeOrgsLogsQueryVariables>({
    query: MERGE_ORGS_LOGS,
    variables: {
      limit,
      offset,
      where,
    },
  })
}

const ORGS_BY_IDS = gql`
  query GetOrgsByIds($ids: [uuid!]!) {
    organization(where: { id: { _in: $ids } }) {
      id
      name
    }
  }
`
const useGetOrgsByIdsQuery = ({
  ids,
  pause = false,
}: GetOrgsByIdsQueryVariables & { pause: boolean }) => {
  return useQuery<GetOrgsByIdsQuery, GetOrgsByIdsQueryVariables>({
    query: ORGS_BY_IDS,
    variables: {
      ids,
    },
    pause: !ids || ids.length === 0 || pause,
  })
}

type MergeOrgsLogType = NonNullish<GetMergeOrgsLogsQuery['logs'][number]> & {
  primaryOrganization?: {
    id: string
    name: string
  }
}

const isUuid = (str: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    str,
  )

export const useMergeOrgsLogs = ({
  limit,
  offset,
  search,
}: Pick<GetMergeOrgsLogsQueryVariables, 'limit' | 'offset'> & {
  search?: string
}) => {
  const [debouncedSearch] = useDebounce(search, 300)

  const where: Merge_Organizations_Logs_Bool_Exp = useMemo(() => {
    if (!debouncedSearch) return {}

    const words = debouncedSearch.trim().split(/\s+/)

    if (words.length === 0) return {}

    if (words.length === 1 && isUuid(words[0])) {
      return {
        _or: [
          {
            mergedOrganizations: {
              organizationId: {
                _eq: words[0],
              },
            },
          },
        ],
      }
    }

    return {
      _or: [
        {
          primaryOrganizationName: {
            _ilike: `%${words.join('%')}%`,
          },
        },
        {
          mergedOrganizations: {
            _or: [
              {
                organizationName: {
                  _ilike: `%${words.join('%')}%`,
                },
              },
            ],
          },
        },
      ],
    }
  }, [debouncedSearch])

  const [{ data: logsData, fetching: logsFetching }] = useGetMergeOrgsLogsQuery(
    {
      limit,
      offset,
      where,
    },
  )

  const [
    { data: primaryOrganizationsData, fetching: primaryOrganizationsFetching },
  ] = useGetOrgsByIdsQuery({
    ids: logsData?.logs.map(log => log.primaryOrganizationId) || [],
    pause: logsFetching,
  })

  const logs = useMemo(() => {
    return (logsData?.logs.map(log => ({
      ...log,
      primaryOrganization: primaryOrganizationsData?.organization.find(
        org => org.id === log.primaryOrganizationId,
      ),
    })) || []) as MergeOrgsLogType[]
  }, [logsData?.logs, primaryOrganizationsData?.organization])

  const result = useMemo(
    () => ({
      logs,
      fetching: logsFetching || primaryOrganizationsFetching,
      total: logsData?.aggregate.aggregate?.count,
    }),
    [
      logs,
      logsData?.aggregate.aggregate?.count,
      logsFetching,
      primaryOrganizationsFetching,
    ],
  )

  return result
}
