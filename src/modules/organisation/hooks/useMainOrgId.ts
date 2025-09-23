import { gql, useQuery } from 'urql'

import {
  GetMainOrgIdQuery,
  GetMainOrgIdQueryVariables,
} from '@app/generated/graphql'

export const GET_MAIN_ORG_ID = gql`
  query GetMainOrgId($organisation_id: uuid!) {
    organization_by_pk(id: $organisation_id) {
      main_organisation_id
    }
  }
`

export const useMainOrgId = (organisation_id: string | undefined) => {
  const [{ data, error, fetching }] = useQuery<
    GetMainOrgIdQuery,
    GetMainOrgIdQueryVariables
  >({
    query: GET_MAIN_ORG_ID,
    variables: {
      organisation_id,
    },
    pause: !organisation_id,
  })

  return {
    data: data?.organization_by_pk?.main_organisation_id,
    error,
    fetching,
  }
}
