import { useQuery, gql } from 'urql'

import { GetRolesQuery } from '@app/generated/graphql'

export const GET_ROLES = gql`
  query GetRoles {
    role {
      id
      name
    }
  }
`
export default function useRoles() {
  const [{ data, error, fetching }] = useQuery<GetRolesQuery>({
    query: GET_ROLES,
  })

  return {
    roles: data?.role,
    error,
    fetching,
  }
}
