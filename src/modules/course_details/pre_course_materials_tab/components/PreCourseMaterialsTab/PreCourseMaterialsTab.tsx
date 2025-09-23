// Currently not used anywhere
// Check: https://behaviourhub.atlassian.net/browse/TTHP-5036

import { Box } from '@mui/material'
import { useQuery } from 'urql'

import {
  GetResourcesQuery,
  GetResourcesQueryVariables,
} from '@app/generated/graphql'
import { ResourceItemsSkeleton } from '@app/modules/resources/components/ResourceItemSkeleton'
import ResourcesList from '@app/modules/resources/components/ResourcesList'

import { GET_RESOURCES_BY_IDS } from '../../queries/queries'

const MATERIALS_CATEGORY_ID = btoa('term:132')
const EXAMPLE_PRESENTATION_L1_L2_ID = 'cG9zdDo1MjU1'
const PRE_VISIT_FORM_ID = 'cG9zdDo1MDE2'

export const PreCourseMaterialsTab = () => {
  const [{ data, fetching }] = useQuery<
    GetResourcesQuery,
    GetResourcesQueryVariables
  >({
    query: GET_RESOURCES_BY_IDS,
    variables: {
      id: MATERIALS_CATEGORY_ID,
      resourceIds: [EXAMPLE_PRESENTATION_L1_L2_ID, PRE_VISIT_FORM_ID],
    },
  })
  const resourceCategory = data?.content?.resourceCategory
  const resources = resourceCategory?.resources?.nodes ?? []

  return fetching ? (
    <ResourceItemsSkeleton />
  ) : (
    <Box>
      <ResourcesList resources={resources} />
    </Box>
  )
}
