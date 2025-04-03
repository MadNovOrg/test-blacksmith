import { gql, useQuery } from 'urql'

import {
  GetProfilesByOrganisationQuery,
  GetProfilesByOrganisationQueryVariables,
} from '@app/generated/graphql'

const GET_PROFILES_BY_ORGANISATION = gql`
  query GetProfilesByOrganisation($ids: [uuid!]!) {
    organization(where: { id: { _in: $ids } }) {
      id
      members {
        profile {
          id
          fullName
          archived
          avatar
        }
      }
    }
  }
`

export const useProfilesByOrganisation = ({ ids }: { ids: string[] }) => {
  const [{ data, fetching }] = useQuery<
    GetProfilesByOrganisationQuery,
    GetProfilesByOrganisationQueryVariables
  >({
    query: GET_PROFILES_BY_ORGANISATION,
    variables: {
      ids,
    },
  })

  const profilesByOrganisationMap = new Map<
    string,
    GetProfilesByOrganisationQuery['organization'][0]['members']
  >()
  data?.organization.forEach(org =>
    profilesByOrganisationMap.set(org.id, org.members),
  )

  return { fetching, profilesByOrganisation: profilesByOrganisationMap }
}
