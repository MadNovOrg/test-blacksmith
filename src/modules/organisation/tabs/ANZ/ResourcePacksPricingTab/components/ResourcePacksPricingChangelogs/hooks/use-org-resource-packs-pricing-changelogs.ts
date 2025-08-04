import { useMemo } from 'react'

import { GetOrgResourcePacksPricingChangelogsQuery } from '@app/generated/graphql'
import {
  OrgResourcePacksPricingChangelogUpdatedColumns,
  useGetOrgResourcePacksPricingChangelogs,
} from '@app/modules/organisation/queries/get-org-resource-packs-changelogs'

export const useOrgResourcePacksPricingChangelogs = ({
  perPage,
  currentPage,
  orgId,
  resourcePacksPricingIds,
}: {
  perPage: number
  currentPage: number
  orgId: string
  resourcePacksPricingIds: string[]
}): {
  changelogs: (Omit<
    GetOrgResourcePacksPricingChangelogsQuery['changelogs'][number],
    'updated_columns'
  > & { updated_columns: OrgResourcePacksPricingChangelogUpdatedColumns })[]
  loading: boolean
  resourcePacksPricingCommonDetails:
    | GetOrgResourcePacksPricingChangelogsQuery['resourcePacksPricings'][number]
    | undefined
  totalCount: number
} => {
  const { data, fetching } = useGetOrgResourcePacksPricingChangelogs({
    limit: perPage,
    offset: currentPage * perPage,
    orgId,
    pause: !orgId || resourcePacksPricingIds.length === 0,
    resourcePacksPricingIds,
    requestPolicy: 'cache-and-network',
  })

  const changelogs: (Omit<
    GetOrgResourcePacksPricingChangelogsQuery['changelogs'][number],
    'updated_columns'
  > & { updated_columns: OrgResourcePacksPricingChangelogUpdatedColumns })[] =
    useMemo(
      () =>
        data?.changelogs.map(changelog => ({
          ...changelog,
          updated_columns:
            changelog.updated_columns as OrgResourcePacksPricingChangelogUpdatedColumns,
        })) || [],
      [data],
    )

  return {
    changelogs,
    loading: fetching,
    resourcePacksPricingCommonDetails: data?.resourcePacksPricings[0],
    totalCount: data?.totalChangelogs.aggregate?.count || 0,
  }
}
